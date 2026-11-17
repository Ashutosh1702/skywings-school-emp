import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';

const TeachersView = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    designation: 'Senior Teacher',
    department: 'Science',
    qualification: 'M.Sc, B.Ed',
    password: '',
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await api.getTeachers(params.toString());
      if (res.success) {
        setTeachers(res.data);
      }
    } catch (err) {
      showToast('Error loading teachers: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createTeacher(formData);
      if (res.success) {
        showToast('Teacher successfully registered with portal access!', 'success');
        setIsModalOpen(false);
        setFormData({
          employeeId: '',
          name: '',
          email: '',
          phone: '',
          designation: 'Senior Teacher',
          department: 'Science',
          qualification: 'M.Sc, B.Ed',
          password: '',
        });
        fetchTeachers();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchTeachers();
          }}
          className="flex items-center gap-2 flex-1 max-w-md w-full"
        >
          <Input
            placeholder="Search by name, employee ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <Button onClick={() => setIsModalOpen(true)}>+ Register New Teacher</Button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading faculty directory..." />
        ) : teachers.length === 0 ? (
          <EmptyState
            title="No teachers found"
            description="No teacher records found. Register your first staff member to get started."
            action={<Button onClick={() => setIsModalOpen(true)}>+ Register First Teacher</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Emp ID</th>
                  <th className="py-3 px-4 font-semibold">Teacher Name</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Designation</th>
                  <th className="py-3 px-4 font-semibold">Contact Info</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 text-xs">
                      {t.employeeId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p>{t.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{t.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{t.department}</td>
                    <td className="py-3 px-4 text-slate-600">{t.designation}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      <div>{t.email}</div>
                      <div className="text-slate-400">{t.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Faculty & Teacher Registration"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              placeholder="e.g. EMP-T-102"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
            <Input
              label="Full Name *"
              placeholder="Priya Mukherjee"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Email Address *"
              type="email"
              placeholder="priya@skywings.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone *"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department *"
              placeholder="e.g. Mathematics / Sciences"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Input
              label="Designation *"
              placeholder="e.g. Senior PGT Instructor"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Qualifications"
              placeholder="M.Sc, B.Ed"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
            <Input
              label="Initial Password *"
              type="password"
              placeholder="Teacher@123"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Register Faculty Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeachersView;

