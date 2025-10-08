import React, { useState } from 'react';

const SessionManager = ({ project, user }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Alice', status: 'online', instrument: 'Piano' },
    { id: 2, name: 'Bob', status: 'online', instrument: 'Drums' }
  ]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    // In a real implementation, this would connect to a WebRTC session
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="session-manager">
      <div className="session-header">
        <h3>🎹 Live Session</h3>
        <p>Real-time music collaboration for "{project.title}"</p>
      </div>

      <div className="session-status">
        <div className={`status-indicator ${isSessionActive ? 'active' : 'inactive'}`}>
          <span className="status-dot"></span>
          {isSessionActive ? 'Session Active' : 'Session Inactive'}
        </div>
        
        <div className="session-controls">
          {!isSessionActive ? (
            <button className="btn-primary" onClick={handleStartSession}>
              🎵 Start Live Session
            </button>
          ) : (
            <button className="btn-danger" onClick={handleEndSession}>
              ⏹️ End Session
            </button>
          )}
        </div>
      </div>

      <div className="participants-section">
        <h4>Participants ({participants.length})</h4>
        <div className="participants-list">
          {participants.map(participant => (
            <div key={participant.id} className="participant-card">
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <span className="participant-instrument">{participant.instrument}</span>
              </div>
              <div className={`participant-status ${participant.status}`}>
                <span className="status-dot"></span>
                {participant.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isSessionActive && (
        <div className="session-workspace">
          <div className="session-tools">
            <h4>Session Tools</h4>
            <div className="tool-buttons">
              <button className="tool-btn">🎹 Virtual Piano</button>
              <button className="tool-btn">🥁 Drum Pad</button>
              <button className="tool-btn">🎤 Record</button>
              <button className="tool-btn">📊 Metronome</button>
            </div>
          </div>
          
          <div className="session-timeline">
            <h4>Session Timeline</h4>
            <div className="timeline-placeholder">
              <p>🎵 Real-time collaboration workspace would appear here</p>
              <p>Features: Shared timeline, real-time audio, synchronized playback</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
