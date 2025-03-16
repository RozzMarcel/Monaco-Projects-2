import React, { useState } from 'react';
import { Plus, X, Building2, MapPin, Calendar, FileText } from 'lucide-react';
import { useProjectStore } from '../lib/store';
import { supabase } from '../lib/supabase';

interface NewProjectProps {
  onClose: () => void;
}

function NewProject({ onClose }: NewProjectProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    duration: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addProject = useProjectStore(state => state.addProject);
  const projects = useProjectStore(state => state.projects);

  // Find the first available slot number
  const getNextAvailableSlot = () => {
    for (let i = 0; i < 16; i++) {
      const slotId = `slot-${i + 1}`;
      const slotExists = projects.some(p => p.id === slotId);
      if (!slotExists) return i + 1;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const nextSlot = getNextAvailableSlot();
      if (nextSlot === null) {
        setError('No available project slots');
        return;
      }

      const projectId = `slot-${nextSlot}`;

      // Check if project already exists
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single();

      if (existingProject) {
        setError('Project slot already taken. Please try again.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          name: formData.name,
          description: formData.description,
          start_date: formData.startDate,
          duration: formData.duration,
          location: formData.location,
          status: 'active'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('Failed to create project');

      const newProject = {
        id: `slot-${nextSlot}`,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        duration: data.duration,
        location: data.location,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by
      };

      addProject(newProject);
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Plus className="h-5 w-5 mr-2 text-monaco-bronze" />
            Create New Project
          </h2>
          <p className="text-gray-400 mt-1">
            Enter the details for your new project
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
            <FileText className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Project Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter project name"
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
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Project location"
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
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  placeholder="e.g., 6 months"
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
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Describe your project"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProject;