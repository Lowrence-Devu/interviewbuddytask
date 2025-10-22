import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import { organizationAPI } from '../api/organizationAPI';
import toast from 'react-hot-toast';
import OrganizationModal from '../components/OrganizationModal';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationAPI.getAll();
      setOrganizations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (organizationData) => {
    try {
      const response = await organizationAPI.create(organizationData);
      setOrganizations(prev => [response.data.data, ...prev]);
      toast.success('Organization created successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error(error.response?.data?.message || 'Failed to create organization');
    }
  };

  const handleUpdate = async (organizationData) => {
    try {
      const response = await organizationAPI.update(editingOrganization.org_id, organizationData);
      setOrganizations(prev => 
        prev.map(org => 
          org.org_id === editingOrganization.org_id ? response.data.data : org
        )
      );
      toast.success('Organization updated successfully');
      setIsModalOpen(false);
      setEditingOrganization(null);
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error(error.response?.data?.message || 'Failed to update organization');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      await organizationAPI.delete(id);
      setOrganizations(prev => prev.filter(org => org.org_id !== id));
      toast.success('Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error(error.response?.data?.message || 'Failed to delete organization');
    }
  };

  const openCreateModal = () => {
    setEditingOrganization(null);
    setIsModalOpen(true);
  };

  const openEditModal = (organization) => {
    setEditingOrganization(organization);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrganization(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your organizations</p>
        </div>
        
        <div className="card">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Organizations</h1>
          <p className="text-lg text-gray-600">Manage your organizations and their details</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Organization
        </button>
      </div>

      {/* Organizations List */}
      <div className="card">
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
            <div className="mt-6">
              <button onClick={openCreateModal} className="btn-primary">
                Create Organization
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Address</th>
                  <th className="table-header">Users</th>
                  <th className="table-header">Created</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org) => (
                  <tr key={org.org_id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">{org.address}</td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {org.users?.length || 0}
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(org)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(org.org_id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <OrganizationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingOrganization ? handleUpdate : handleCreate}
        organization={editingOrganization}
        title={editingOrganization ? 'Edit Organization' : 'Create Organization'}
      />
    </div>
  );
};

export default Organizations;
