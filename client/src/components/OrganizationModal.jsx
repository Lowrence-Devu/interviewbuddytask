import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const OrganizationModal = ({ isOpen, onClose, onSubmit, organization, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        address: organization.address || ''
      });
    } else {
      setFormData({
        name: '',
        address: ''
      });
    }
    setErrors({});
  }, [organization, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Organization address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="modal-content">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter organization name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`input-field resize-none ${errors.address ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter organization address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {organization ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationModal;
