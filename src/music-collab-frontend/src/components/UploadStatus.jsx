import React from 'react';
import './UploadStatus.css';

const UploadStatus = ({ 
  isUploading, 
  uploadProgress, 
  error, 
  success, 
  ipfsHash,
  onRetry,
  onForceLocal 
}) => {
  const getStatusIcon = () => {
    if (isUploading) return '⏳';
    if (error) return '❌';
    if (success) return '✅';
    return '📤';
  };

  const getStatusMessage = () => {
    if (isUploading) {
      return `Uploading... ${uploadProgress}%`;
    }
    if (error) {
      if (error.includes('401') || error.includes('Invalid API')) {
        return 'Invalid Pinata API keys - using local storage instead';
      }
      if (error.includes('quota') || error.includes('QuotaExceededError')) {
        return 'Browser storage limit exceeded - please use a smaller file';
      }
      if (error.includes('CSP') || error.includes('Content Security Policy')) {
        return 'Security policy blocking upload - using local storage';
      }
      return error;
    }
    if (success && ipfsHash) {
      if (ipfsHash.startsWith('QmLocal')) {
        return 'File stored locally for development (not on IPFS)';
      }
      return 'File uploaded to IPFS successfully!';
    }
    return 'Ready to upload';
  };

  const showRetryButton = error && !error.includes('quota') && !error.includes('QuotaExceededError');
  const showLocalButton = error && (error.includes('401') || error.includes('CSP'));

  return (
    <div className={`upload-status ${error ? 'error' : success ? 'success' : ''}`}>
      <div className="status-content">
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-message">{getStatusMessage()}</span>
      </div>
      
      {isUploading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      
      {showRetryButton && onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          🔄 Retry IPFS Upload
        </button>
      )}
      
      {showLocalButton && onForceLocal && (
        <button className="local-btn" onClick={onForceLocal}>
          💾 Use Local Storage
        </button>
      )}
      
      {success && ipfsHash && (
        <div className="upload-details">
          <small>
            Hash: <code>{ipfsHash}</code>
            {ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('QmLocal') && (
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ipfs-link"
              >
                🔗 View on IPFS
              </a>
            )}
          </small>
        </div>
      )}
    </div>
  );
};

export default UploadStatus;
