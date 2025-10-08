import React, { useState, useRef, useEffect } from 'react';
import pinataService from '../services/pinataService';
import simplePinataService from '../services/simplePinataService';
import './AudioPlayer.css';

const AudioPlayer = ({ track, isPlaying, onPlay, onPause, onStop, showWaveform = false }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const blobUrlRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Playback failed:', err);
        setError('Playback failed');
        onPause?.();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPause]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.(track);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
    onStop?.();
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Load audio URL when track changes
  useEffect(() => {
    if (track?.ipfs_hash) {
      loadAudioUrl();
    } else {
      setAudioUrl(null);
      setError(null);
    }

    // Cleanup blob URL on unmount or track change
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [track?.ipfs_hash]);

  const loadAudioUrl = async () => {
    if (!track?.ipfs_hash) return;
    
    setIsLoading(true);
    setError(null);
    
    // Cleanup previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    try {
      // Check if it's a local hash first
      if (track.ipfs_hash.startsWith('QmLocal')) {
        try {
          const localFile = await simplePinataService.getFile(track.ipfs_hash);
          if (localFile) {
            const blobUrl = URL.createObjectURL(localFile);
            blobUrlRef.current = blobUrl;
            setAudioUrl(blobUrl);
            setIsLoading(false);
            return;
          }
        } catch (localError) {
          console.error('Error loading local file:', localError);
        }
      }

      // Try IPFS gateway with timeout
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${track.ipfs_hash}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(ipfsUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setAudioUrl(ipfsUrl);
          setIsLoading(false);
          return;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.log('IPFS gateway not accessible, trying local storage...');
      }
      
      // Try local/IndexedDB storage as fallback
      try {
        const localFile = await simplePinataService.getFile(track.ipfs_hash);
        if (localFile) {
          const blobUrl = URL.createObjectURL(localFile);
          blobUrlRef.current = blobUrl;
          setAudioUrl(blobUrl);
          setIsLoading(false);
          return;
        }
      } catch (localError) {
        console.error('Error loading from local storage:', localError);
      }
      
      // If nothing works, set error
      throw new Error('Audio file not found in IPFS or local storage');
      
    } catch (error) {
      console.error('Error loading audio:', error);
      setError('Failed to load audio file');
      setIsLoading(false);
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onEnded={handleStop}
      />
      
      <div className="player-main">
        <div className="player-controls">
          <button
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            disabled={isLoading || error}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <span className="loading-spinner small">⏳</span>
            ) : error ? (
              <span className="error-icon">❌</span>
            ) : isPlaying ? (
              <span className="pause-icon">⏸️</span>
            ) : (
              <span className="play-icon">▶️</span>
            )}
          </button>
          
          <button
            className="stop-btn"
            onClick={handleStop}
            disabled={!isPlaying && currentTime === 0}
            title="Stop"
          >
            ⏹️
          </button>
        </div>

        <div className="player-info">
          <div className="track-name">{track?.name || 'Unknown Track'}</div>
          <div className="track-artist">by {track?.uploaded_by || 'Unknown Artist'}</div>
        </div>

        <div className="player-timeline">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="time-total">{formatTime(duration)}</span>
        </div>

        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      {error && (
        <div className="player-error">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
