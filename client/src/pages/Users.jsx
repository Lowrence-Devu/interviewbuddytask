import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users as UsersIcon, Mail, Building2, Search, Filter } from 'lucide-react';
import { userAPI } from '../api/userAPI';
import { organizationAPI } from '../api/organizationAPI';
import toast from 'react-hot-toast';
import UserModal from '../components/UserModal';
import { SkeletonTable, EmptyState, SearchInput, FilterSelect, ConfirmDialog } from '../components/ui';
import ExportButton from '../components/ExportButton';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, user: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, orgsRes] = await Promise.all([
        userAPI.getAll(),
        organizationAPI.getAll()
      ]);
      
      setUsers(usersRes.data.data || []);
      setOrganizations(orgsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (userData) => {
    try {
      const response = await userAPI.create(userData);
      setUsers(prev => [response.data.data, ...prev]);
      toast.success('User created successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (userData) => {
    try {
      const response = await userAPI.update(editingUser.user_id, userData);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === editingUser.user_id ? response.data.data : user
        )
      );
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.delete(id);
      setUsers(prev => prev.filter(user => user.user_id !== id));
      toast.success('User deleted successfully');
      setDeleteConfirm({ isOpen: false, user: null });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const openDeleteConfirm = (user) => {
    setDeleteConfirm({ isOpen: true, user });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesOrg = !orgFilter || user.org_id === parseInt(orgFilter);
    
    return matchesSearch && matchesRole && matchesOrg;
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeClass = (role) => {
    return role === 'Admin' ? 'badge-admin' : 'badge-member';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-lg text-gray-600">Manage your users and their roles</p>
        </div>
        
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-lg text-gray-600">Manage your users and their roles</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton 
            data={filteredUsers} 
            filename="users" 
          />
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users by name or email..."
          />
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: 'Admin', label: 'Admin' },
              { value: 'Member', label: 'Member' }
            ]}
            placeholder="Filter by role"
          />
          <FilterSelect
            value={orgFilter}
            onChange={setOrgFilter}
            options={organizations.map(org => ({
              value: org.org_id.toString(),
              label: org.name
            }))}
            placeholder="Filter by organization"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        {users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="Get started by creating your first user. You can add users to organizations and assign them roles."
            actionText="Create User"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Organization</th>
                  <th className="table-header">Created</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="h-4 w-4 mr-2" />
                        {user.organization?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(user)}
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
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        user={editingUser}
        organizations={organizations}
        title={editingUser ? 'Edit User' : 'Create User'}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, user: null })}
        onConfirm={() => handleDelete(deleteConfirm.user?.user_id)}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteConfirm.user?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Users;
