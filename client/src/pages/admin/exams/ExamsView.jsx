import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ExamsView = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeExam, setActiveExam] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [examForm, setExamForm] = useState({
    name: '',
    examType: 'mid_term',
    class: '',
    startDate: '',
    endDate: '',
  });

  const [marksList, setMarksList] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const [eRes, cRes, sRes] = await Promise.all([
        api.getExams(),
        api.getClasses(),
        api.getStudents(),
      ]);

      if (eRes.success) setExams(eRes.data);
      if (cRes.success) {
        setClasses(cRes.data);
        if (cRes.data.length > 0 && !examForm.class) {
          setExamForm((prev) => ({ ...prev, class: cRes.data[0]._id }));
        }
      }
      if (sRes.success) setStudents(sRes.data);
    } catch (err) {
      showToast('Error loading exams: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createExam({
        ...examForm,
        academicSession: classes[0]?.academicSession || '67d1a298f2b4e85741000001',
      });
      if (res.success) {
        showToast('Examination scheduled successfully!', 'success');
        setIsExamModalOpen(false);
        setExamForm({
          name: '',
          examType: 'mid_term',
          class: classes[0]?._id || '',
          startDate: '',
          endDate: '',
        });
        fetchExams();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenMarksEntry = (exam) => {
    setActiveExam(exam);
    // filter students in this exam class
    const examStudents = students.filter(
      (s) => s.class?._id === exam.class?._id || s.class === exam.class?._id
    );

    const initialMarks = examStudents.map((s) => ({
      studentId: s._id,
      name: `${s.firstName} ${s.lastName}`,
      rollNumber: s.rollNumber,
      marksObtained: 75,
      maxMarks: 100,
      remarks: 'Satisfactory',
    }));

    setMarksList(initialMarks);
    setSelectedSubjectId(exam.subjects?.[0]?.subject?._id || exam.subjects?.[0]?._id || '');
    setIsMarksModalOpen(true);
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitMarks(activeExam._id, {
        classId: activeExam.class?._id,
        sectionId: activeExam.class?.sections?.[0]?._id || null,
        subjectId: selectedSubjectId,
        marksList,
      });

      if (res.success) {
        showToast('Subject marks entered and calculated successfully!', 'success');
        setIsMarksModalOpen(false);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewReportCard = async (examId, studentId) => {
    try {
      const res = await api.getReportCard(examId, studentId);
      if (res.success) {
        setReportData(res.data);
        setIsReportModalOpen(true);
      }
    } catch (err) {
      showToast('No report card available: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Examinations & Grade Publishing</h3>
          <p className="text-xs text-slate-500">Manage test schedules, enter marks, and generate report cards</p>
        </div>
        <Button onClick={() => setIsExamModalOpen(true)}>+ Schedule New Exam</Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading examinations..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{exam.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">
                    {exam.examType?.replace('_', ' ')} • {exam.class?.name}
                  </p>
                </div>
                <Badge status={exam.status} />
              </div>

              <div className="p-5 space-y-3 flex-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Start Date:</span>
                  <span className="font-medium">{new Date(exam.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">End Date:</span>
                  <span className="font-medium">{new Date(exam.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Academic Session:</span>
                  <span className="font-medium">{exam.academicSession?.name || '2026-2027'}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenMarksEntry(exam)}>
                  ✏️ Enter Marks
                </Button>
                {students.length > 0 && (
                  <button
                    onClick={() => handleViewReportCard(exam._id, students[0]._id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Sample Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Schedule New Examination"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Examination Title *"
            placeholder="e.g. Final Term Exams 2026"
            value={examForm.name}
            onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Exam Type *
              </label>
              <select
                value={examForm.examType}
                onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="unit_test">Unit Test</option>
                <option value="mid_term">Mid-Term</option>
                <option value="final_term">Final Term</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Class *
              </label>
              <select
                value={examForm.class}
                onChange={(e) => setExamForm({ ...examForm, class: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                required
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={examForm.startDate}
              onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date *"
              type="date"
              value={examForm.endDate}
              onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Publish Schedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title={`Marks Entry — ${activeExam?.name}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmitMarks} className="space-y-4">
          <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Roll No</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Score (Max: 100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marksList.map((m, idx) => (
                  <tr key={m.studentId}>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-600">{m.rollNumber}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{m.name}</td>
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={m.marksObtained}
                        onChange={(e) => {
                          const updated = [...marksList];
                          updated[idx].marksObtained = Number(e.target.value);
                          setMarksList(updated);
                        }}
                        className="w-24 px-3 py-1 text-sm border rounded font-mono font-bold"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsMarksModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save & Calculate Grades
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Report Card Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Student Academic Report Card"
        maxWidth="max-w-md"
      >
        {reportData && (
          <div className="space-y-4 text-slate-800 p-2">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base tracking-tight text-blue-900">
                SKYWINGS INTERNATIONAL ACADEMY
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-1">{reportData.exam?.name}</p>
              <p className="text-sm font-bold text-slate-800 mt-2">
                {reportData.student?.firstName} {reportData.student?.lastName} (Roll:{' '}
                {reportData.student?.rollNumber})
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-center">Marks</th>
                    <th className="py-2 px-3 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.marks?.map((m) => (
                    <tr key={m._id}>
                      <td className="py-2 px-3 font-semibold text-slate-800">{m.subject?.name}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold">
                        {m.marksObtained} / {m.maxMarks}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700">
                          {m.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <p className="text-slate-500">Overall Percentage</p>
                <p className="font-bold text-base text-slate-800">
                  {reportData.summary?.overallPercentage}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Result Status</p>
                <p className="font-bold text-sm text-emerald-700">PASSED</p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                🖨️ Print Report Card
              </Button>
              <Button size="sm" onClick={() => setIsReportModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamsView;

