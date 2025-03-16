import React, { useState } from 'react';
import { Building2, MapPin, Calendar, FileText, Tag, Save, ChevronRight } from 'lucide-react';

interface ProjectOverviewProps {
  project: any;
}

function ProjectOverview({ project }: ProjectOverviewProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    duration: project.duration,
    location: project.location,
    tags: ['Residential', 'Renovation', 'High-End', 'Interior', 'Level 3'],
    status: project.status,
    budget: '€2,500,000',
    client: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+377 99 99 99 99'
    },
    team: {
      projectManager: 'Sarah Wilson',
      architect: 'Michael Chen',
      engineer: 'David Brown'
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleClientChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleTeamChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Save Status Indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-300 ${hasUnsavedChanges ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleSave}
          className="bg-monaco-bronze text-white px-4 py-2 rounded-lg shadow-lg flex items-center hover:bg-monaco-bronze-light transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Project Details */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Project Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Project Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Duration
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">€</span>
                <input
                  type="text"
                  value={formData.budget.replace('€', '')}
                  onChange={(e) => handleChange('budget', `€${e.target.value}`)}
                  className="w-full pl-8 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-monaco-bronze/20 text-monaco-bronze rounded-full px-3 py-1"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="text-sm">{tag}</span>
                  </div>
                ))}
                <button
                  onClick={() => window.location.href = '#level3_phases'}
                  className="flex items-center bg-monaco-bronze text-white rounded-full px-3 py-1 text-sm hover:bg-monaco-bronze-light transition-colors"
                >
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Open Level 3
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Client Information</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.client.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.client.email}
              onChange={(e) => handleClientChange('email', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.client.phone}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
        </div>
      </div>

      {/* Project Team */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Project Team</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Project Manager
            </label>
            <input
              type="text"
              value={formData.team.projectManager}
              onChange={(e) => handleTeamChange('projectManager', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Architect
            </label>
            <input
              type="text"
              value={formData.team.architect}
              onChange={(e) => handleTeamChange('architect', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Engineer
            </label>
            <input
              type="text"
              value={formData.team.engineer}
              onChange={(e) => handleTeamChange('engineer', e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;