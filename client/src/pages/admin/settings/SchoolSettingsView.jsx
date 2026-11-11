import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const SchoolSettingsView = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // School profile state
  const [profile, setProfile] = useState({
    name: '',
    code: '',
    affiliationNumber: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  // Master data state
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  // Modals
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const [sessionForm, setSessionForm] = useState({
    name: '2027-2028',
    startDate: '2027-04-01',
    endDate: '2028-03-31',
    isCurrent: false,
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    type: 'theory',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, sessionsRes, subjectsRes, classesRes] = await Promise.all([
        api.getSchoolProfile(),
        api.getAcademicSessions(),
        api.getSubjects(),
        api.getClasses(),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile({
          name: profileRes.data.name || '',
          code: profileRes.data.code || '',
          affiliationNumber: profileRes.data.affiliationNumber || '',
          email: profileRes.data.email || '',
          phone: profileRes.data.phone || '',
          website: profileRes.data.website || '',
          address: {
            street: profileRes.data.address?.street || '',
            city: profileRes.data.address?.city || '',
            state: profileRes.data.address?.state || '',
            zipCode: profileRes.data.address?.zipCode || '',
            country: profileRes.data.address?.country || '',
          },
        });
      }

      if (sessionsRes.success) setSessions(sessionsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (classesRes.success) setClasses(classesRes.data);
    } catch (err) {
      showToast('Error loading school settings: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateSchoolProfile(profile);

      if (res.success) {
        showToast('School institutional profile updated successfully!', 'success');
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createAcademicSession(sessionForm);

      if (res.success) {
        showToast('Academic session cycle created!', 'success');
        setIsSessionModalOpen(false);
        fetchData();
      } else {
        showToast(res.message || 'Creation failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createSubject(subjectForm);
      if (res.success) {
        showToast('New subject added to school curriculum!', 'success');
        setIsSubjectModalOpen(false);
        setSubjectForm({ name: '', code: '', type: 'theory' });
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
      {/* Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('profile')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              tab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🏫 School Institutional Profile
          </button>
          <button
            onClick={() => setTab('sessions')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              tab === 'sessions'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📅 Academic Sessions
          </button>
          <button
            onClick={() => setTab('subjects')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              tab === 'subjects'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📖 Curriculum Subjects
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading institutional settings..." />
      ) : tab === 'profile' ? (
        /* School Profile Form */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
          <div className="mb-6 pb-4 border-b">
            <h3 className="font-bold text-slate-900 text-lg">School Profile & Registration</h3>
            <p className="text-xs text-slate-500">Official institution details appearing on receipts and certificates</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="School Legal Name *"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
              <Input
                label="School Code *"
                value={profile.code}
                onChange={(e) => setProfile({ ...profile, code: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Board Affiliation Number"
                value={profile.affiliationNumber}
                onChange={(e) => setProfile({ ...profile, affiliationNumber: e.target.value })}
              />
              <Input
                label="Official Website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Email *"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
              <Input
                label="Contact Phone *"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Postal Campus Address
              </label>
              <div className="space-y-3">
                <Input
                  placeholder="Street / Campus Address"
                  value={profile.address.street}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value },
                    })
                  }
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    placeholder="City"
                    value={profile.address.city}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, city: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="State"
                    value={profile.address.state}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, state: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Zip / PIN Code"
                    value={profile.address.zipCode}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, zipCode: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Country"
                    value={profile.address.country}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, country: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button type="submit" isLoading={submitting}>
                Save Institutional Profile
              </Button>
            </div>
          </form>
        </div>
      ) : tab === 'sessions' ? (
        /* Academic Sessions View */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Academic Session Cycles</h4>
              <p className="text-xs text-slate-500">Manage school calendar cycles and active operational term</p>
            </div>
            <Button size="sm" onClick={() => setIsSessionModalOpen(true)}>
              + Add Academic Session
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Session Cycle</th>
                  <th className="py-3 px-4 font-semibold">Start Date</th>
                  <th className="py-3 px-4 font-semibold">End Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(s.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(s.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={s.isCurrent ? 'active' : 'inactive'}>
                        {s.isCurrent ? 'Current Active Session' : 'Archived'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Curriculum Subjects View */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Curriculum Subjects</h4>
              <p className="text-xs text-slate-500">Subjects taught across grade levels and exam papers</p>
            </div>
            <Button size="sm" onClick={() => setIsSubjectModalOpen(true)}>
              + Add Curriculum Subject
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Subject Code</th>
                  <th className="py-3 px-4 font-semibold">Subject Title</th>
                  <th className="py-3 px-4 font-semibold">Curriculum Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 text-xs">
                      {sub.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{sub.name}</td>
                    <td className="py-3 px-4 uppercase text-xs font-semibold text-slate-500">
                      {sub.type}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={sub.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Add Academic Session"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Input
            label="Session Name *"
            placeholder="e.g. 2027-2028"
            value={sessionForm.name}
            onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Session Start Date *"
              type="date"
              value={sessionForm.startDate}
              onChange={(e) => setSessionForm({ ...sessionForm, startDate: e.target.value })}
              required
            />
            <Input
              label="Session End Date *"
              type="date"
              value={sessionForm.endDate}
              onChange={(e) => setSessionForm({ ...sessionForm, endDate: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isCurrentSession"
              checked={sessionForm.isCurrent}
              onChange={(e) => setSessionForm({ ...sessionForm, isCurrent: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isCurrentSession" className="text-xs font-semibold text-slate-700">
              Set as Current Active Session
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsSessionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Session
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Subject to Curriculum"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Code *"
            placeholder="e.g. COMP10"
            value={subjectForm.code}
            onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
            required
          />
          <Input
            label="Subject Title *"
            placeholder="e.g. Computer Applications"
            value={subjectForm.name}
            onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject Type *
            </label>
            <select
              value={subjectForm.type}
              onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="theory">Theory Only</option>
              <option value="practical">Practical / Lab Only</option>
              <option value="both">Both (Theory & Practical)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Subject
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchoolSettingsView;

