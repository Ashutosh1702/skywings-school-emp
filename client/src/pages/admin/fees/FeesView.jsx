import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const FeesView = () => {
  const { showToast } = useToast();
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentFee, setStudentFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feeLoading, setFeeLoading] = useState(false);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isConcessionModalOpen, setIsConcessionModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    installmentNumber: 1,
    amount: '',
    paymentMethod: 'upi',
    transactionId: '',
    remarks: '',
  });

  const [concessionForm, setConcessionForm] = useState({
    concessionAmount: 5000,
    reason: 'Sibling Scholarship Concession',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [structRes, payRes, studRes] = await Promise.all([
        api.getFeeStructures(),
        api.getPayments(),
        api.getStudents(),
      ]);

      if (structRes.success) setStructures(structRes.data);
      if (payRes.success) setPayments(payRes.data);
      if (studRes.success && studRes.data.length > 0) {
        setStudents(studRes.data);
        setSelectedStudentId(studRes.data[0]._id);
      }
    } catch (err) {
      showToast('Error loading financial records: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentLedger = async (studentId) => {
    if (!studentId) return;
    try {
      setFeeLoading(true);
      const res = await api.getStudentFee(studentId);
      if (res.success) {
        setStudentFee(res.data);
      }
    } catch (err) {
      setStudentFee(null);
    } finally {
      setFeeLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentLedger(selectedStudentId);
    }
  }, [selectedStudentId]);

  const handleOpenPayment = (installment) => {
    setPaymentForm({
      installmentNumber: installment.installmentNumber,
      amount: installment.balanceAmount || installment.amount,
      paymentMethod: 'upi',
      transactionId: '',
      remarks: `Payment for ${installment.name}`,
    });
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    try {
      const res = await api.recordPayment({
        studentId: selectedStudentId,
        ...paymentForm,
      });

      if (res.success) {
        showToast('Payment recorded successfully! Receipt generated.', 'success');
        setIsPayModalOpen(false);
        setActiveReceipt(res.data);
        setIsReceiptModalOpen(true);
        fetchStudentLedger(selectedStudentId);
        // refresh payments list
        const pRes = await api.getPayments();
        if (pRes.success) setPayments(pRes.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleApplyConcession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/fees/student/${selectedStudentId}/concession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('skywings_token')}`,
          },
          body: JSON.stringify(concessionForm),
        }
      ).then((r) => r.json());

      if (res.success) {
        showToast('Concession applied and ledger re-balanced!', 'success');
        setIsConcessionModalOpen(false);
        fetchStudentLedger(selectedStudentId);
      } else {
        showToast(res.message || 'Concession failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleViewReceipt = async (receiptNumber) => {
    try {
      const res = await api.getReceipt(receiptNumber);
      if (res.success) {
        setActiveReceipt(res.data);
        setIsReceiptModalOpen(true);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Fee Ledger Lookup Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Student Fee Ledger & Collection</h3>
            <p className="text-xs text-slate-500">Inspect installments, record transactions & view receipts</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-medium"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName} ({s.admissionNumber})
                  </option>
                ))}
              </select>
            </div>

            {studentFee && (
              <Button size="sm" variant="outline" onClick={() => setIsConcessionModalOpen(true)}>
                🎁 Apply Concession
              </Button>
            )}
          </div>
        </div>

        {/* Selected Student Ledger Summary */}
        {feeLoading ? (
          <LoadingSpinner label="Loading student ledger..." />
        ) : studentFee ? (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Fee</p>
                <h4 className="text-lg font-bold text-slate-800">
                  ₹{(studentFee.grossTotal ?? studentFee.totalAmount ?? 0).toLocaleString()}
                </h4>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Concessions</p>
                <h4 className="text-lg font-bold text-slate-600">
                  ₹{(studentFee.concessionAmount ?? 0).toLocaleString()}
                </h4>
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-semibold uppercase">Total Paid</p>
                <h4 className="text-lg font-bold text-emerald-700">
                  ₹{(studentFee.totalPaid ?? studentFee.paidAmount ?? 0).toLocaleString()}
                </h4>
              </div>
              <div>
                <p className="text-xs text-rose-600 font-semibold uppercase">Outstanding Due</p>
                <h4 className="text-lg font-bold text-rose-700">
                  ₹{(studentFee.balance ?? 0).toLocaleString()}
                </h4>
              </div>
            </div>

            {/* Installments Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Installment</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Paid</th>
                    <th className="py-2.5 px-4">Balance</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentFee.installments?.map((inst) => (
                    <tr key={inst.installmentNumber} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{inst.name}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {new Date(inst.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono">₹{(inst.amount ?? 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-emerald-600">
                        ₹{(inst.paidAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600 font-semibold">
                        ₹{(inst.balanceAmount ?? inst.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={inst.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inst.status !== 'paid' ? (
                          <Button size="sm" onClick={() => handleOpenPayment(inst)}>
                            Collect Fee
                          </Button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600">Paid in Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 text-center text-slate-500 text-sm">
            No fee structure assigned to this student yet.
          </div>
        )}
      </div>

      {/* Class Fee Structures Overview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <h3 className="font-bold text-slate-800 text-base mb-3">Class Fee Structures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {structures.map((s) => (
            <div key={s._id} className="p-4 bg-slate-50 border rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-500">
                    Class: {s.class?.name} • Cycle: {s.academicSession?.name}
                  </p>
                </div>
                <Badge status={s.status} />
              </div>
              <p className="text-base font-extrabold text-blue-900 font-mono">
                ₹{s.totalAmount?.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ year</span>
              </p>
              <div className="pt-2 border-t text-[11px] text-slate-500 space-y-1">
                {s.breakdown?.map((b, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{b.feeHead?.name || 'Head'}:</span>
                    <span className="font-mono font-semibold">₹{b.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payment Transactions Log */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <h3 className="font-bold text-slate-800 text-base mb-3">Recent Collection Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="py-2.5 px-4">Receipt No</th>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Amount Paid</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600 text-xs">
                    {p.receiptNumber}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {p.student?.firstName} {p.student?.lastName}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">
                    ₹{(p.amountPaid ?? p.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 capitalize text-slate-600 font-medium">
                    {p.paymentMethod}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => handleViewReceipt(p.receiptNumber)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Print Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Fee Payment"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Input
            label="Amount (INR) *"
            type="number"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Method *
            </label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="upi">UPI / QR Code</option>
              <option value="card">Credit / Debit Card</option>
              <option value="net_banking">Net Banking / NEFT</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <Input
            label="Transaction ID / Reference Number"
            placeholder="e.g. UPI-9847120394"
            value={paymentForm.transactionId}
            onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
          />

          <Input
            label="Remarks"
            placeholder="Payment notes"
            value={paymentForm.remarks}
            onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submittingPayment}>
              Confirm & Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply Concession Modal */}
      <Modal
        isOpen={isConcessionModalOpen}
        onClose={() => setIsConcessionModalOpen(false)}
        title="Apply Fee Concession / Scholarship"
      >
        <form onSubmit={handleApplyConcession} className="space-y-4">
          <Input
            label="Concession / Discount Amount (INR) *"
            type="number"
            value={concessionForm.concessionAmount}
            onChange={(e) =>
              setConcessionForm({ ...concessionForm, concessionAmount: Number(e.target.value) })
            }
            required
          />
          <Input
            label="Reason / Approval Notes *"
            placeholder="e.g. Merit Scholarship / Sibling Discount"
            value={concessionForm.reason}
            onChange={(e) => setConcessionForm({ ...concessionForm, reason: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsConcessionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Apply Concession</Button>
          </div>
        </form>
      </Modal>

      {/* Receipt Printable Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Official Fee Payment Receipt"
        maxWidth="max-w-md"
      >
        {activeReceipt && (
          <div className="space-y-4 text-slate-800 p-2">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base tracking-tight text-blue-900">
                SKYWINGS INTERNATIONAL ACADEMY
              </h3>
              <p className="text-[11px] text-slate-500">Plot 42, Tech Park Enclave, Bangalore - 560001</p>
              <p className="text-xs font-mono font-bold text-slate-700 mt-2">
                RECEIPT #{activeReceipt.receiptNumber}
              </p>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold">
                  {activeReceipt.student?.firstName || 'Student'} {activeReceipt.student?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admission No:</span>
                <span className="font-mono">{activeReceipt.student?.admissionNumber || 'ADM-001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span>{new Date(activeReceipt.paymentDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="uppercase font-semibold">{activeReceipt.paymentMethod}</span>
              </div>
              {activeReceipt.transactionId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Ref ID:</span>
                  <span className="font-mono">{activeReceipt.transactionId}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <span className="font-bold text-sm">Amount Paid:</span>
              <span className="font-bold text-lg text-emerald-700 font-mono">
                ₹{(activeReceipt.amountPaid ?? activeReceipt.amount ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-2">
              <span>Remaining Balance:</span>
              <span className="font-mono font-bold text-rose-600">
                ₹{(activeReceipt.remainingBalance ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                🖨️ Print Receipt
              </Button>
              <Button size="sm" onClick={() => setIsReceiptModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeesView;
