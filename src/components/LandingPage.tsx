import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
  onNewProject: () => void;
}

function LandingPage({ onGetStarted, onNewProject }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative flex flex-col min-h-screen">
          <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-32">
            <button 
              onClick={() => window.location.reload()}
              className="mb-12"
            >
              <Logo size="lg" variant="light" />
            </button>
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight text-center">
              Command Center
            </h2>
            <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto text-center">
              Your comprehensive project management hub with integrated document control, 
              risk management, and real-time progress tracking.
            </p>
            <div className="mt-12 flex justify-center space-x-6">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                <span className="flex items-center">
                  Projects
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </span>
              </button>
              <button
                onClick={onNewProject}
                className="inline-flex items-center px-8 py-4 border-2 border-monaco-bronze text-lg font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light transition-colors"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" strokeWidth={2} />
                  New Project
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;