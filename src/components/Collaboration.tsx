import React, { useState } from 'react';
import { MessageSquare, CheckSquare, Activity } from 'lucide-react';
import TeamChat from './TeamChat';
import TaskBoard from './TaskBoard';
import ActivityFeed from './ActivityFeed';

interface CollaborationProps {
  project: any;
  section: string;
}

function Collaboration({ project }: CollaborationProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'activity'>('chat');

  const tabs = [
    { id: 'chat', name: 'Team Chat', icon: MessageSquare },
    { id: 'tasks', name: 'Task Board', icon: CheckSquare },
    { id: 'activity', name: 'Activity Feed', icon: Activity }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-gray-900 rounded-xl">
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-monaco-bronze text-monaco-bronze'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'chat' && <TeamChat projectId={project.id} />}
          {activeTab === 'tasks' && <TaskBoard projectId={project.id} />}
          {activeTab === 'activity' && <ActivityFeed projectId={project.id} />}
        </div>
      </div>
    </div>
  );
}

export default Collaboration;