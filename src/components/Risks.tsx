import React, { useState } from 'react';
import { AlertCircle, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { Risk } from '../types/risk';
import { supabase } from '../lib/supabase';

function Risks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load risks on component mount
  React.useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('risk_register')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setRisks(data || []);

    } catch (err) {
      console.error('Error loading risks:', err);
      setError('Failed to load risks');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAction = async (riskId: string, action: 'resolved' | 'deleted') => {
    try {
      setLoading(true);
      setError(null);

      // Move to history
      const { error: historyError } = await supabase
        .from('risk_history')
        .insert({
          risk_id: riskId,
          action: action,
          date: new Date().toISOString()
        });

      if (historyError) throw historyError;

      // Remove from register
      const { error: deleteError } = await supabase
        .from('risk_register')
        .delete()
        .eq('id', riskId);

      if (deleteError) throw deleteError;

      // Update local state
      setRisks(risks.filter(risk => risk.id !== riskId));
      setSelectedRisk(null);

    } catch (err) {
      console.error('Error handling risk action:', err);
      setError('Failed to process risk action');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 15) return 'bg-red-500/30 text-white border border-red-500/50';
    if (severity >= 8) return 'bg-orange-500/30 text-white border border-orange-500/50';
    if (severity >= 4) return 'bg-yellow-500/30 text-white border border-yellow-500/50';
    return 'bg-green-500/30 text-white border border-green-500/50';
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Risk Register</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mitigation</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {risks.map((risk) => (
                <tr 
                  key={risk.id}
                  onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                  className={`cursor-pointer hover:bg-gray-700 ${selectedRisk === risk.id ? 'bg-gray-700' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">R{risk.id.padStart(3, '0')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(risk.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-md">{risk.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{risk.manager}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getSeverityColor(risk.impact * risk.probability)}`}>
                      {risk.impact * risk.probability}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-md">{risk.mitigation}</td>
                  {selectedRisk === risk.id && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleRiskAction(risk.id, 'resolved')}
                          className="p-1 text-green-500 hover:text-green-400 transition-colors"
                          title="Mark as Resolved"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRiskAction(risk.id, 'deleted')}
                          className="p-1 text-red-500 hover:text-red-400 transition-colors"
                          title="Delete Risk"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {risks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No risks have been added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Risks;