import React from 'react';
import './ProjectList.css';

const ProjectList = ({ projects, onSelectProject, onCreateNew, loading }) => {
  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>Your Music Projects</h2>
        <button className="btn-primary" onClick={onCreateNew}>
          + Create New Project
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎼</div>
          <h3>No projects yet</h3>
          <p>Start your musical journey by creating your first project!</p>
          <button className="btn-primary" onClick={onCreateNew}>
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="track-count">{project.tracks.length} tracks</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <div className="project-owner">
                  <strong>Owner:</strong> {project.owner}
                </div>
                <div className="contributors">
                  <strong>Contributors:</strong> {project.contributors.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
