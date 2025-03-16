import React, { useState, useEffect } from 'react';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import { Comment } from '../types/collaboration';
import { supabase } from '../lib/supabase';

interface TeamChatProps {
  projectId: string;
}

function TeamChat({ projectId }: TeamChatProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
    subscribeToComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users:created_by (
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
      setComments(data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComments = () => {
    const subscription = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
       filter: `project_id=eq.${projectId}`
      }, () => {
        loadComments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          project_id: projectId,
          content: newComment.trim(),
          created_by: user.id
        });

      if (error) throw error;
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
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
      <h2 className="text-xl font-bold text-white mb-6">Team Chat</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-monaco-bronze/10 flex items-center justify-center">
                <span className="text-monaco-bronze text-lg font-semibold">
                  {comment.users.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  {comment.users.user_profiles?.first_name} {comment.users.user_profiles?.last_name}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-white">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white resize-none"
            rows={3}
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 text-monaco-bronze hover:text-monaco-bronze-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamChat;