import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import './TrackList.css';

const TrackList = ({ tracks, onRemoveTrack }) => {
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const handlePlay = (track) => {
    if (currentPlayingTrack?.id === track.id) {
      setIsPlaying(true);
    } else {
      setCurrentPlayingTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentPlayingTrack(null);
  };

  if (tracks.length === 0) {
    return (
      <div className="empty-tracks">
        <div className="empty-icon">🎵</div>
        <p>No tracks uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="track-list">
      {/* Audio Player for currently playing track */}
      {currentPlayingTrack && (
        <div className="current-player">
          <AudioPlayer
            track={currentPlayingTrack}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
          />
        </div>
      )}
      
      {tracks.map((track) => {
        const isCurrentTrack = currentPlayingTrack?.id === track.id;
        
        return (
          <div key={track.id} className={`track-item ${isCurrentTrack ? 'current-track' : ''}`}>
            <div className="track-info">
              <h4 className="track-name">
                {isCurrentTrack && isPlaying && <span className="playing-indicator">♪ </span>}
                {track.name}
              </h4>
              <div className="track-meta">
                <span>Uploaded by: {track.uploaded_by}</span>
                <span>Date: {formatDate(track.timestamp)}</span>
                <span>IPFS: {track.ipfs_hash.substring(0, 20)}...</span>
              </div>
            </div>
            <div className="track-actions">
              <button 
                className={`btn-play ${isCurrentTrack && isPlaying ? 'playing' : ''}`}
                onClick={() => {
                  if (isCurrentTrack && isPlaying) {
                    handlePause();
                  } else {
                    handlePlay(track);
                  }
                }}
                title={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
              >
                {isCurrentTrack && isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button 
                className="btn-download"
                onClick={() => {
                  // Create download link for IPFS content
                  const ipfsUrl = `https://ipfs.io/ipfs/${track.ipfs_hash}`;
                  const link = document.createElement('a');
                  link.href = ipfsUrl;
                  link.download = track.name;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title="Download track"
              >
                📥 Download
              </button>
              <button 
                className="btn-danger btn-small"
                onClick={() => onRemoveTrack(track.id)}
                title="Remove track"
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
