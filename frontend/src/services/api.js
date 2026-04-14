import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'https://hcl-hackathon-ruz1.onrender.com/api';
// Ensure the URL ends with /api
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}
if (!API_URL.endsWith('/api')) {
  API_URL += '/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
