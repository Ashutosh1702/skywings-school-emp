import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const LibraryView = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState('catalogue');
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [bookForm, setBookForm] = useState({
    isbn: '',
    title: '',
    author: '',
    category: 'Computer Science',
    totalCopies: 5,
    rackNumber: 'Rack CS-1',
  });

  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentId: '',
    dueDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bRes, iRes, sRes] = await Promise.all([
        api.getBooks(),
        api.getBookIssues(),
        api.getStudents(),
      ]);

      if (bRes.success) setBooks(bRes.data);
      if (iRes.success) setIssues(iRes.data);
      if (sRes.success) setStudents(sRes.data);
    } catch (err) {
      showToast('Error loading library data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.addBook(bookForm);
      if (res.success) {
        showToast('Book added to library catalog!', 'success');
        setIsBookModalOpen(false);
        setBookForm({
          isbn: '',
          title: '',
          author: '',
          category: 'Computer Science',
          totalCopies: 5,
          rackNumber: 'Rack CS-1',
        });
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.issueBook(issueForm);
      if (res.success) {
        showToast('Book issued to student successfully!', 'success');
        setIsIssueModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      const res = await api.returnBook(issueId);
      if (res.success) {
        showToast(
          res.data?.fineAmount > 0
            ? `Book returned! Overdue fine of ₹${res.data.fineAmount} applied.`
            : 'Book returned in good order!',
          'success'
        );
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('catalogue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === 'catalogue' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📚 Book Catalogue
          </button>
          <button
            onClick={() => setTab('issues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === 'issues' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔖 Active Issues & Returns
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsIssueModalOpen(true)}>
            + Issue Book
          </Button>
          <Button size="sm" onClick={() => setIsBookModalOpen(true)}>
            + Add New Book
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading library collection..." />
      ) : tab === 'catalogue' ? (
        /* Catalogue Table */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">ISBN</th>
                  <th className="py-3 px-4 font-semibold">Book Title</th>
                  <th className="py-3 px-4 font-semibold">Author</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Rack Location</th>
                  <th className="py-3 px-4 font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 text-xs">{b.isbn}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{b.title}</td>
                    <td className="py-3 px-4 text-slate-600">{b.author}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{b.category}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{b.rackNumber}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="font-bold text-emerald-600">{b.availableCopies}</span> /{' '}
                      {b.totalCopies} left
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Issued Books Table */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Book Title</th>
                  <th className="py-3 px-4 font-semibold">Issued To</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{i.book?.title}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {i.student?.firstName} {i.student?.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(i.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs font-semibold">
                      {new Date(i.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={i.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {i.status === 'issued' ? (
                        <button
                          onClick={() => handleReturnBook(i._id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                        >
                          Check In & Return
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Returned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Catalog New Book">
        <form onSubmit={handleAddBook} className="space-y-4">
          <Input
            label="ISBN / Serial Code *"
            placeholder="ISBN-978-0132350884"
            value={bookForm.isbn}
            onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
            required
          />
          <Input
            label="Book Title *"
            placeholder="Clean Code: A Handbook of Agile Software Craftsmanship"
            value={bookForm.title}
            onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            required
          />
          <Input
            label="Author *"
            placeholder="Robert C. Martin"
            value={bookForm.author}
            onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Stock Copies *"
              type="number"
              value={bookForm.totalCopies}
              onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
              required
            />
            <Input
              label="Shelf / Rack Number"
              placeholder="Rack CS-2"
              value={bookForm.rackNumber}
              onChange={(e) => setBookForm({ ...bookForm, rackNumber: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add to Catalog
            </Button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Library Book">
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Book *
            </label>
            <select
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
              required
            >
              <option value="">Select a title...</option>
              {books
                .filter((b) => b.availableCopies > 0)
                .map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title} ({b.availableCopies} available)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Student *
            </label>
            <select
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              value={issueForm.studentId}
              onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
              required
            >
              <option value="">Select student...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Return Due Date *"
            type="date"
            value={issueForm.dueDate}
            onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Confirm Issue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LibraryView;

