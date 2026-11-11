import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AuditLogsView = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEntity, setSearchEntity] = useState('');
  const [activeLog, setActiveLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchEntity) params.append('entity', searchEntity);

      const res = await api.getAuditLogs(params.toString());
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      showToast('Error loading audit log: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleInspect = (log) => {
    setActiveLog(log);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">System Audit & Compliance Trail</h3>
          <p className="text-xs text-slate-500">Immutable chronological record of administrative actions</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchLogs();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Filter by entity (e.g. Student, Payment)..."
            value={searchEntity}
            onChange={(e) => setSearchEntity(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Compiling system audit logs..." />
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No audit logs matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Entity</th>
                  <th className="py-3 px-4 font-semibold">Performed By</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.entity}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {log.user?.name || 'System Auto-Trigger'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleInspect(log)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Inspect Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Payload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Audit Entry Payload Inspector"
        maxWidth="max-w-lg"
      >
        {activeLog && (
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-slate-500 font-medium">Action:</span>
              <span className="font-bold text-slate-800 font-mono">{activeLog.action}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-slate-500 font-medium">Entity:</span>
              <span className="font-bold text-slate-800">{activeLog.entity}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-slate-500 font-medium">Timestamp:</span>
              <span>{new Date(activeLog.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Sanitized Event Metadata:</p>
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto text-[11px] font-mono leading-tight">
                {JSON.stringify(activeLog.details, null, 2)}
              </pre>
            </div>
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogsView;

