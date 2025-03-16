import React, { useState, useEffect } from 'react';
import { AlertCircle, MessageSquare, CheckSquare, FileText, AlertTriangle, GitCommit, CalendarClock } from 'lucide-react';
import { ActivityEvent } from '../types/collaboration';
import { supabase } from '../lib/supabase';

interface ActivityFeedProps {
  projectId: string;
}

function ActivityFeed({ projectId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [projectId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('activity_events')
        .select(`
          *,
          users:user_id (
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
      setActivities(data || []);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-5 w-5" />;
      case 'task':
        return <CheckSquare className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5" />;
      case 'milestone':
        return <CalendarClock className="h-5 w-5" />;
      default:
        return <GitCommit className="h-5 w-5" />;
    }
  };

  const formatActivityMessage = (activity: ActivityEvent) => {
    switch (activity.type) {
      case 'milestone':
        switch (activity.action) {
          case 'completed':
            return `completed milestone "${activity.metadata?.name}" on ${new Date(activity.metadata?.actual_date).toLocaleDateString()}`;
          case 'created':
            return `added milestone "${(activity.metadata as any)?.name}" due on ${new Date((activity.metadata as any)?.due_date).toLocaleDateString()}`;
          default:
            return `updated milestone "${(activity.metadata as any)?.name}"`;
        }
      default:
        return `${activity.action} ${activity.metadata?.title}`;
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
      <h2 className="text-xl font-bold text-white mb-6">Activity Feed</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {activities.map(activity => (
          <div key={activity.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-monaco-bronze/10 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">
                    {activity.users.user_profiles?.first_name} {activity.users.user_profiles?.last_name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  {formatActivityMessage(activity)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-center text-gray-400">No recent activity</p>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;