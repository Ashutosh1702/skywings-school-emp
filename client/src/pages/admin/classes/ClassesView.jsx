import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ClassesView = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [classForm, setClassForm] = useState({ name: '', numericGrade: '' });
  const [sectionForm, setSectionForm] = useState({
    name: '',
    roomNumber: 'Room 101',
    capacity: 40,
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.getClasses();
      if (res.success) {
        setClasses(res.data);
      }
    } catch (err) {
      showToast('Error loading classes: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createClass({
        name: classForm.name,
        numericGrade: Number(classForm.numericGrade),
      });
      if (res.success) {
        showToast('Class created successfully with default Section A!', 'success');
        setIsClassModalOpen(false);
        setClassForm({ name: '', numericGrade: '' });
        fetchClasses();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.addSection(selectedClassId, sectionForm);
      if (res.success) {
        showToast(`Section ${sectionForm.name} added successfully!`, 'success');
        setIsSectionModalOpen(false);
        setSectionForm({ name: '', roomNumber: 'Room 101', capacity: 40 });
        fetchClasses();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Academic Classes & Sections</h3>
          <p className="text-xs text-slate-500">Manage grade levels and class sections</p>
        </div>
        <Button onClick={() => setIsClassModalOpen(true)}>+ Create New Class</Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading classes and sections..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{cls.name}</h4>
                  <p className="text-xs text-slate-500">Grade Level: {cls.numericGrade}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedClassId(cls._id);
                    setIsSectionModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition"
                >
                  + Add Section
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Configured Sections ({cls.sections?.length || 0})
                </p>
                <div className="space-y-2">
                  {cls.sections?.map((sec) => (
                    <div
                      key={sec._id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                            {sec.name}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">
                            Section {sec.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Teacher: {sec.classTeacher?.name || 'Unassigned'}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <span className="block font-mono">{sec.roomNumber}</span>
                        <span className="text-[11px] text-slate-400">Cap: {sec.capacity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Create New Class / Grade"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Class Name *"
            placeholder="e.g. Grade 11"
            value={classForm.name}
            onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
            required
          />
          <Input
            label="Numeric Grade Level *"
            type="number"
            placeholder="e.g. 11"
            value={classForm.numericGrade}
            onChange={(e) => setClassForm({ ...classForm, numericGrade: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsClassModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add New Section to Class"
      >
        <form onSubmit={handleAddSection} className="space-y-4">
          <Input
            label="Section Identifier *"
            placeholder="e.g. B or C"
            value={sectionForm.name}
            onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value.toUpperCase() })}
            required
          />
          <Input
            label="Assigned Room Number"
            placeholder="Room 202"
            value={sectionForm.roomNumber}
            onChange={(e) => setSectionForm({ ...sectionForm, roomNumber: e.target.value })}
          />
          <Input
            label="Student Capacity"
            type="number"
            value={sectionForm.capacity}
            onChange={(e) => setSectionForm({ ...sectionForm, capacity: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add Section
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassesView;

