import api from './api';

export const organizationAPI = {
  // Get all organizations
  getAll: () => api.get('/organizations'),
  
  // Get organization by ID
  getById: (id) => api.get(`/organizations/${id}`),
  
  // Create new organization
  create: (data) => api.post('/organizations', data),
  
  // Update organization
  update: (id, data) => api.put(`/organizations/${id}`, data),
  
  // Delete organization
  delete: (id) => api.delete(`/organizations/${id}`),
  
  // Get all users (for dashboard stats)
  getAllUsers: () => api.get('/users'),
};
