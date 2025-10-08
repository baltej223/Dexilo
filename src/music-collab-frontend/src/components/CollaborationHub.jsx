import React, { useState } from 'react';
import { authService } from '../services/auth';
import ChatWindow from './ChatWindow';
import SessionManager from './SessionManager';
import RoyaltyManager from './RoyaltyManager';
import TrackUpload from './TrackUpload';
import './CollaborationHub.css';

const CollaborationHub = ({ project, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('session'); // 'session', 'chat', 'upload', 'royalties'
  const [loading, setLoading] = useState(false);

  const handleTrackUpload = async (trackData) => {
    if (!user || !project) {
      alert('Please login and select a project first');
      return;
    }

    setLoading(true);
    try {
      const actor = authService.getActor();
      if (!actor) throw new Error('No authenticated actor available');
      
      // Add track to the project using the existing backend function
      const success = await actor.add_track(
        BigInt(project.id),
        trackData.name,
        trackData.ipfsHash,
        trackData.uploadedBy,
        BigInt(Date.now()) // Convert to BigInt for IC
      );
      
      if (success) {
        // Show success toast instead of alert
        if (window.showToast) {
          window.showToast(`🎵 Track "${trackData.name}" added to project successfully!`, 'creation');
        }
        // Reset the active tab to show the session view
        setActiveTab('session');
      } else {
        throw new Error('Failed to add track to project');
      }
    } catch (error) {
      console.error('Error uploading track:', error);
      if (window.showToast) {
        window.showToast('Failed to upload track. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="collaboration-hub">
        <div className="error-state">
          <h3>No project selected</h3>
          <button className="btn-secondary" onClick={onBack}>
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'session', label: 'Live Session', icon: '🎹' },
    { id: 'chat', label: 'Team Chat', icon: '💬' },
    { id: 'upload', label: 'Upload Track', icon: '📤' },
    { id: 'royalties', label: 'Royalties', icon: '💰' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'session':
        return <SessionManager project={project} user={user} />;
      case 'chat':
        return <ChatWindow project={project} user={user} />;
      case 'upload':
        return (
          <TrackUpload 
            project={project} 
            user={user} 
            onSubmit={handleTrackUpload}
            onCancel={() => setActiveTab('session')}
            loading={loading}
          />
        );
      case 'royalties':
        return <RoyaltyManager project={project} user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="collaboration-hub">
      <div className="collab-header">
        <button className="btn-secondary back-btn" onClick={onBack}>
          ← Back to Project
        </button>
        <div className="project-info">
          <h2>🤝 Collaborating on "{project.title}"</h2>
          <p>Real-time music collaboration workspace</p>
        </div>
      </div>

      <div className="collab-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="collab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CollaborationHub;
