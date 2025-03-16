import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, AlertCircle, Users, Settings, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  email: string;
  roles: string[];
}

const roleDescriptions = {
  administrator: 'Full system access with ability to manage users and roles',
  stakeholder: 'Full access to assigned projects with oversight capabilities',
  manager: 'Full access to all projects with management capabilities',
  contractor: 'Technical access for project execution and updates',
  user: 'Read-only access to project information'
};

const roleColors = {
  administrator: 'bg-red-500/10 text-red-500 border-red-500/20',
  stakeholder: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  manager: 'bg-green-500/10 text-green-500 border-green-500/20',
  contractor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  user: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
};

function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

      // Load users with their roles
      const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        authUsers.map(async (user) => {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', user.id);

          return {
            id: user.id,
            email: user.email || '',
            roles: userRoles?.map(r => r.roles.name) || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, roleName: string, checked: boolean) => {
    try {
      if (checked) {
        await supabase.rpc('assign_role_by_name', {
          in_user_id: userId,
          in_role_name: roleName
        });
      } else {
        // Prevent removing the last administrator
        if (roleName === 'administrator') {
          const adminCount = users.filter(u => 
            u.roles.includes('administrator')
          ).length;
          
          if (adminCount <= 1) {
            setError('Cannot remove the last administrator');
            return;
          }
        }

        await supabase.rpc('remove_role', {
          in_user_id: userId,
          in_role_name: roleName
        });
      }
      await loadData();
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
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

      {/* Role Information */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-white">
          <Shield className="h-5 w-5 mr-2 text-monaco-bronze" />
          Role Descriptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div 
              key={role.id} 
              className={`rounded-lg p-6 border ${roleColors[role.name as keyof typeof roleColors] || 'bg-gray-800/50 text-gray-400 border-gray-700'}`}
            >
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                {role.name}
              </h3>
              <p className="text-sm opacity-90">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Role Matrix */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center text-white">
            <Users className="h-5 w-5 mr-2 text-monaco-bronze" />
            User Role Assignments
          </h2>
          <div className="flex items-center text-sm text-gray-400">
            <Info className="h-4 w-4 mr-1" />
            Click checkboxes to assign/remove roles
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                {roles.map(role => (
                  <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">{user.email}</div>
                    </div>
                  </td>
                  {roles.map(role => (
                    <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={user.roles.includes(role.name)}
                        onChange={(e) => handleRoleChange(user.id, role.name, e.target.checked)}
                        className="h-4 w-4 text-monaco-bronze focus:ring-monaco-bronze border-gray-600 rounded bg-gray-700"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoleManagement;