import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';

const AttendanceView = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.getClasses();
        if (res.success && res.data.length > 0) {
          setClasses(res.data);
          setSelectedClass(res.data[0]._id);
          setSelectedSection(res.data[0].sections?.[0]?._id || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  const fetchAttendanceSheet = async () => {
    if (!selectedClass || !selectedSection || !date) return;
    try {
      setLoading(true);
      const res = await api.getClassAttendance(selectedClass, selectedSection, date);
      if (res.success) {
        setRoster(res.data);
      }
    } catch (err) {
      showToast('Error loading attendance sheet: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchAttendanceSheet();
    }
  }, [selectedClass, selectedSection, date]);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    const cls = classes.find((c) => c._id === classId);
    setSelectedSection(cls?.sections?.[0]?._id || '');
  };

  const handleStatusChange = (studentId, newStatus) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleMarkAll = (status) => {
    setRoster((prev) => prev.map((item) => ({ ...item, status })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = roster.map((item) => ({
        studentId: item.studentId,
        status: item.status,
        remarks: item.remarks || '',
      }));

      const res = await api.saveAttendance({
        classId: selectedClass,
        sectionId: selectedSection,
        academicSession: classes[0]?.academicSession || '67d1a298f2b4e85741000001',
        date,
        records,
      });

      if (res.success) {
        showToast('Attendance recorded and synchronized successfully!', 'success');
        fetchAttendanceSheet();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentClassObj = classes.find((c) => c._id === selectedClass);
  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const totalCount = roster.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
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

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll('present')}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('absent')}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
          >
            Mark All Absent
          </button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Daily Attendance
          </Button>
        </div>
      </div>

      {/* Real-time Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Students</p>
          <h4 className="text-xl font-bold text-slate-800 mt-1">{totalCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Present</p>
          <h4 className="text-xl font-bold text-emerald-700 mt-1">{presentCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-rose-600 font-semibold uppercase">Absent</p>
          <h4 className="text-xl font-bold text-rose-700 mt-1">{absentCount}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-blue-600 font-semibold uppercase">Attendance Rate</p>
          <h4 className="text-xl font-bold text-blue-700 mt-1">{attendanceRate}%</h4>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Fetching classroom roster..." />
        ) : roster.length === 0 ? (
          <EmptyState
            title="No students in this class section"
            description="Please register students to this section first or select a different class."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Roll No</th>
                  <th className="py-3 px-4 font-semibold">Admission No</th>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{student.rollNumber}</td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{student.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {['present', 'absent', 'late', 'leave'].map((statusOption) => {
                          const isSelected = student.status === statusOption;
                          const colors = {
                            present: isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                            absent: isSelected
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                            late: isSelected
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                            leave: isSelected
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                          };

                          return (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => handleStatusChange(student.studentId, statusOption)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize border transition ${colors[statusOption]}`}
                            >
                              {statusOption}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;

