import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ReportsView = () => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('fees');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      let res;
      if (reportType === 'fees') {
        res = await api.getFeeReport();
      } else if (reportType === 'pending') {
        res = await api.getPendingFeeReport();
      } else {
        res = await api.getStudentReport();
      }

      if (res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      showToast('Error generating report: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) {
      showToast('No records to export', 'error');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'fees') {
      csvContent += 'Receipt Number,Student Name,Admission No,Amount Paid (INR),Payment Method,Date\n';
      reportData.forEach((p) => {
        csvContent += `"${p.receiptNumber}","${p.student?.firstName} ${p.student?.lastName}","${p.student?.admissionNumber}",${p.amountPaid ?? p.amount ?? 0},"${p.paymentMethod}","${new Date(p.paymentDate).toLocaleDateString()}"\n`;
      });
    } else if (reportType === 'pending') {
      csvContent += 'Admission No,Student Name,Class,Section,Parent Phone,Outstanding Balance (INR)\n';
      reportData.forEach((f) => {
        csvContent += `"${f.student?.admissionNumber}","${f.student?.firstName} ${f.student?.lastName}","${f.student?.class?.name}","${f.student?.section?.name}","${f.student?.parent?.phone || ''}",${f.balance}\n`;
      });
    } else {
      csvContent += 'Admission No,Roll No,First Name,Last Name,Class,Section,Status\n';
      reportData.forEach((s) => {
        csvContent += `"${s.admissionNumber}","${s.rollNumber}","${s.firstName}","${s.lastName}","${s.class?.name}","${s.section?.name}","${s.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkyWings_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report exported to CSV successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header & Report Selection */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Report Type:
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold text-slate-700"
          >
            <option value="fees">Fee Collection Transactions</option>
            <option value="pending">Outstanding Fee Dues Report</option>
            <option value="students">Student Master Directory</option>
          </select>
        </div>

        <Button onClick={exportToCSV} variant="success">
          📥 Export to CSV
        </Button>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden p-4">
        {loading ? (
          <LoadingSpinner label="Compiling report data..." />
        ) : reportData.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No report data found for this selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b">
                {reportType === 'fees' && (
                  <tr>
                    <th className="py-2.5 px-4">Receipt</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Date</th>
                  </tr>
                )}
                {reportType === 'pending' && (
                  <tr>
                    <th className="py-2.5 px-4">Admission No</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Class</th>
                    <th className="py-2.5 px-4">Parent Phone</th>
                    <th className="py-2.5 px-4">Outstanding Balance</th>
                  </tr>
                )}
                {reportType === 'students' && (
                  <tr>
                    <th className="py-2.5 px-4">Adm No</th>
                    <th className="py-2.5 px-4">Roll</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Class</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportType === 'fees' &&
                  reportData.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600 text-xs">
                        {p.receiptNumber}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {p.student?.firstName} {p.student?.lastName}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">
                        ₹{p.amountPaid?.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 uppercase text-xs font-semibold text-slate-600">
                        {p.paymentMethod}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 text-xs">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

                {reportType === 'pending' &&
                  reportData.map((f) => (
                    <tr key={f._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono text-xs text-blue-600 font-bold">
                        {f.student?.admissionNumber}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {f.student?.firstName} {f.student?.lastName}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {f.student?.class?.name} - {f.student?.section?.name}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 font-mono text-xs">
                        {f.student?.parent?.phone || 'N/A'}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-rose-600">
                        ₹{f.balance?.toLocaleString()}
                      </td>
                    </tr>
                  ))}

                {reportType === 'students' &&
                  reportData.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono text-xs text-blue-600 font-bold">
                        {s.admissionNumber}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-600">{s.rollNumber}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{s.class?.name}</td>
                      <td className="py-2.5 px-4 uppercase text-xs font-bold text-emerald-600">
                        {s.status}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;

