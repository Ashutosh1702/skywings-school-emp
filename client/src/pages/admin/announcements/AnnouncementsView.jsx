import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AnnouncementsView = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    priority: 'normal',
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.getAnnouncements();
      if (res.success) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      showToast('Error loading announcements: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createAnnouncement({
        ...form,
        targetAudience: [form.targetAudience],
      });

      if (res.success) {
        showToast('Announcement broadcasted to portals!', 'success');
        setIsModalOpen(false);
        setForm({ title: '', message: '', targetAudience: 'all', priority: 'normal' });
        fetchAnnouncements();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">School Announcements & Notices</h3>
          <p className="text-xs text-slate-500">Broadcast administrative notices and circulars</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ New Announcement</Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching circulars & announcements..." />
      ) : announcements.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center text-slate-500">
          No announcements published yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge status={a.priority || (a.isUrgent ? 'urgent' : 'normal')}>
                    {(a.priority || (a.isUrgent ? 'urgent' : 'normal'))?.toUpperCase()}
                  </Badge>
                  <h4 className="font-bold text-slate-900 text-base">{a.title}</h4>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(a.createdAt || a.publishDate || Date.now()).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{a.message || a.content}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span>Published by: {a.author?.name || 'School Administration'}</span>
                <span className="capitalize">
                  Audience:{' '}
                  {Array.isArray(a.targetAudience)
                    ? a.targetAudience.join(', ')
                    : (a.targetAudience || 'All')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Announcement"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Announcement Title *"
            placeholder="e.g. Science Exhibition & Open House"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Message Content *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 h-28"
              placeholder="Write the circular instructions..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience *
              </label>
              <select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="all">Everyone (All)</option>
                <option value="teachers">Teachers Only</option>
                <option value="parents">Parents Only</option>
                <option value="students">Students Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level *
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AnnouncementsView;

