const express = require('express');
const router = express.Router();
const {
  getBooks,
  addBook,
  issueBook,
  returnBook,
  getBookIssues,
} = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/books', protect, getBooks);
router.post('/books', protect, authorize('admin'), addBook);
router.get('/issues', protect, getBookIssues);
router.post('/issue', protect, authorize('admin', 'teacher'), issueBook);
router.post('/return/:issueId', protect, authorize('admin', 'teacher'), returnBook);

module.exports = router;

