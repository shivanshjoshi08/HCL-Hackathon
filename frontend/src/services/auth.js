import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  registerAdmin: async (userData) => {
    const response = await api.post('/auth/register-admin', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};

export const accountService = {
  getAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getBalance: async (accountId) => {
    const response = await api.get(`/accounts/${accountId}/balance`);
    return response.data;
  },
};

export const transactionService = {
  deposit: async (depositData) => {
    const response = await api.post('/transactions/deposit', depositData);
    return response.data;
  },

  transfer: async (transferData) => {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  },

  getHistory: async (accountId, limit = 20, offset = 0) => {
    const response = await api.get('/transactions/history', {
      params: { accountId, limit, offset },
    });
    return response.data;
  },
};
