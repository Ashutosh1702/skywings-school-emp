import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import EmptyState from '../../../components/ui/EmptyState';

const ParentsView = () => {
  const { showToast } = useToast();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    email: '',
    phone: '',
    occupation: 'Business / Professional',
    password: '',
    children: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const [pRes, sRes] = await Promise.all([
        api.getParents(params.toString()),
        api.getStudents(),
      ]);

      if (pRes.success) setParents(pRes.data);
      if (sRes.success) setStudents(sRes.data);
    } catch (err) {
      showToast('Error loading parents: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createParent(formData);
      if (res.success) {
        showToast('Parent registered and linked to portal access!', 'success');
        setIsModalOpen(false);
        setFormData({
          fatherName: '',
          motherName: '',
          email: '',
          phone: '',
          occupation: 'Business / Professional',
          password: '',
          children: [],
        });
        fetchData();
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
            fetchData();
          }}
          className="flex items-center gap-2 flex-1 max-w-md w-full"
        >
          <Input
            placeholder="Search parents by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <Button onClick={() => setIsModalOpen(true)}>+ Register New Parent</Button>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading parent directory..." />
        ) : parents.length === 0 ? (
          <EmptyState
            title="No parents found"
            description="No parent records match your query."
            action={<Button onClick={() => setIsModalOpen(true)}>+ Register First Parent</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Father's Name</th>
                  <th className="py-3 px-4 font-semibold">Mother's Name</th>
                  <th className="py-3 px-4 font-semibold">Contact Email & Phone</th>
                  <th className="py-3 px-4 font-semibold">Occupation</th>
                  <th className="py-3 px-4 font-semibold">Linked Children</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parents.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{p.fatherName}</td>
                    <td className="py-3 px-4 text-slate-600">{p.motherName || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      <div>{p.email}</div>
                      <div className="text-slate-400 font-mono">{p.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.occupation}</td>
                    <td className="py-3 px-4">
                      {p.children?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {p.children.map((child) => (
                            <span
                              key={child._id}
                              className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 font-medium border border-blue-200"
                            >
                              {child.firstName} {child.lastName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">None linked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Parent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Parent / Guardian Registration"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Father's Name *"
              placeholder="Vikramaditya Roy"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              required
            />
            <Input
              label="Mother's Name"
              placeholder="Ananya Roy"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email *"
              type="email"
              placeholder="parent@skywings.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone *"
              placeholder="+91 97410 98765"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Occupation"
              placeholder="Engineer / Business"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            />
            <Input
              label="Initial Password *"
              type="password"
              placeholder="Parent@123"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Link Student / Child (Optional)
            </label>
            <select
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              onChange={(e) => {
                if (e.target.value && !formData.children.includes(e.target.value)) {
                  setFormData({
                    ...formData,
                    children: [...formData.children, e.target.value],
                  });
                }
              }}
            >
              <option value="">Select student to link...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Register Parent
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParentsView;

