import React from 'react';
import LandingPage from './components/LandingPage';
import ProjectsPage from './components/ProjectsPage';
import NewProject from './components/NewProject';
import Dashboard from './components/Dashboard';
import { useProjectStore } from './lib/store';

function App() {
  const [showNewProject, setShowNewProject] = React.useState(false);
  const [showProjects, setShowProjects] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const setSelectedProjectStore = useProjectStore(state => state.setSelectedProject);

  const handleGetStarted = () => {
    setShowProjects(true);
  };

  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
    setSelectedProjectStore(project);
  };

  return (
    <>
      {showProjects ? (
        selectedProject ? (
          <Dashboard 
            project={selectedProject} 
            onBack={() => {
              setSelectedProject(null);
              setSelectedProjectStore(null);
            }}
            onReset={() => setShowProjects(false)}
          />
        ) : (
          <ProjectsPage 
            onReset={() => setShowProjects(false)}
            onSelectProject={handleSelectProject}
          />
        )
      ) : (
        <LandingPage
          onGetStarted={handleGetStarted}
          onNewProject={() => setShowNewProject(true)}
        />
      )}
      {showNewProject && (
        <NewProject onClose={() => setShowNewProject(false)} />
      )}
    </>
  );
}

export default App;