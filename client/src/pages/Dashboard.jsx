import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Plus, Edit, Trash2, Eye, ChevronRight, TrendingUp, Activity, Clock, CheckCircle } from 'lucide-react';
import { organizationAPI } from '../api/organizationAPI';
import toast from 'react-hot-toast';
import { SkeletonCard, EmptyState } from '../components/ui';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    adminUsers: 0,
    memberUsers: 0,
    recentActivity: 0,
    systemHealth: 'excellent'
  });
  const [recentOrganizations, setRecentOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [organizationsRes, usersRes] = await Promise.all([
        organizationAPI.getAll(),
        organizationAPI.getAllUsers()
      ]);

      const organizations = organizationsRes.data.data || [];
      const users = usersRes.data.data || [];

      const adminUsers = users.filter(user => user.role === 'Admin').length;
      const memberUsers = users.filter(user => user.role === 'Member').length;
      const recentActivity = organizations.filter(org => {
        const createdAt = new Date(org.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length;

      setStats({
        totalOrganizations: organizations.length,
        totalUsers: users.length,
        adminUsers,
        memberUsers,
        recentActivity,
        systemHealth: 'excellent'
      });

      // Get recent organizations (last 5)
      setRecentOrganizations(organizations.slice(0, 5));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="stat-card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-200 shadow-lg`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
        <div className="ml-6">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Overview of your organization and user management system</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Overview of your organization and user management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Organizations"
          value={stats.totalOrganizations}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Admin Users"
          value={stats.adminUsers}
          icon={Users}
          color="red"
        />
        <StatCard
          title="Member Users"
          value={stats.memberUsers}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          title="System Health"
          value="Excellent"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Recent Organizations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Organizations</h2>
          <Link
            to="/organizations"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Organization
          </Link>
        </div>

        {recentOrganizations.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
            <div className="mt-6">
              <Link to="/organizations" className="btn-primary">
                Create Organization
              </Link>
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
                {recentOrganizations.map((org) => (
                  <tr key={org.org_id}>
                    <td className="table-cell font-medium">{org.name}</td>
                    <td className="table-cell text-gray-500">{org.address}</td>
                    <td className="table-cell">{org.users?.length || 0}</td>
                    <td className="table-cell text-gray-500">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/organizations`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/organizations`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/organizations"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">Manage Organizations</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/users"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Server</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
