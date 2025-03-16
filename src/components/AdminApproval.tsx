import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegistrationRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  position: string;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
}

function AdminApproval() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error loading requests:', err);
      setError('Failed to load registration requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string, approved: boolean) => {
    try {
      setProcessingId(requestId);
      setError(null);

      const { error } = await supabase.rpc('handle_registration_approval', {
        request_id: requestId,
        approved: approved
      });

      if (error) throw error;

      // Reload requests
      await loadRequests();
    } catch (err) {
      console.error('Error processing request:', err);
      setError(`Failed to ${approved ? 'approve' : 'reject'} registration`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-monaco-bronze" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-monaco-bronze" />
            Registration Requests
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No pending registration requests
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {request.first_name} {request.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.company || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.position || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApproval(request.id, true)}
                            disabled={processingId === request.id}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleApproval(request.id, false)}
                            disabled={processingId === request.id}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminApproval;