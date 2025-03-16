import React, { useState, useEffect } from 'react';
import { Users, UserPlus, AlertCircle, Mail, Calendar, Building2, Tag, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UserInvitation from './UserInvitation';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile: {
    first_name: string;
    last_name: string;
    status: string;
    user_type: string;
  };
  roles: string[];
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load users with their profiles and roles
      const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      // Get profiles and roles for each user
      const usersWithDetails = await Promise.all(
        authUsers.map(async (user) => {
          // Get user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          // Get user roles
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', user.id);

          return {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            profile: profile || {
              first_name: '',
              last_name: '',
              status: 'pending',
              user_type: 'external'
            },
            roles: userRoles?.map(r => r.roles.name) || []
          };
        })
      );

      setUsers(usersWithDetails);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'internal':
        return 'bg-blue-100 text-blue-800';
      case 'external':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* User List */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center text-white">
            <Users className="h-5 w-5 mr-2 text-monaco-bronze" />
            User Management
          </h2>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-monaco-bronze/10 flex items-center justify-center">
                        <span className="text-monaco-bronze text-lg font-semibold">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.email}</div>
                        <div className="text-sm text-gray-400">
                          {user.profile.first_name} {user.profile.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.profile.status)}`}>
                      {user.profile.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(user.profile.user_type)}`}>
                      {user.profile.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span 
                          key={role}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-monaco-bronze/10 text-monaco-bronze"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {user.profile.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-500 hover:text-green-400"
                          title="Activate user"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {user.profile.status !== 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="text-red-500 hover:text-red-400"
                          title="Suspend user"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <UserInvitation
          onClose={() => setShowInviteModal(false)}
          onInvite={loadUsers}
        />
      )}
    </div>
  );
}

export default UserManagement;