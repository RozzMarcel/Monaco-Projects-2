import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Settings, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { canAccessAdmin } from '../lib/auth';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import AdminApproval from './AdminApproval';

function Admin() {
  const [activeSection, setActiveSection] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please sign in to access this page');
        return;
      }

      const hasAdminAccess = await canAccessAdmin(user.id);
      if (!hasAdminAccess) {
        setError('You do not have permission to access this page');
        return;
      }

      setHasAccess(true);
    } catch (err) {
      console.error('Error checking access:', err);
      setError('Failed to verify access permissions');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, invitations, and access control',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      id: 'roles',
      title: 'Role Management',
      description: 'Configure roles and permissions',
      icon: Shield,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    {
      id: 'approvals',
      name: 'Registration Requests',
      description: 'Review and approve new user registrations',
      icon: UserPlus,
      color: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: Settings,
      color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error || 'Access denied'}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const section = sections.find(s => s.id === activeSection);
    if (section) {
      const Component = section.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-monaco-bronze" />
            Administration
          </h2>
          <p className="text-gray-400 mt-1">Manage system settings and user access</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {sections.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`
              relative p-6 rounded-lg border transition-all duration-200 text-left group
              ${activeSection === item.id
                ? 'border-monaco-bronze bg-monaco-bronze/10'
                : 'border-gray-700 hover:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col space-y-4">
              <div className={`p-3 rounded-lg ${item.color} w-fit transition-colors group-hover:bg-opacity-20`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-white text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-gray-400 mt-2">{item.description}</p>
              </div>
              <div className="flex items-center justify-end mt-4">
                <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-monaco-bronze transition-colors" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;