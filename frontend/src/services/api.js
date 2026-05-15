import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

const getOperatorEmail = () => {
  try {
    const user = JSON.parse(localStorage.getItem('incidencias_user') || 'null');
    return user?.email || null;
  } catch {
    return null;
  }
};

export const incidentService = {
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  getStats: () => api.get('/incidents/stats'),
  create: (formData) => api.post('/incidents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateStatus: (id, data) => {
    const email = getOperatorEmail();
    return api.patch(`/incidents/${id}/status`, data, {
      headers: { 'x-user-email': email },
    });
  },
  uploadMedia: (id, formData) => api.post(`/incidents/${id}/media`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/incidents/${id}`),
};

export const userService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  getOperators: () => api.get('/users/operators'),
};

export const authService = {
  login: (email) => api.post('/auth/login', { email }),
};

export default api;
