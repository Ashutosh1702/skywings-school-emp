const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all books
// @route   GET /api/library/books
// @access  Private
const getBooks = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ title: 1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new book to catalog
// @route   POST /api/library/books
// @access  Private (Admin only)
const addBook = async (req, res, next) => {
  try {
    const { isbn, title, author, category, totalCopies, rackNumber } = req.body;

    const existing = await Book.findOne({ isbn: isbn.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const copies = Number(totalCopies) || 1;
    const book = await Book.create({
      isbn: isbn.toUpperCase(),
      title,
      author,
      category: category || 'General',
      totalCopies: copies,
      availableCopies: copies,
      rackNumber: rackNumber || 'Rack A-1',
    });

    await logAction({
      userId: req.user._id,
      action: 'ADD_BOOK',
      entity: 'Book',
      entityId: book._id,
      details: { title, isbn },
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue a book to student
// @route   POST /api/library/issue
// @access  Private (Admin / Librarian)
const issueBook = async (req, res, next) => {
  try {
    const { bookId, studentId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available for issue' });
    }

    const issue = await BookIssue.create({
      book: bookId,
      student: studentId,
      dueDate: new Date(dueDate),
      issuedBy: req.user._id,
    });

    book.availableCopies -= 1;
    if (book.availableCopies === 0) book.status = 'out_of_stock';
    await book.save();

    await logAction({
      userId: req.user._id,
      action: 'ISSUE_BOOK',
      entity: 'BookIssue',
      entityId: issue._id,
      details: { bookTitle: book.title, studentId },
    });

    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc    Return an issued book
// @route   POST /api/library/return/:issueId
// @access  Private (Admin / Librarian)
const returnBook = async (req, res, next) => {
  try {
    const issue = await BookIssue.findById(req.params.issueId).populate('book');
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book has already been returned' });
    }

    issue.returnDate = new Date();
    issue.status = 'returned';

    // Calculate fine if overdue (e.g. ₹5 per day late)
    if (new Date() > new Date(issue.dueDate)) {
      const diffTime = Math.abs(new Date() - new Date(issue.dueDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      issue.fineAmount = diffDays * 5;
    }

    await issue.save();

    const book = await Book.findById(issue.book._id);
    if (book) {
      book.availableCopies += 1;
      book.status = 'available';
      await book.save();
    }

    await logAction({
      userId: req.user._id,
      action: 'RETURN_BOOK',
      entity: 'BookIssue',
      entityId: issue._id,
      details: { fineAmount: issue.fineAmount },
    });

    res.status(200).json({ success: true, message: 'Book returned successfully', data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active book issues
// @route   GET /api/library/issues
// @access  Private
const getBookIssues = async (req, res, next) => {
  try {
    const issues = await BookIssue.find()
      .sort({ createdAt: -1 })
      .populate('book', 'title isbn author')
      .populate('student', 'firstName lastName admissionNumber rollNumber')
      .populate('issuedBy', 'name');

    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  addBook,
  issueBook,
  returnBook,
  getBookIssues,
};

