import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, History } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RiskHistoryRecord {
  id: string;
  risk_id: string;
  action: string;
  date: string;
  metadata: {
    description: string;
    manager: string;
    impact: number;
    probability: number;
    mitigation: string;
    date: string;
  };
}

function RiskHistory() {
  const [history, setHistory] = useState<RiskHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('risk_history')
        .select(`
          *,
          metadata
        `)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setHistory(data || []);

    } catch (err) {
      console.error('Error loading risk history:', err);
      setError('Failed to load risk history');
    } finally {
      setLoading(false);
    }
  };

  const calculateSeverity = (impact: number, probability: number) => {
    return impact * probability;
  };

  const getSeverityColor = (impact: number, probability: number) => {
    const severity = calculateSeverity(impact, probability);
    if (severity >= 15) return 'bg-red-500/30 text-white border border-red-500/50';
    if (severity >= 8) return 'bg-orange-500/30 text-white border border-orange-500/50';
    if (severity >= 4) return 'bg-yellow-500/30 text-white border border-yellow-500/50';
    return 'bg-green-500/30 text-white border border-green-500/50';
  };

  const getRiskLevel = (impact: number, probability: number) => {
    const severity = calculateSeverity(impact, probability);
    if (severity >= 15) return 'High Risk';
    if (severity >= 8) return 'Medium Risk';
    if (severity >= 4) return 'Low Risk';
    return 'Very Low Risk';
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
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <History className="h-5 w-5 mr-2 text-monaco-bronze" />
        Risk History
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Probability</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mitigation</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {record.risk_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.action === 'deleted' 
                      ? 'bg-red-500/10 text-red-500' 
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {record.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                  {record.metadata?.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {record.metadata?.manager}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                  {record.metadata?.impact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                  {record.metadata?.probability}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {record.metadata && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                      getSeverityColor(record.metadata.impact, record.metadata.probability)
                    }`}>
                      {getRiskLevel(record.metadata.impact, record.metadata.probability)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                  {record.metadata?.mitigation}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                  No risk history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiskHistory;