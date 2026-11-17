import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';

const StudentsView = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    admissionNumber: '',
    rollNumber: '',
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '2012-01-01',
    bloodGroup: 'O+',
    class: '',
    section: '',
    email: '',
    phone: '',
  });

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    bloodGroup: '',
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);

      const res = await api.getStudents(params.toString());
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      showToast('Error loading students: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.getClasses();
      if (res.success) {
        setClasses(res.data);
        if (res.data.length > 0 && !formData.class) {
          setFormData((prev) => ({
            ...prev,
            class: res.data[0]._id,
            section: res.data[0].sections?.[0]?._id || '',
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleClassChange = (classId) => {
    const cls = classes.find((c) => c._id === classId);
    setFormData({
      ...formData,
      class: classId,
      section: cls?.sections?.[0]?._id || '',
    });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createStudent({
        ...formData,
        academicSession: classes[0]?.academicSession || '67d1a298f2b4e85741000001',
      });

      if (res.success) {
        showToast('Student successfully admitted and enrolled!', 'success');
        setIsAddModalOpen(false);
        setFormData({
          admissionNumber: '',
          rollNumber: '',
          firstName: '',
          lastName: '',
          gender: 'male',
          dateOfBirth: '2012-01-01',
          bloodGroup: 'O+',
          class: classes[0]?._id || '',
          section: classes[0]?.sections?.[0]?._id || '',
          email: '',
          phone: '',
        });
        fetchStudents();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone || '',
      email: student.email || '',
      bloodGroup: student.bloodGroup || 'O+',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateStudent(selectedStudent._id, editForm);

      if (res.success) {
        showToast('Student record updated successfully!', 'success');
        setIsEditModalOpen(false);
        fetchStudents();
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStudentStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.toggleStudentStatus(student._id, newStatus);

      if (res.success) {
        showToast(`Student status updated to ${newStatus}!`, 'success');
        fetchStudents();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const currentClassObj = classes.find((c) => c._id === formData.class);

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search by name or admission no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button onClick={() => setIsAddModalOpen(true)}>+ Admit New Student</Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading student directory..." />
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            description="No student records matched your search or filters. Click below to admit a student."
            action={<Button onClick={() => setIsAddModalOpen(true)}>+ Register First Student</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Adm No.</th>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Class & Section</th>
                  <th className="py-3 px-4 font-semibold">Roll No</th>
                  <th className="py-3 px-4 font-semibold">Gender</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 text-xs">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                          {student.firstName.charAt(0)}
                        </div>
                        <button
                          onClick={() => handleOpenDetails(student)}
                          className="hover:text-blue-600 hover:underline text-left font-semibold"
                        >
                          {student.firstName} {student.lastName}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.class?.name || 'Class'} - Sec {student.section?.name || 'A'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{student.rollNumber}</td>
                    <td className="py-3 px-4 text-slate-600 capitalize">{student.gender}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {student.phone || student.parent?.phone || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={student.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetails(student)}
                        className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="text-xs font-semibold px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStudentStatus(student)}
                        className={`text-xs font-semibold px-2 py-1 rounded border transition ${
                          student.status === 'active'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {student.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Student Registration & Admission"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Admission Number *"
              placeholder="e.g. ADM-2026-005"
              value={formData.admissionNumber}
              onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
              required
            />
            <Input
              label="Roll Number *"
              placeholder="e.g. 105"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="Aarav"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name *"
              placeholder="Sharma"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Class *
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                value={formData.class}
                onChange={(e) => handleClassChange(e.target.value)}
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
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
              >
                {currentClassObj?.sections?.map((s) => (
                  <option key={s._id} value={s._id}>
                    Section {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender *
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date of Birth *"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91 98765 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Admit & Save Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Student Profile Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Student Information Profile"
        maxWidth="max-w-lg"
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
                {selectedStudent.firstName.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h4>
                <p className="text-slate-500 font-mono">Adm: {selectedStudent.admissionNumber}</p>
                <div className="mt-1">
                  <Badge status={selectedStudent.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-white border rounded-lg">
              <div>
                <span className="text-slate-400 block font-medium">Class & Section:</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.class?.name} - {selectedStudent.section?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Roll Number:</span>
                <span className="font-bold font-mono text-slate-800">{selectedStudent.rollNumber}</span>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 block font-medium">Date of Birth:</span>
                <span className="text-slate-700">
                  {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 block font-medium">Blood Group:</span>
                <span className="text-slate-700">{selectedStudent.bloodGroup || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 bg-white border rounded-lg space-y-1.5">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Parent / Guardian Information
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Father's Name:</span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.parent?.fatherName || 'Not recorded'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Phone:</span>
                <span className="font-mono">{selectedStudent.parent?.phone || selectedStudent.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Email:</span>
                <span>{selectedStudent.parent?.email || selectedStudent.email || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <Button size="sm" onClick={() => setIsDetailsModalOpen(false)}>
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Information"
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name *"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name *"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsView;
