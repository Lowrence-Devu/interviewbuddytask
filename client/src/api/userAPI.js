import api from './api';

export const userAPI = {
  // Get all users
  getAll: () => api.get('/users'),
  
  // Get users by organization
  getByOrganization: (orgId) => api.get(`/users/organization/${orgId}`),
  
  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),
  
  // Create new user
  create: (data) => api.post('/users', data),
  
  // Update user
  update: (id, data) => api.put(`/users/${id}`, data),
  
  // Delete user
  delete: (id) => api.delete(`/users/${id}`),
};
