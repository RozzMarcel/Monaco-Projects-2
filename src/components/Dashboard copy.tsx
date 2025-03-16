import React from 'react';
import { VarianceIndicator } from './VarianceIndicator';
import { useProjectStore } from '../lib/store';
import { WalletCards, CalendarClock, AlertTriangle, TrendingUp } from 'lucide-react';
import Map from './Map';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(amount);
};

function Dashboard() {
  const financialSummary = useProjectStore(state => state.financialSummary);
  const phases = useProjectStore(state => state.phases);
  const selectedProject = useProjectStore(state => state.selectedProject);

  // Calculate overall project completion
  const projectCompletion = phases.length > 0
    ? Math.round(phases.reduce((sum, phase) => sum + phase.completion, 0) / phases.length)
    : 0;

  // Calculate risk level based on budget variance
  const getRiskLevel = () => {
    const totalVariancePercentage = (financialSummary.variance.total / financialSummary.budgeted.total) * 100;
    if (totalVariancePercentage > 20) return { level: 'High', color: 'text-red-500' };
    if (totalVariancePercentage > 10) return { level: 'Medium', color: 'text-yellow-500' };
    return { level: 'Low', color: 'text-green-500' };
  };

  const riskStatus = getRiskLevel();

  // Format project location for map
  const projectLocation = selectedProject?.location 
    ? `${selectedProject.location}`
    : 'Monaco';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Project Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dark Theme Metrics Cards */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Completion Card */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Completion</h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${projectCompletion}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-white">{projectCompletion}%</p>
                </div>
              </div>

              {/* Budget Status Card */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Budget</h3>
                  <WalletCards className="h-5 w-5 text-monaco-bronze" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Spent: {formatCurrency(financialSummary.actual.total)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Total: {formatCurrency(financialSummary.budgeted.total)}
                  </p>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-monaco-bronze rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((financialSummary.actual.total / financialSummary.budgeted.total) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Card */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Schedule</h3>
                  <CalendarClock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Phase Progress</p>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${projectCompletion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Risk Level Card */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Risk Level</h3>
                  <AlertTriangle className={`h-5 w-5 ${riskStatus.color}`} />
                </div>
                <p className={`text-2xl font-bold ${riskStatus.color}`}>
                  {riskStatus.level}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Overview Table */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">WORKS FINANCIAL OVERVIEW</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Budgeted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actual Cost</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Difference %</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Difference €</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">Professional OPEX</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {formatCurrency(financialSummary.budgeted.opex)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {formatCurrency(financialSummary.actual.opex)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.opex} 
                        budget={financialSummary.budgeted.opex}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.opex} 
                        budget={financialSummary.budgeted.opex}
                        showAmount
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">Contractor CAPEX</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {formatCurrency(financialSummary.budgeted.capex)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      {formatCurrency(financialSummary.actual.capex)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.capex} 
                        budget={financialSummary.budgeted.capex}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.capex} 
                        budget={financialSummary.budgeted.capex}
                        showAmount
                      />
                    </td>
                  </tr>
                  <tr className="bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">TOTAL</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right font-bold">
                      {formatCurrency(financialSummary.budgeted.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right font-bold">
                      {formatCurrency(financialSummary.actual.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.total} 
                        budget={financialSummary.budgeted.total}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <VarianceIndicator 
                        actual={financialSummary.actual.total} 
                        budget={financialSummary.budgeted.total}
                        showAmount
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <Map 
              address={projectLocation}
              projectId={selectedProject?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;