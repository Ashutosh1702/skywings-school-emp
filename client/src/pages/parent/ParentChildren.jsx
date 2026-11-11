import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ParentChildren = () => {
  const { showToast } = useToast();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await api.getMyChildren();
        if (res.success) {
          setChildren(res.data);
        }
      } catch (err) {
        showToast('Error loading wards: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (loading) return <LoadingSpinner label="Loading linked student records..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-800 text-lg">My Children / Wards</h3>
        <p className="text-xs text-slate-500">Official student profiles linked to your parent account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child._id}>
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold text-xl flex items-center justify-center">
                {child.firstName?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {child.firstName} {child.lastName}
                </h4>
                <p className="text-xs font-mono text-blue-600 font-semibold">
                  Admission No: {child.admissionNumber}
                </p>
                <div className="mt-1">
                  <Badge status={child.status} />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Class & Section:</span>
                <span className="font-bold text-slate-800">
                  {child.class?.name} - {child.section?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class Roll Number:</span>
                <span className="font-mono font-bold text-slate-800">{child.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Session:</span>
                <span className="font-medium text-slate-700">{child.academicSession?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classroom:</span>
                <span className="font-medium text-slate-700">{child.section?.roomNumber}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParentChildren;

