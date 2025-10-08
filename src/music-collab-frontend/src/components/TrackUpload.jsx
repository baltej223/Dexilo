import React, { useState, useEffect } from 'react';
import pinataService from '../services/pinataService';
import simplePinataService from '../services/simplePinataService';
import backendPinataService from '../services/backendPinataService';
import ErrorMessage from './ErrorMessage';
import './TrackUpload.css';

// Import debug utility for development
if (process.env.REACT_APP_DEBUG_IPFS === 'true') {
  import('../utils/debugPinata');
  import('../utils/testPinata').then(module => {
    module.testPinataIntegration()
      .then(() => console.log('🎉 Pinata integration test completed'))
      .catch(error => console.error('🚫 Pinata integration test failed:', error.message));
  });
}

const TrackUpload = ({ project, user, onSubmit, onCancel, loading }) => {
  const [trackData, setTrackData] = useState({
    name: '',
    uploadedBy: '',
    ipfsHash: '',
    fileSize: 0,
    duration: 0,
    format: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Auto-fill user information
  useEffect(() => {
    if (user && !trackData.uploadedBy) {
      setTrackData(prev => ({
        ...prev,
        uploadedBy: user.principal || user.name || 'Anonymous User'
      }));
    }
  }, [user, trackData.uploadedBy]);

  const handleChange = (e) => {
    setTrackData({
      ...trackData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Validate file first
      pinataService.validateAudioFile(file);
      
      // Extract audio metadata
      const audioMetadata = await extractAudioMetadata(file);
      
      // Update track data with file info
      setTrackData(prev => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""), // Remove extension if name not set
        fileSize: file.size,
        duration: audioMetadata.duration || 0,
        format: file.type
      }));

      // Start upload to Pinata
      setIsUploading(true);
      
      const uploadMetadata = {
        name: trackData.name || file.name,
        uploadedBy: trackData.uploadedBy,
        projectId: project?.id?.toString(),
        customData: {
          duration: audioMetadata.duration,
          sampleRate: audioMetadata.sampleRate,
          channels: audioMetadata.channels
        },
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      };

      let result;
      
      // Strategy 1: Try backend proxy first (bypasses CSP, gets real IPFS hash)
      try {
        console.log('🔄 Attempting backend proxy upload...');
        result = await backendPinataService.uploadFile(file, uploadMetadata);
        
        if (window.showToast) {
          window.showToast(
            `✅ File uploaded to IPFS via backend: ${result.ipfsHash}`, 
            'success'
          );
        }
      } catch (backendError) {
        console.log('❌ Backend proxy failed, trying direct Pinata...', backendError.message);
        
        // Strategy 2: Try direct Pinata upload
        try {
          console.log('� Attempting direct Pinata upload...');
          result = await simplePinataService.uploadFileSimple(file, uploadMetadata);
          
          if (window.showToast) {
            window.showToast(
              `✅ File uploaded to IPFS directly: ${result.ipfsHash}`, 
              'success'
            );
          }
        } catch (directError) {
          console.log('❌ Direct upload failed, trying advanced method...', directError.message);
          
          // Strategy 3: Advanced Pinata method
          try {
            result = await pinataService.uploadFileWithRetry(file, uploadMetadata, 1);
            
            if (window.showToast) {
              window.showToast(
                `✅ File uploaded to IPFS (advanced): ${result.ipfsHash}`, 
                'success'
              );
            }
          } catch (advancedError) {
            console.log('❌ All IPFS methods failed, using local storage...', advancedError.message);
            
            // Strategy 4: Local storage fallback (last resort)
            try {
              result = await simplePinataService.uploadFileLocal(file, uploadMetadata);
              
              if (window.showToast) {
                window.showToast(
                  '⚠️ IPFS unavailable. File stored locally for development only.', 
                  'warning'
                );
              }
            } catch (localError) {
              if (localError.message.includes('quota') || localError.message.includes('QuotaExceededError')) {
                throw new Error('File too large for browser storage. Please use a smaller file (max ~5MB for local mode) or configure valid Pinata API keys for real IPFS upload.');
              }
              throw new Error('Upload failed completely: ' + localError.message);
            }
          }
        }
      }
      
      // Update track data with IPFS hash
      setTrackData(prev => ({
        ...prev,
        ipfsHash: result.ipfsHash
      }));

      // Show success toast
      if (window.showToast) {
        window.showToast(
          `📤 Audio file "${file.name}" uploaded to IPFS successfully!`, 
          'upload'
        );
      }

      // Verify upload
      console.log('🔍 Verifying upload...');
      const isVerified = await pinataService.verifyFile(result.ipfsHash);
      if (!isVerified) {
        console.warn('⚠️ Upload verification failed, but file may still be accessible');
        // Don't throw error, as verification might fail due to propagation delay
      } else {
        console.log('✅ Upload verified successfully');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message);
      setTrackData(prev => ({
        ...prev,
        ipfsHash: ''
      }));
      
      if (window.showToast) {
        window.showToast(`Upload failed: ${error.message}`, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Extract audio metadata (duration, sample rate, etc.)
  const extractAudioMetadata = (file) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const metadata = {
          duration: audio.duration,
          // Note: More detailed metadata would require additional libraries
          sampleRate: null,
          channels: null
        };
        URL.revokeObjectURL(url);
        resolve(metadata);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve({ duration: 0, sampleRate: null, channels: null });
      });

      audio.src = url;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackData.name && trackData.uploadedBy && trackData.ipfsHash && !isUploading) {
      onSubmit({
        ...trackData,
        timestamp: Date.now()
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="track-upload">
      <div className="upload-header">
        <h4>Upload New Track</h4>
        {project && (
          <p className="project-info">
            Adding track to: <strong>{project.title}</strong>
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="trackName">Track Name *</label>
          <input
            type="text"
            id="trackName"
            name="name"
            value={trackData.name}
            onChange={handleChange}
            placeholder="Enter track name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="uploadedBy">Uploaded By *</label>
          <input
            type="text"
            id="uploadedBy"
            name="uploadedBy"
            value={trackData.uploadedBy}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="audioFile">Audio File *</label>
          <input
            type="file"
            id="audioFile"
            accept="audio/*"
            onChange={handleFileChange}
            required
            disabled={isUploading}
          />
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                Uploading to IPFS... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <ErrorMessage 
              error={uploadError}
              onRetry={() => selectedFile && handleFileUpload(selectedFile)}
              onFallback={() => selectedFile && handleFileUpload(selectedFile, true)}
            />
          )}

          {/* File Info */}
          {selectedFile && !uploadError && (
            <div className="file-info">
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {formatFileSize(trackData.fileSize)}</p>
              {trackData.duration > 0 && (
                <p><strong>Duration:</strong> {formatDuration(trackData.duration)}</p>
              )}
              {trackData.format && (
                <p><strong>Format:</strong> {trackData.format}</p>
              )}
            </div>
          )}

          {/* IPFS Hash Display */}
          {trackData.ipfsHash && (
            <div className="ipfs-info">
              <p className="ipfs-hash">
                <strong>IPFS Hash:</strong> 
                <code>{trackData.ipfsHash}</code>
                <button 
                  type="button" 
                  className="btn-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(trackData.ipfsHash);
                    if (window.showToast) {
                      window.showToast('IPFS hash copied to clipboard!', 'info');
                    }
                  }}
                  title="Copy IPFS hash"
                >
                  📋
                </button>
              </p>
              <p className="ipfs-url">
                <strong>Gateway URL:</strong>
                <a 
                  href={pinataService.getFileUrl(trackData.ipfsHash)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ipfs-link"
                >
                  View on IPFS
                </a>
              </p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isUploading}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={
              loading || 
              isUploading || 
              !trackData.name || 
              !trackData.uploadedBy || 
              !trackData.ipfsHash ||
              uploadError
            }
          >
            {loading ? 'Adding Track...' : isUploading ? 'Uploading...' : 'Add Track to Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackUpload;
