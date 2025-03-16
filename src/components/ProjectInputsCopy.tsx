import React from 'react';
import { WalletCards, Milestone, ClipboardList, CalendarClock } from 'lucide-react';
import Budget from './Budget';
import PhaseTracking from './PhaseTracking';
import Actual from './Actual';
import Schedule from './Schedule';

interface ProjectInputsCopyProps {
  project: any;
  section: string;
}

function ProjectInputsCopy({ project, section }: ProjectInputsCopyProps) {
  const sections = [
    { 
      id: 'phases', 
      name: 'Project Phases', 
      icon: Milestone,
      description: 'Track and update project phase progress',
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      component: PhaseTracking
    },
    { 
      id: 'budget', 
      name: 'Budget', 
      icon: WalletCards,
      description: 'Manage project budget allocations',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      component: Budget
    },
    { 
      id: 'actual', 
      name: 'Actual', 
      icon: ClipboardList,
      description: 'Record actual costs and expenses',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      component: Actual
    },
    { 
      id: 'schedule', 
      name: 'Project Schedule', 
      icon: CalendarClock,
      description: 'Plan and track project timeline',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      component: Schedule
    }
  ];

  const getComponent = () => {
    switch (section) {
      case 'phases':
        return PhaseTracking;
      case 'budget':
        return Budget;
      case 'actual':
        return Actual;
      case 'schedule':
        return Schedule;
      default:
        return null;
    }
  };

  const Component = getComponent();

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-monaco-bronze" />
            Project Inputs
          </h2>
          <p className="text-gray-400 mt-1">Track and manage project progress and data</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {sections.map(item => (
          <button
            key={item.id}
            onClick={() => window.location.href = `#${item.id}`}
            className={`
              relative p-6 rounded-lg border transition-all duration-200 text-left group
              ${section === item.id
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
            </div>
          </button>
        ))}
      </div>

      {Component && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <Component />
        </div>
      )}
    </div>
  );
}

export default ProjectInputsCopy;