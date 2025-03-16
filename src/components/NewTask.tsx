import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaskProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function NewTask({ projectId, onClose, onSuccess }: NewTaskProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          title: formData.title,
          description: formData.description,
          assigned_to: formData.assignedTo,
          priority: formData.priority,
          due_date: formData.dueDate || null,
          status: 'todo',
          created_by: user.id
        });

      if (error) throw error;

      // Create activity event
      await supabase
        .from('activity_events')
        .insert({
          project_id: projectId,
          type: 'task',
          action: 'created',
          user_id: user.id,
          target_id: projectId,
          metadata: {
            title: formData.title
          }
        });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">New Task</h2>
          <p className="text-gray-400 mt-1">Create a new task</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Describe the task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Assigned To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              >
                <option value="">Select user</option>
                {/* TODO: Load users from project */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
            />
          </div>

          <div className="flex justify-end space-x-3">
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
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTask;