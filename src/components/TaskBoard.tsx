import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Calendar, User } from 'lucide-react';
import { Task } from '../types/collaboration';
import { supabase } from '../lib/supabase';
import NewTask from './NewTask';

interface TaskBoardProps {
  projectId: string;
}

function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  useEffect(() => {
    loadTasks();
    subscribeToTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:assigned_to (
            email,
            user_profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
   filter: `project_id=eq.${projectId}`

        }, () => {
        loadTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'review':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
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
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Task Board</h2>
        <button
          onClick={() => setShowNewTask(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(['todo', 'in_progress', 'review', 'completed'] as Task['status'][]).map(status => (
          <div key={status} className="space-y-4">
            <h3 className="text-lg font-medium text-white capitalize">
              {status.replace('_', ' ')}
            </h3>

            <div className="space-y-4">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <div 
                    key={task.id} 
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const taskId = e.dataTransfer.getData('taskId');
                      handleStatusChange(taskId, status);
                    }}
                  >
                    <h4 className="text-white font-medium mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-400 mb-4">{task.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center text-xs text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-monaco-bronze/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-monaco-bronze" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTask && (
        <NewTask
          projectId={projectId}
          onClose={() => setShowNewTask(false)}
          onSuccess={loadTasks}
        />
      )}
    </div>
  );
}

export default TaskBoard;
      