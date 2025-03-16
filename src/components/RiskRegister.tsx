import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface RiskRecord {
  id: string;
  description: string;
  manager: string;
  impact: number;
  probability: number;
  mitigation: string;
  date: string;
  status: string;
  created_at: string;
}

interface RiskRegisterProps {
  shouldReload?: boolean;
}

function RiskRegister({ shouldReload }: RiskRegisterProps) {
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<RiskRecord>>({});

  useEffect(() => {
    loadRisks();
  }, [shouldReload]);

  const handleAction = async (riskId: string, action: 'edit' | 'resolve' | 'delete') => {
    try {
      switch (action) {
        case 'edit':
          const riskToEdit = risks.find(r => r.id === riskId);
          if (riskToEdit) {
            setEditData(riskToEdit);
            setEditMode(true);
          }
          break;

        case 'resolve':
          // Get the risk data before resolving
          const resolvedRisk = risks.find(r => r.id === riskId);
          if (!resolvedRisk) throw new Error('Risk not found');

          // Move to history before updating status
          const { error: historyError } = await supabase
            .from('risk_history')
            .insert({
              risk_id: riskId,
              project_id: resolvedRisk.project_id,
              action: 'resolved',
              date: new Date().toISOString(),
              metadata: {
                description: resolvedRisk.description,
                manager: resolvedRisk.manager,
                impact: resolvedRisk.impact,
                probability: resolvedRisk.probability,
                mitigation: resolvedRisk.mitigation,
                date: resolvedRisk.date
              }
            });

          if (historyError) throw historyError;

          // Update risk status
          const { error: deleteError } = await supabase
            .from('risk_register')
            .delete()
            .eq('id', riskId);

          if (deleteError) throw deleteError;

          break;

        case 'delete':
          // Move to history before deleting
          const deletedRisk = risks.find(r => r.id === riskId);
          if (!deletedRisk) throw new Error('Risk not found');

          const { error: deleteHistoryError } = await supabase
            .from('risk_history')
            .insert({
              risk_id: riskId,
              project_id: deletedRisk.project_id,
              action: 'deleted',
              date: new Date().toISOString(),
              metadata: {
                description: deletedRisk.description,
                manager: deletedRisk.manager,
                impact: deletedRisk.impact,
                probability: deletedRisk.probability,
                mitigation: deletedRisk.mitigation,
                date: deletedRisk.date
              }
            });

          if (deleteHistoryError) throw deleteHistoryError;

          // Delete the risk after recording history
          const { error: deleteRiskError } = await supabase
            .from('risk_register')
            .delete()
            .eq('id', riskId);

          if (deleteRiskError) throw deleteRiskError;
          break;
      }

      loadRisks();
      setSelectedRisk(null);
    } catch (err) {
      console.error(`Error ${action}ing risk:`, err);
      setError(`Failed to ${action} risk`);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const { error: updateError } = await supabase
        .from('risk_register')
        .update(editData)
        .eq('id', editData.id);

      if (updateError) throw updateError;

      // Add to history
      await supabase
        .from('risk_history')
        .insert({
          risk_id: editData.id!,
          action: 'edited',
          date: new Date().toISOString()
        });

      setEditMode(false);
      setEditData({});
      loadRisks();
    } catch (err) {
      console.error('Error updating risk:', err);
      setError('Failed to update risk');
    }
  };

  const loadRisks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify Supabase connection
      const { data: _, error: connectionError } = await supabase
        .from('risk_register')
        .select('count')
        .limit(1)
        .single();

      if (connectionError) {
        throw new Error('Database connection failed');
      }

      const { data, error: fetchError } = await supabase
        .from('risk_register')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setRisks(data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load risk register';
      console.error('Error loading risks:', errorMessage);
      setError(errorMessage);
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
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-monaco-bronze" />
          Risk Register
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mitigation</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {risks.map((risk) => (
                <tr 
                  key={risk.id} 
                  onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                  className={`hover:bg-gray-700 transition-colors cursor-pointer ${
                    selectedRisk === risk.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{risk.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(risk.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-md">{risk.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{risk.manager}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">{risk.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">{risk.probability}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getSeverityColor(risk.impact, risk.probability)}`}>
                      {getRiskLevel(risk.impact, risk.probability)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-md">{risk.mitigation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {selectedRisk === risk.id && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(risk.id, 'edit');
                          }}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(risk.id, 'resolve');
                          }}
                          className="text-green-500 hover:text-green-400"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(risk.id, 'delete');
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {risks.length === 0 && (
                <tr className="hover:bg-gray-700">
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
                    No risks have been added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Edit Risk</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Manager</label>
                <input
                  type="text"
                  value={editData.manager}
                  onChange={(e) => setEditData({ ...editData, manager: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Impact</label>
                  <select
                    value={editData.impact}
                    onChange={(e) => setEditData({ ...editData, impact: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  >
                    {[1, 2, 3, 4, 5].map(value => (
                      <option key={value} value={value}>
                        {value === 1 ? 'Very Low' :
                         value === 2 ? 'Low' :
                         value === 3 ? 'Medium' :
                         value === 4 ? 'High' :
                         'Very High'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Probability</label>
                  <select
                    value={editData.probability}
                    onChange={(e) => setEditData({ ...editData, probability: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  >
                    {[1, 2, 3, 4, 5].map(value => (
                      <option key={value} value={value}>
                        {value === 1 ? 'Very Low' :
                         value === 2 ? 'Low' :
                         value === 3 ? 'Medium' :
                         value === 4 ? 'High' :
                         'Very High'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Mitigation</label>
                <textarea
                  value={editData.mitigation}
                  onChange={(e) => setEditData({ ...editData, mitigation: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData({});
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskRegister;