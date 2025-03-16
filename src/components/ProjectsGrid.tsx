import React from 'react';
import { Plus } from 'lucide-react';

interface ProjectsGridProps {
  onProjectClick: (index: number) => void;
  onNewProject: () => void;
}

function ProjectsGrid({ onProjectClick, onNewProject }: ProjectsGridProps) {
  // Create project slots with Project 1 as template
  const projectSlots = Array.from({ length: 16 }, (_, index) => ({
    id: `slot-${index + 1}`,
    name: `Project ${index + 1}`,
    description: "",
    startDate: "2024-02-15",
    duration: "18 months",
    location: "Monaco",
    status: "pending"
  }));

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
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-white">MONACO PROJECTS</span>
              <span className="text-sm text-white/80 tracking-wider">
                INTERIOR DESIGN & RENOVATION MANAGEMENT
              </span>
            </div>
            <button
              onClick={onNewProject}
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
                onClick={() => onProjectClick(index)}
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
    </div>
  );
}

export default ProjectsGrid;