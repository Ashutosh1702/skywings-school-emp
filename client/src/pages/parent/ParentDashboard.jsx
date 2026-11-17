import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load parent dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching parent portal overview..." />;

  return (
    <div className="space-y-6">
      <div className="bg-purple-700 text-white rounded-xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-purple-100 text-sm mt-1">Parent & Guardian Portal</p>
        </div>
        <div className="text-3xl">👨‍👩‍👧</div>
      </div>

      <Card title="Linked Wards / Children" subtitle="Students registered under your guardian profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.children?.length > 0 ? (
            data.children.map((child) => (
              <div key={child._id} className="p-4 border rounded-xl bg-slate-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {child.firstName?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {child.firstName} {child.lastName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {child.class?.name} - Section {child.section?.name} • Roll: {child.rollNumber}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                    Admission: {child.admissionNumber}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-4">No linked student records found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ParentDashboard;

