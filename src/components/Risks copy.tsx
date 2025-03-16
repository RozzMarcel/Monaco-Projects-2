import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Risk } from '../types/risk';

function Risks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    impact: 1,
    probability: 1,
    status: 'open'
  });

  const handleAddRisk = () => {
    if (!newRisk.description || !newRisk.manager) return;

    const risk: Risk = {
      id: `RISK-${risks.length + 1}`,
      description: newRisk.description,
      impact: newRisk.impact || 1,
      probability: newRisk.probability || 1,
      severity: (newRisk.impact || 1) * (newRisk.probability || 1),
      manager: newRisk.manager,
      date: new Date().toISOString(),
      status: 'open',
      mitigation: newRisk.mitigation
    };

    setRisks([...risks, risk]);
    setShowAddRisk(false);
    setNewRisk({
      impact: 1,
      probability: 1,
      status: 'open'
    });
  };

  return (
    <div className="space-y-6">
      {/* Risk List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Project Risks</h2>
          <button
            onClick={() => setShowAddRisk(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-monaco-bronze hover:bg-monaco-bronze-light"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Risk
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {risks.map((risk) => (
                <tr key={risk.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">{risk.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.manager}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{risk.impact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{risk.probability}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      risk.severity >= 16
                        ? 'bg-red-100 text-red-800'
                        : risk.severity >= 8
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {risk.severity >= 8 && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {risk.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      risk.status === 'open'
                        ? 'bg-red-100 text-red-800'
                        : risk.status === 'mitigated'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {risk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">{risk.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Risk Modal */}
      {showAddRisk && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Add New Risk</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                  value={newRisk.description || ''}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                  value={newRisk.manager || ''}
                  onChange={(e) => setNewRisk({ ...newRisk, manager: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                    value={newRisk.impact}
                    onChange={(e) => setNewRisk({ ...newRisk, impact: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                    value={newRisk.probability}
                    onChange={(e) => setNewRisk({ ...newRisk, probability: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation Plan
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-monaco-bronze focus:ring-monaco-bronze"
                  value={newRisk.mitigation || ''}
                  onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddRisk(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRisk}
                className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light"
              >
                Add Risk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Risks;