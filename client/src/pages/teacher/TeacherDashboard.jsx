import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TeacherDashboard = () => {
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
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching teacher portal schedule..." />;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 text-white rounded-xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Department: {data?.teacher?.department || 'Academics'} • Employee ID: {data?.teacher?.employeeId}
          </p>
        </div>
        <div className="text-3xl">👨‍🏫</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Today's Timetable Schedule" subtitle="Assigned periods for today">
          <div className="space-y-2">
            {data?.todayTimetable?.length > 0 ? (
              data.todayTimetable.map((slot) => (
                <div key={slot._id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Period {slot.periodNumber}: {slot.subject?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {slot.class?.name} - Section {slot.section?.name} (Room {slot.roomNumber})
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No periods scheduled for today.</p>
            )}
          </div>
        </Card>

        <Card title="Active Homework Assignments" subtitle="Recently assigned work">
          <div className="space-y-2">
            {data?.activeHomework?.length > 0 ? (
              data.activeHomework.map((hw) => (
                <div key={hw._id} className="p-3 border rounded-lg">
                  <p className="font-semibold text-slate-800 text-sm">{hw.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Due: {new Date(hw.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No active homework assignments.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;

