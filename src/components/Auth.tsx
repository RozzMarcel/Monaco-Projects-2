import React, { useEffect, useState } from 'react';
import { Triangle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onAuthSuccess: () => void;
}

function Auth({ onAuthSuccess }: AuthProps) {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      onAuthSuccess();
    } catch (err) {
      console.error('Auth error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2">
            <Triangle className="h-8 w-8 text-monaco-bronze rotate-180" />
            <span className="text-4xl font-bold text-white">MONACO PROJECTS</span>
          </div>
        </div>

        <div className="bg-gray-800 py-8 px-4 shadow-xl shadow-black/20 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-monaco-bronze hover:bg-monaco-bronze-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-monaco-bronze disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;