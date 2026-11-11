import axiosInstance from './axiosInstance';

// Fee Management & Payment Service (Module 8)
// Interacts with Express /api/fees & /api/payments and MongoDB collections
export const feeService = {
  // GET: Fetch all fee heads
  getFeeHeads: async () => {
    return await axiosInstance.get('/fees/heads');
  },

  // GET: Fetch all fee structures
  getFeeStructures: async () => {
    return await axiosInstance.get('/fees/structures');
  },

  // GET: Fetch student fee ledger and dues
  getStudentFee: async (studentId) => {
    return await axiosInstance.get(`/fees/student/${studentId}`);
  },

  // GET: Fetch payment transactions history
  getPayments: async (params = {}) => {
    return await axiosInstance.get('/payments', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  // POST: Record student fee payment transaction
  recordPayment: async (paymentData) => {
    return await axiosInstance.post('/payments', paymentData);
  },

  // GET: Fetch official printable payment receipt
  getReceipt: async (receiptNumber) => {
    return await axiosInstance.get(`/payments/receipt/${receiptNumber}`);
  },
};

export default feeService;

