import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [1, 2, 3, 4, 5, 6];

const TimetableView = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    dayOfWeek: 'Monday',
    periodNumber: 1,
    startTime: '08:30',
    endTime: '09:15',
    subject: '',
    teacher: '',
    roomNumber: 'Room 101',
  });

  const fetchDependencies = async () => {
    try {
      setLoading(true);
      const [cRes, subRes, tRes] = await Promise.all([
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
      ]);

      if (cRes.success && cRes.data.length > 0) {
        setClasses(cRes.data);
        setSelectedClass(cRes.data[0]._id);
        setSelectedSection(cRes.data[0].sections?.[0]?._id || '');
      }
      if (subRes.success) setSubjects(subRes.data);
      if (tRes.success) setTeachers(tRes.data);
    } catch (err) {
      showToast('Error loading timetable data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedClass || !selectedSection) return;
    try {
      const res = await api.getTimetable(`classId=${selectedClass}&sectionId=${selectedSection}`);
      if (res.success) {
        setSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchTimetable();
    }
  }, [selectedClass, selectedSection]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createTimetableSlot({
        ...form,
        class: selectedClass,
        section: selectedSection,
        academicSession: classes[0]?.academicSession || '67d1a298f2b4e85741000001',
      });

      if (res.success) {
        showToast('Timetable period scheduled successfully without clash!', 'success');
        setIsModalOpen(false);
        fetchTimetable();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentClassObj = classes.find((c) => c._id === selectedClass);

  return (
    <div className="space-y-6">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                const cls = classes.find((c) => c._id === e.target.value);
                setSelectedSection(cls?.sections?.[0]?._id || '');
              }}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
            >
              {currentClassObj?.sections?.map((s) => (
                <option key={s._id} value={s._id}>
                  Section {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>+ Add Timetable Period</Button>
      </div>

      {/* Weekly Timetable Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto p-4">
        {loading ? (
          <LoadingSpinner label="Loading schedule matrix..." />
        ) : (
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                <th className="p-3 border border-slate-200 text-left">Day / Period</th>
                {periods.map((p) => (
                  <th key={p} className="p-3 border border-slate-200">
                    Period {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-200 text-left font-bold text-slate-800 text-xs bg-slate-50">
                    {day}
                  </td>
                  {periods.map((periodNum) => {
                    const match = slots.find(
                      (s) => s.dayOfWeek === day && s.periodNumber === periodNum
                    );

                    return (
                      <td key={periodNum} className="p-2 border border-slate-200 text-xs align-top">
                        {match ? (
                          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-left space-y-1">
                            <p className="font-bold text-blue-900">{match.subject?.name}</p>
                            <p className="text-[11px] text-slate-500">{match.teacher?.name}</p>
                            <span className="block text-[10px] font-mono text-blue-600">
                              {match.startTime} - {match.endTime}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[11px] italic">Free Period</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Period with Clash Prevention"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Day of Week *
              </label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Period Number *
              </label>
              <select
                value={form.periodNumber}
                onChange={(e) => setForm({ ...form, periodNumber: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>
                    Period {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time *"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time *"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject *
            </label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              required
            >
              <option value="">Select subject...</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Teacher *
            </label>
            <select
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              required
            >
              <option value="">Select teacher...</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Verify & Assign Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetableView;

