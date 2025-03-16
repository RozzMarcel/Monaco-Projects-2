import React from 'react';
import { useState } from 'react';
import { VarianceIndicator } from './VarianceIndicator';
import { useProjectStore } from '../lib/store';
import { WalletCards, CalendarClock, AlertTriangle, TrendingUp, Building2, Plus, PenSquare, FolderOpen, Settings, ArrowLeft, FileText, Milestone, ClipboardList, LayoutDashboard, Ruler, MapPin, Shield, Clock, CheckCircle } from 'lucide-react';
import Map from './Map';
import Navigation from './Navigation';
import Logo from './Logo';
import Level1 from './Level1';
import ProjectInputs from './ProjectInputs';
import RiskManagement from './RiskManagement';
import Files from './Files';
import Reports from './Reports';
import Admin from './Admin';
import { supabase } from '../lib/supabase';

interface RiskMetrics {
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

interface DashboardProps {
  project: any;
  onBack: () => void;
  onReset: () => void;
}

interface ScheduleMetrics {
  total: number;
  completed: number;
  pending: number;
  delayed: number;
  nextMilestone?: {
    name: string;
    dueDate: string;
  };
}

function Dashboard({ project, onBack, onReset }: DashboardProps) {
  const financialSummary = useProjectStore(state => state.financialSummary);
  const phases = useProjectStore(state => state.phases);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [riskMetrics, setRiskMetrics] = React.useState<RiskMetrics>({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0
  });

  const [scheduleMetrics, setScheduleMetrics] = React.useState<ScheduleMetrics>({
    total: 0,
    completed: 0,
    pending: 0,
    delayed: 0
  });

  React.useEffect(() => {
    if (project) {
      loadRiskMetrics();
      loadScheduleMetrics();
    }
  }, [project]);

  const loadScheduleMetrics = async () => {
    try {
      const { data: milestones } = await supabase
        .from('schedule_milestones')
        .select('*')
        .eq('project_id', project?.id)
        .order('due_date', { ascending: true });

      if (milestones) {
        const today = new Date();
        const metrics = milestones.reduce((acc, milestone) => {
          acc.total++;
          if (milestone.status === 'completed') {
            acc.completed++;
          } else {
            acc.pending++;
            const dueDate = new Date(milestone.due_date);
            if (dueDate < today && !milestone.actual_date) {
              acc.delayed++;
            }
            // Track next upcoming milestone
            if (!acc.nextMilestone && dueDate >= today) {
              acc.nextMilestone = {
                name: milestone.name,
                dueDate: milestone.due_date
              };
            }
          }
          return acc;
        }, { total: 0, completed: 0, pending: 0, delayed: 0 } as ScheduleMetrics);

        setScheduleMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading schedule metrics:', error);
    }
  };

  const loadRiskMetrics = async () => {
    try {
      const { data: risks } = await supabase
        .from('risk_register')
        .select('impact, probability')
        .eq('project_id', project?.id)
        .eq('status', 'active');

      if (risks) {
        const metrics = risks.reduce((acc, risk) => {
          const severity = risk.impact * risk.probability;
          acc.total++;
          if (severity >= 15) acc.highRisk++;
          else if (severity >= 8) acc.mediumRisk++;
          else acc.lowRisk++;
          return acc;
        }, { total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });

        setRiskMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading risk metrics:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'level2', name: 'Project Details', icon: PenSquare, dropdownItems: [
      { id: 'overview', name: 'Project Overview', icon: FileText, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', description: 'View comprehensive project information' },
      { id: 'stakeholder', name: 'Stakeholder Information', icon: Building2, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', description: 'Manage stakeholder contacts and details' },
      { id: 'specifications', name: 'Project Specifications', icon: Ruler, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', description: 'View and manage project technical details' },
      { id: 'location', name: 'Project Location', icon: MapPin, color: 'bg-red-500/10 text-red-500 border-red-500/20', description: 'Manage project location and site details' }
    ] },
    { id: 'inputs', name: 'Project Inputs', icon: PenSquare, dropdownItems: [
      { id: 'phases', name: 'Project Phases', icon: Milestone, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
      { id: 'budget', name: 'Budget', icon: WalletCards, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      { id: 'actual', name: 'Actual', icon: ClipboardList, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      { id: 'schedule', name: 'Project Schedule', icon: CalendarClock, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
    ] },
    { id: 'risks', name: 'Risk Management', icon: AlertTriangle },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'files', name: 'Files', icon: FolderOpen },
    { id: 'admin', name: 'Administration', icon: Settings }
  ];

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
  const projectLocation = project?.location 
    ? `${project.location}`
    : 'Monaco';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <button onClick={onReset}>
                <Logo size="sm" variant="dark" />
              </button>
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Projects</span>
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            <div className="w-32">
              {project.id === 'slot-1' && (
                <button 
                  onClick={() => revertProject('slot-1')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Revert Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2301&q=80')] bg-cover bg-center bg-fixed brightness-50"
        >
          <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-[2px]"></div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        items={navItems}
        activeSection={activeSection}
        onNavClick={(navId, dropdownId) => setActiveSection(dropdownId || navId)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 mt-36">
        {activeSection === 'dashboard' && (
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
                          Spent: €{financialSummary.actual.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          Total: €{financialSummary.budgeted.total.toLocaleString()}
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
                        <h3 className="text-lg font-semibold text-white">Schedule Overview</h3>
                        <CalendarClock className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Milestones</span>
                          <span className="text-white font-bold">{scheduleMetrics.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Completed</span>
                          <span className="text-green-500 font-bold">{scheduleMetrics.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Pending</span>
                          <span className="text-yellow-500 font-bold">{scheduleMetrics.pending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Delayed</span>
                          <span className="text-red-500 font-bold">{scheduleMetrics.delayed}</span>
                        </div>
                        {scheduleMetrics.nextMilestone && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex items-center text-sm text-gray-400">
                              <Clock className="h-4 w-4 mr-2" />
                              Next: {scheduleMetrics.nextMilestone.name}
                              <span className="ml-2 text-monaco-bronze">
                                ({new Date(scheduleMetrics.nextMilestone.dueDate).toLocaleDateString()})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Risk Overview Card */}
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Risk Overview</h3>
                        <Shield className="h-5 w-5 text-monaco-bronze" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Active Risks</span>
                          <span className="text-white font-bold">{riskMetrics.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">High Risk</span>
                          <span className="text-red-500 font-bold">{riskMetrics.highRisk}</span>
                        </div>
                      </div>
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
                            €{financialSummary.budgeted.opex.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                            €{financialSummary.actual.opex.toLocaleString()}
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
                            €{financialSummary.budgeted.capex.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                            €{financialSummary.actual.capex.toLocaleString()}
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
                            €{financialSummary.budgeted.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right font-bold">
                            €{financialSummary.actual.total.toLocaleString()}
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
                    projectId={project?.id}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'level2' && (
          <Level1 
            project={project}
            section=""
            onSectionChange={setActiveSection}
          />
        )}

        {(activeSection === 'stakeholder' || activeSection === 'overview' || activeSection === 'specifications' || activeSection === 'location') && (
          <Level1 
            project={project}
            section={activeSection}
            onSectionChange={setActiveSection}
          />
        )}

        {(activeSection === 'inputs' || ['phases', 'budget', 'actual', 'schedule'].includes(activeSection)) && (
          <ProjectInputs
            project={project}
            section={activeSection}
            onSectionChange={setActiveSection}
          />
        )}

        {activeSection === 'risks' && (
          <RiskManagement project={project} />
        )}

        {activeSection === 'reports' && (
          <Reports project={project} />
        )}

        {(activeSection === 'files' || ['photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'].includes(activeSection)) && (
          <Files
            project={project}
            section={activeSection}
          />
        )}

        {activeSection === 'admin' && (
          <Admin project={project} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;