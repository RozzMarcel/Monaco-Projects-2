import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AdminBoxProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count?: number;
  status?: 'success' | 'warning' | 'error';
  onClick?: () => void;
}

function AdminBox({ title, description, icon: Icon, count, status, onClick }: AdminBoxProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full p-6 bg-white rounded-xl shadow-sm overflow-hidden
        transition-all duration-300 hover:shadow-md hover:scale-[1.02]
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-monaco-bronze to-monaco-bronze-light" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <div className="relative flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg bg-monaco-bronze/10 mr-3">
              <Icon className="h-6 w-6 text-monaco-bronze" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        {count !== undefined && (
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${getStatusColor()}
          `}>
            {count}
          </div>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-monaco-bronze to-monaco-bronze-light transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
    </button>
  );
}

export default AdminBox;