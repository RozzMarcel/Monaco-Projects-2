import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateRiskId } from '../utils/risk';

interface NewRiskProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function NewRisk({ projectId, onClose, onSuccess }: NewRiskProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: 'R001',
    description: '',
    manager: '',
    impact: 1,
    probability: 1,
    mitigation: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Get the next available risk ID when component mounts
    const fetchNextId = async () => {
      try {
        const { data: existingRisks } = await supabase
          .from('risk_register')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
        
        const nextId = generateRiskId(existingRisks?.[0]?.id);
        setFormData(prev => ({ ...prev, id: nextId }));
      } catch (err) {
        console.error('Error fetching next risk ID:', err);
        setError('Failed to generate risk ID');
      }
    };
    
    fetchNextId();
  }, []);

  const calculateSeverity = (impact: number, probability: number) => {
    return impact * probability;
  };
  
  const getSeverityColor = (impact: number, probability: number) => {
    const severity = calculateSeverity(impact, probability);
    if (severity >= 15) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (severity >= 8) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (severity >= 4) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const getRiskLevel = (impact: number, probability: number) => {
    const severity = calculateSeverity(impact, probability);
    if (severity >= 15) return 'High Risk';
    if (severity >= 8) return 'Medium Risk';
    if (severity >= 4) return 'Low Risk';
    return 'Very Low Risk';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('risk_register')
        .insert({
          id: formData.id,
          project_id: projectId,
          description: formData.description,
          manager: formData.manager,
          impact: formData.impact,
          probability: formData.probability,
          mitigation: formData.mitigation,
          date: formData.date
        });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating risk:', err);
      setError('Failed to create risk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">New Risk Control Measure</h2>
          <p className="text-gray-400 mt-1">Add a new risk control measure</p>
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
              Risk ID
            </label>
            <input
              type="text"
              value={formData.id}
              readOnly
              className="w-full bg-gray-800 border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                readOnly
                className="w-full pl-10 bg-gray-800 border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Describe the risk"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Manager
            </label>
            <input
              type="text"
              required
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Risk manager name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Risk Assessment
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getSeverityColor(formData.impact, formData.probability)
              }`}>
                {getRiskLevel(formData.impact, formData.probability)} ({calculateSeverity(formData.impact, formData.probability)})
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Impact (1-5)</label>
                <select
                  className={`w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white ${
                    formData.impact >= 4 ? 'text-red-500' :
                    formData.impact >= 3 ? 'text-orange-500' :
                    formData.impact >= 2 ? 'text-yellow-500' : 'text-green-500'
                  }`}
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                >
                  <option value={1}>Very Low</option>
                  <option value={2}>Low</option>
                  <option value={3}>Medium</option>
                  <option value={4}>High</option>
                  <option value={5}>Very High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Probability (1-5)</label>
                <select
                  className={`w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white ${
                    formData.probability >= 4 ? 'text-red-500' :
                    formData.probability >= 3 ? 'text-orange-500' :
                    formData.probability >= 2 ? 'text-yellow-500' : 'text-green-500'
                  }`}
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                >
                  <option value={1}>Very Low</option>
                  <option value={2}>Low</option>
                  <option value={3}>Medium</option>
                  <option value={4}>High</option>
                  <option value={5}>Very High</option>
                </select>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {`${formData.impact >= 4 || formData.probability >= 4 ? 'High attention required' :
                formData.impact >= 3 || formData.probability >= 3 ? 'Moderate attention required' :
                'Low attention required'}`}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Mitigation Plan
            </label>
            <textarea
              rows={3}
              value={formData.mitigation}
              onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
              className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              placeholder="Describe how this risk will be mitigated"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Add Risk Control Measure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRisk;