import React, { useState, useEffect } from 'react';
import { music_collab_backend } from 'declarations/music-collab-backend';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';
import NFTMarketplace from './components/NFTMarketplace';
import CollaborationHub from './components/CollaborationHub';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'projects', 'create', 'detail', 'nft', 'collaborate'
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProjects(),
        loadNFTs()
      ]);
      // Simulate user authentication - in real app, use Internet Identity
      setUser({ id: 'user123', name: 'Music Creator' });
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const projectList = await music_collab_backend.list_projects();
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadNFTs = async () => {
    try {
      const nftList = await music_collab_backend.list_nfts();
      setNFTs(nftList);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  };

  const handleCreateProject = async (projectData) => {
    console.log('handleCreateProject called with:', projectData);
    setLoading(true);
    try {
      console.log('Calling backend create_project...');
      const projectId = await music_collab_backend.create_project(
        projectData.title,
        projectData.description,
        projectData.owner
      );
      console.log('Project created with ID:', projectId);
      await loadProjects();
      setCurrentView('projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId) => {
    try {
      const project = await music_collab_backend.get_project(projectId);
      if (project.length > 0) {
        setSelectedProject(project[0]);
        setCurrentView('detail');
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };
        setSelectedProject(project[0]);
        setCurrentView('detail');
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setCurrentView('list')}
            loading={loading}
          />
        );
      case 'detail':
        return (
          <ProjectDetail
            project={selectedProject}
            onBack={() => setCurrentView('list')}
            onUpdate={loadProjects}
          />
        );
      default:
        return (
          <ProjectList
            projects={projects}
            onSelectProject={handleSelectProject}
            onCreateNew={() => setCurrentView('create')}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 Music Collaboration Platform</h1>
        <p>Create, collaborate, and share your music projects</p>
      </header>
      <main className="App-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
