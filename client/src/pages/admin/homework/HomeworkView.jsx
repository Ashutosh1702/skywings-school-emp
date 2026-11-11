import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';

const HomeworkView = () => {
  const { showToast } = useToast();
  const [homeworkList, setHomeworkList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    class: '',
    section: '',
    subject: '',
    dueDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hRes, cRes, sRes] = await Promise.all([
        api.getHomework(),
        api.getClasses(),
        api.getSubjects(),
      ]);

      if (hRes.success) setHomeworkList(hRes.data);
      if (cRes.success && cRes.data.length > 0) {
        setClasses(cRes.data);
        if (!form.class) {
          setForm((prev) => ({
            ...prev,
            class: cRes.data[0]._id,
            section: cRes.data[0].sections?.[0]?._id || '',
          }));
        }
      }
      if (sRes.success && sRes.data.length > 0) {
        setSubjects(sRes.data);
        if (!form.subject) {
          setForm((prev) => ({ ...prev, subject: sRes.data[0]._id }));
        }
      }
    } catch (err) {
      showToast('Error loading homework: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createHomework(form);
      if (res.success) {
        showToast('Homework assigned and published to class section!', 'success');
        setIsModalOpen(false);
        setForm({
          title: '',
          description: '',
          class: classes[0]?._id || '',
          section: classes[0]?.sections?.[0]?._id || '',
          subject: subjects[0]?._id || '',
          dueDate: '',
        });
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentClassObj = classes.find((c) => c._id === form.class);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Homework & Assignments</h3>
          <p className="text-xs text-slate-500">Subject assignments, instructions, and submission tracking</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Homework</Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading homework assignments..." />
      ) : homeworkList.length === 0 ? (
        <EmptyState
          title="No homework assigned"
          description="There are currently no active homework assignments."
          action={<Button onClick={() => setIsModalOpen(true)}>+ Assign First Homework</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworkList.map((hw) => (
            <div
              key={hw._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                    {hw.subject?.name || 'General Subject'}
                  </span>
                  <Badge status="upcoming">
                    Due: {new Date(hw.dueDate).toLocaleDateString()}
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2">{hw.title}</h4>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {hw.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {hw.class?.name} • Sec {hw.section?.name}
                </span>
                <span>By: {hw.assignedBy?.name || 'Instructor'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Homework Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Class Homework"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Homework Title *"
            placeholder="e.g. Chapter 4 Quadratic Equations Exercises"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Class *
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                value={form.class}
                onChange={(e) => {
                  const cls = classes.find((c) => c._id === e.target.value);
                  setForm({
                    ...form,
                    class: e.target.value,
                    section: cls?.sections?.[0]?._id || '',
                  });
                }}
                required
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section *
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                required
              >
                {currentClassObj?.sections?.map((s) => (
                  <option key={s._id} value={s._id}>
                    Sec {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Submission Due Date *"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Homework Instructions *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 h-24"
              placeholder="Detailed instructions for the students..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Publish Homework
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HomeworkView;

