import React, { useState } from 'react';
import { Mail, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserInvitationProps {
  onClose: () => void;
  onInvite: () => void;
}

function UserInvitation({ onClose, onInvite }: UserInvitationProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-12);

      // Create the user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Create registration request
        const { error: requestError } = await supabase
          .from('registration_requests')
          .insert({
            user_id: user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            status: 'pending'
          });

        if (requestError) throw requestError;

        onInvite();
        onClose();
      }
    } catch (err) {
      console.error('Error inviting user:', err);
      setError('Failed to invite user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg p-6 relative">
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
            <Mail className="h-5 w-5 mr-2 text-monaco-bronze" />
            Invite New User
          </h2>
          <p className="text-gray-400 mt-1">
            Send an invitation to join the platform
          </p>
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
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter last name"
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
              {loading ? 'Sending Invitation...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserInvitation;