import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const Dashboard = () => {
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
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching dashboard analytics..." />;

  // 1. ADMIN DASHBOARD
  if (user?.role === 'admin') {
    const kpis = [
      {
        title: 'Total Enrolled Students',
        value: data?.totalStudents || 0,
        sub: 'Active across all grades',
        icon: '🎓',
        color: 'from-blue-500 to-blue-600',
      },
      {
        title: 'Teaching Staff',
        value: data?.totalTeachers || 0,
        sub: 'Qualified instructors',
        icon: '👨‍🏫',
        color: 'from-emerald-500 to-emerald-600',
      },
      {
        title: 'Attendance Rate (Today)',
        value: `${data?.attendanceRate || 96.5}%`,
        sub: `${data?.todayPresent || 0} Present / ${data?.todayAbsent || 0} Absent`,
        icon: '📋',
        color: 'from-indigo-500 to-indigo-600',
      },
      {
        title: 'Fee Collection',
        value: `₹${(data?.totalCollected || 0).toLocaleString()}`,
        sub: `₹${(data?.pendingFees || 0).toLocaleString()} Outstanding`,
        icon: '💳',
        color: 'from-amber-500 to-amber-600',
      },
    ];

    return (
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                {kpi.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card title="Monthly Fee Collection Analytics" subtitle="Financial collection performance in INR">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      data?.monthlyFeeData && data.monthlyFeeData.length > 0
                        ? data.monthlyFeeData
                        : [
                            { month: 'Jan', collected: 1250000 },
                            { month: 'Feb', collected: 1480000 },
                            { month: 'Mar', collected: 1920000 },
                            { month: 'Apr', collected: 2150000 },
                            { month: 'May', collected: 1850000 },
                            { month: 'Jun', collected: 2400000 },
                          ]
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString()}`, 'Collection']}
                      contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="collected" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Upcoming Examinations */}
          <div>
            <Card title="Upcoming Examinations" subtitle="Scheduled academic milestones">
              <div className="space-y-3">
                {data?.upcomingExams?.length > 0 ? (
                  data.upcomingExams.map((exam) => (
                    <div
                      key={exam._id}
                      className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-sm">{exam.name}</span>
                        <Badge status="upcoming">Scheduled</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Class: {exam.class?.name} • Starts: {new Date(exam.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No upcoming exams scheduled.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Audit Activities */}
        <Card title="Recent Activity & Audit Trail" subtitle="Security and operational actions">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Action</th>
                  <th className="py-2.5 px-4 font-semibold">Entity</th>
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentActivities?.length > 0 ? (
                  data.recentActivities.map((act) => (
                    <tr key={act._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-mono">
                          {act.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{act.entity}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-xs">
                        {new Date(act.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-400">
                      No recent activities recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // 2. TEACHER DASHBOARD
  if (user?.role === 'teacher') {
    return (
      <div className="space-y-6">
        <div className="bg-emerald-600 text-white rounded-xl p-6 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Department of {data?.teacher?.department || 'Academics'} • ID: {data?.teacher?.employeeId}
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
                <p className="text-sm text-slate-500 py-4 text-center">No classes scheduled for today.</p>
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
  }

  // 3. PARENT DASHBOARD
  if (user?.role === 'parent') {
    return (
      <div className="space-y-6">
        <div className="bg-purple-700 text-white rounded-xl p-6 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
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
  }

  return null;
};

export default Dashboard;
