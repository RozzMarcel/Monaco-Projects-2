import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, AlertTriangle, WalletCards, Milestone } from 'lucide-react';
import { useProjectStore } from '../lib/store';
import { calculatePhaseCompletion } from '../utils/project';

interface ReportsProps {
  project: any;
}

function Reports({ project }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const phases = useProjectStore(state => state.phases);
  const financialSummary = useProjectStore(state => state.financialSummary);

  const reports = [
    {
      id: 'project_status',
      name: 'Project Status Report',
      description: 'Comprehensive overview of project progress, milestones, and key metrics',
      icon: Milestone,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Detailed financial analysis including budget vs actual spending',
      icon: WalletCards,
      color: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    {
      id: 'risk',
      name: 'Risk Assessment Report',
      description: 'Analysis of project risks, mitigation measures, and status',
      icon: AlertTriangle,
      color: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  ];

  const generateReport = () => {
    if (!selectedReport) return;

    let reportContent = '';
    const reportDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Header
    reportContent = `
MONACO PROJECTS
${project.name.toUpperCase()}
${reports.find(r => r.id === selectedReport)?.name}
Generated on ${reportDate}
Report Period: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}

`;

    switch (selectedReport) {
      case 'project_status':
        const overallCompletion = phases.reduce((sum, phase) => 
          sum + calculatePhaseCompletion(phase), 0) / phases.length;

        reportContent += `
PROJECT STATUS SUMMARY
=====================
Overall Completion: ${Math.round(overallCompletion)}%
Current Phase: ${phases.find(p => p.completion < 100)?.name || 'All phases complete'}
Start Date: ${project.startDate}
Duration: ${project.duration}

PHASE PROGRESS
=============
${phases.map(phase => `
${phase.name}
${'-'.repeat(phase.name.length)}
Completion: ${phase.completion}%
Status: ${phase.completion >= 100 ? 'Complete' : phase.completion > 0 ? 'In Progress' : 'Not Started'}

Subphases:
${phase.subphases.map(subphase => 
  `  • ${subphase.name}: ${subphase.completed}% complete`
).join('\n')}
`).join('\n')}
`;
        break;

      case 'financial':
        reportContent += `
FINANCIAL SUMMARY
================
Currency: EUR

BUDGET OVERVIEW
--------------
Total Budget: €${financialSummary.budgeted.total.toLocaleString()}
Total Spent: €${financialSummary.actual.total.toLocaleString()}
Variance: €${financialSummary.variance.total.toLocaleString()}
Variance %: ${((financialSummary.variance.total / financialSummary.budgeted.total) * 100).toFixed(1)}%

OPEX DETAILS
-----------
Budget: €${financialSummary.budgeted.opex.toLocaleString()}
Actual: €${financialSummary.actual.opex.toLocaleString()}
Variance: €${financialSummary.variance.opex.toLocaleString()}

CAPEX DETAILS
------------
Budget: €${financialSummary.budgeted.capex.toLocaleString()}
Actual: €${financialSummary.actual.capex.toLocaleString()}
Variance: €${financialSummary.variance.capex.toLocaleString()}
`;
        break;

      case 'risk':
        reportContent += `
RISK ASSESSMENT SUMMARY
======================
Total Active Risks: ${phases.length}
High Priority Risks: ${phases.filter(p => p.completion < 50).length}
Mitigated Risks: ${phases.filter(p => p.completion >= 90).length}

RISK DETAILS
-----------
${phases.map(phase => `
${phase.name}
Risk Level: ${phase.completion < 50 ? 'High' : phase.completion < 75 ? 'Medium' : 'Low'}
Mitigation Progress: ${phase.completion}%
Status: ${phase.completion >= 90 ? 'Mitigated' : 'Active'}
`).join('\n')}
`;
        break;
    }

    // Create and download the report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${selectedReport}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <div className="bg-gray-900 rounded-xl p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Project Reports</h2>
            <p className="text-gray-400 mt-1">Generate detailed reports for project analysis and documentation</p>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-3 gap-6">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`
                relative p-6 rounded-lg border transition-all duration-200 text-left group
                ${selectedReport === report.id
                  ? 'border-monaco-bronze bg-monaco-bronze/10'
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="flex flex-col space-y-4">
                <div className={`p-3 rounded-lg ${report.color} w-fit transition-colors group-hover:bg-opacity-20`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <h3 className="text-white text-lg font-medium">{report.name}</h3>
                <p className="text-sm text-gray-400">{report.description}</p>
                {selectedReport === report.id && (
                  <button
                    onClick={generateReport}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light w-full justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </button>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedReport && (
          <>
            {/* Date Range Selection */}
            <div className="bg-gray-800 rounded-lg p-4 mt-6">
              <h3 className="text-white font-medium mb-4">Report Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full pl-10 bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full pl-10 bg-gray-700 border-gray-600 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Report Preview</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Showing key metrics
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                {selectedReport === 'project_status' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">Overall Completion</span>
                      <span className="text-white font-medium">
                        {Math.round(phases.reduce((sum, phase) => sum + phase.completion, 0) / phases.length)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">Active Phase</span>
                      <span className="text-white font-medium">
                        {phases.find(p => p.completion < 100)?.name || 'All Complete'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Next Milestone</span>
                      <span className="text-white font-medium">
                        {phases.find(p => p.completion < 100)?.subphases.find(s => s.completed < 100)?.name || 'None'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedReport === 'financial' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">Total Budget</span>
                      <span className="text-white font-medium">
                        €{financialSummary.budgeted.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">Total Spent</span>
                      <span className="text-white font-medium">
                        €{financialSummary.actual.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Variance</span>
                      <span className={`font-medium ${
                        financialSummary.variance.total > 0 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        €{Math.abs(financialSummary.variance.total).toLocaleString()}
                        {financialSummary.variance.total > 0 ? ' Over' : ' Under'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedReport === 'risk' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">Total Risks</span>
                      <span className="text-white font-medium">{phases.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <span className="text-gray-300">High Priority</span>
                      <span className="text-red-500 font-medium">
                        {phases.filter(p => p.completion < 50).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Mitigated</span>
                      <span className="text-green-500 font-medium">
                        {phases.filter(p => p.completion >= 90).length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;