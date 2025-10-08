import React, { useState } from 'react';
import { music_collab_backend } from 'declarations/music-collab-backend';
import TrackUpload from './TrackUpload';
import TrackList from './TrackList';
import './ProjectDetail.css';

const ProjectDetail = ({ project, onBack, onUpdate, onStartCollaboration }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddTrack = async (trackData) => {
    setLoading(true);
    try {
      // Debug logging to check all parameter types
      console.log('🔍 Adding track with parameters:', {
        project_id: project.id,
        project_id_type: typeof project.id,
        project_id_bigint: BigInt(project.id),
        name: trackData.name,
        name_type: typeof trackData.name,
        ipfsHash: trackData.ipfsHash,
        ipfsHash_type: typeof trackData.ipfsHash,
        uploadedBy: trackData.uploadedBy,
        uploadedBy_type: typeof trackData.uploadedBy,
        timestamp: trackData.timestamp || Date.now(),
        timestamp_type: typeof (trackData.timestamp || Date.now()),
        timestamp_bigint: BigInt(trackData.timestamp || Date.now())
      });

      // Validate all required parameters
      if (!project?.id) {
        throw new Error('Project ID is missing');
      }
      if (!trackData?.name) {
        throw new Error('Track name is missing');
      }
      if (!trackData?.ipfsHash) {
        throw new Error('IPFS hash is missing');
      }
      if (!trackData?.uploadedBy) {
        throw new Error('Uploaded by field is missing');
      }

      const result = await music_collab_backend.add_track(
        BigInt(project.id),
        String(trackData.name),
        String(trackData.ipfsHash),
        String(trackData.uploadedBy),
        BigInt(trackData.timestamp || Date.now())
      );
      
      if (result) {
        await onUpdate();
        setShowUpload(false);
        
        if (window.showToast) {
          window.showToast(`Track "${trackData.name}" added successfully!`, 'creation');
        }
      } else {
        throw new Error('Failed to add track');
      }
    } catch (error) {
      console.error('Error adding track:', error);
      if (window.showToast) {
        window.showToast(`Failed to add track: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    if (window.confirm('Are you sure you want to remove this track?')) {
      try {
        // Convert string trackId to BigInt if necessary
        const trackIdNum = typeof trackId === 'string' ? BigInt(trackId.replace(/\D/g, '') || 0) : BigInt(trackId);
        const success = await music_collab_backend.remove_track(BigInt(project.id), trackIdNum);
        if (success) {
          await onUpdate();
        }
      } catch (error) {
        console.error('Error removing track:', error);
      }
    }
  };

  const handleAddContributor = async () => {
    const contributor = prompt('Enter contributor name:');
    if (contributor) {
      try {
        const success = await music_collab_backend.add_contributor(BigInt(project.id), contributor);
        if (success) {
          await onUpdate();
        }
      } catch (error) {
        console.error('Error adding contributor:', error);
      }
    }
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Projects
        </button>
        <div className="project-info">
          <h1>{project.title}</h1>
          <p className="project-description">{project.description}</p>
          <div className="project-meta">
            <span><strong>Owner:</strong> {project.owner}</span>
            <span><strong>Contributors:</strong> {project.contributors.length}</span>
            <span><strong>Tracks:</strong> {project.tracks.length}</span>
          </div>
          <div className="project-actions">
            <button 
              className="btn-primary" 
              onClick={() => onStartCollaboration && onStartCollaboration()}
            >
              🤝 Start Collaboration
            </button>
          </div>
        </div>
      </div>

      <div className="project-content">
        <div className="contributors-section">
          <div className="section-header">
            <h3>Contributors</h3>
            <button className="btn-small" onClick={handleAddContributor}>
              + Add Contributor
            </button>
          </div>
          <div className="contributors-list">
            {project.contributors.length === 0 ? (
              <p>No contributors yet</p>
            ) : (
              project.contributors.map((contributor, index) => (
                <span key={index} className="contributor-tag">
                  {contributor}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="tracks-section">
          <div className="section-header">
            <h3>Tracks</h3>
            <button 
              className="btn-primary" 
              onClick={() => setShowUpload(true)}
              disabled={loading}
            >
              + Upload Track
            </button>
          </div>
          
          {showUpload && (
            <TrackUpload
              onSubmit={handleAddTrack}
              onCancel={() => setShowUpload(false)}
              loading={loading}
            />
          )}
          
          <TrackList
            tracks={project.tracks}
            onRemoveTrack={handleRemoveTrack}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
