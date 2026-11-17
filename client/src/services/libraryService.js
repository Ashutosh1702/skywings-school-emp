import axiosInstance from './axiosInstance';

// Library Management Service (Module 15)
export const libraryService = {
  getBooks: async (params = {}) => {
    return await axiosInstance.get('/library/books', {
      params: typeof params === 'string' ? new URLSearchParams(params) : params,
    });
  },

  addBook: async (bookData) => {
    return await axiosInstance.post('/library/books', bookData);
  },

  getBookIssues: async () => {
    return await axiosInstance.get('/library/issues');
  },

  issueBook: async (issueData) => {
    return await axiosInstance.post('/library/issue', issueData);
  },

  returnBook: async (issueId) => {
    return await axiosInstance.post(`/library/return/${issueId}`);
  },
};

export default libraryService;

