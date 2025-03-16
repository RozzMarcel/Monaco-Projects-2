import React, { useState } from 'react';
import { Plus, PenSquare, AlertTriangle, FolderOpen, Settings, ArrowLeft, FileText, Milestone, WalletCards, ClipboardList, CalendarClock, LayoutDashboard } from 'lucide-react';
import Navigation from './Navigation';
import Logo from './Logo';
import Level1 from './Level1';
import ProjectInputs from './ProjectInputs';
import RiskManagement from './RiskManagement';
import Files from './Files';
import Reports from './Reports';
import Admin from './Admin';
import NewProject from './NewProject';
import Dashboard from './Dashboard';
import { useProjectStore } from '../lib/store';

interface ProjectsPageProps {
  onReset: () => void;
  onSelectProject: (project: any) => void;
}

function ProjectsPage({ onReset, onSelectProject }: ProjectsPageProps) {
  const [showNewProject, setShowNewProject] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const selectedProject = useProjectStore(state => state.selectedProject);
  const setSelectedProject = useProjectStore(state => state.setSelectedProject);
  const revertProject = useProjectStore(state => state.revertProject);
  const projects = useProjectStore(state => state.projects);

  // Find the first available slot number
  const getNextAvailableSlot = () => {
    for (let i = 0; i < 16; i++) {
      const slotExists = projects.some(p => p.id === `slot-${i + 1}`);
      if (!slotExists) return i + 1;
    }
    return null;
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'level2', name: 'Project Details', icon: PenSquare },
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

  // Create project slots with Project 1 as template
  const projectSlots = Array.from({ length: 16 }, (_, index) => {
    return projects[index] || {
      id: `slot-${index + 1}`, 
      name: projects.find(p => p.id === `slot-${index + 1}`)?.name || `Project ${index + 1}`,
      description: "",
      startDate: "2024-02-15",
      duration: "18 months",
      location: "Monaco",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "system"
    };
  });

  const handleProjectClick = (index: number) => {
    const project = projectSlots[index];
    onSelectProject(project);
  };

  const handleRevertProject = (projectId: string) => {
    revertProject(projectId);
  };

  const handleNewProject = () => {
    const nextSlot = getNextAvailableSlot();
    if (nextSlot === null) {
      // All slots are taken
      return;
    }
    setShowNewProject(true);
  };

  const handleNavClick = (navId: string, dropdownId?: string) => {
    setActiveSection(dropdownId || navId);
  };

  if (selectedProject && activeSection) {
    const getComponent = () => {
      switch (activeSection) {
        case 'level2':
          return Level1;
        case 'risks':
          return RiskManagement;
        case 'reports':
          return Reports;
        case 'admin':
          return Admin;
        default:
          if (activeSection === 'files' || ['photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'].includes(activeSection)) {
            return Files;
          }
          if (activeSection === 'inputs' || ['phases', 'budget', 'actual', 'schedule'].includes(activeSection)) {
            return ProjectInputs;
          }
          return Level1;
      }
    };

    const Component = getComponent();

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
                  onClick={() => {
                    setSelectedProject(null);
                    setActiveSection('');
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Back to Projects</span>
                </button>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{selectedProject.name}</h1>
              <div className="w-32">
                {selectedProject.id === 'slot-1' && (
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
          onNavClick={handleNavClick}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 mt-36">
          <Component 
            project={selectedProject} 
            section={activeSection} 
            onSectionChange={(section: string) => setActiveSection(section)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <button onClick={onReset}>
              <Logo size="md" variant="light" />
            </button>
            <button
              onClick={handleNewProject}
              className="inline-flex items-center px-6 py-3 border-2 border-monaco-bronze text-base font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="mt-2 text-gray-300">Manage and track all your ongoing projects.</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {projectSlots.map((project, index) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(index)}
                className="relative group overflow-hidden rounded-lg transition-all duration-300 bg-monaco-bronze/90 hover:bg-monaco-bronze h-16 flex items-center justify-center p-4 text-center"
              >
                <div className="text-white text-sm font-medium">
                  {project.name}
                </div>
                <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {showNewProject && (
        <NewProject onClose={() => setShowNewProject(false)} />
      )}
    </div>
  );
}

export default ProjectsPage;