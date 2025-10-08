import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, onRetry, onFallback }) => {
  const getErrorInfo = (errorMessage) => {
    const message = errorMessage?.toLowerCase() || '';
    
    if (message.includes('content security policy') || message.includes('csp')) {
      return {
        type: 'csp',
        title: '🔒 Content Security Policy Block',
        explanation: 'The browser is blocking the connection due to security policies.',
        solutions: [
          'Using local storage as fallback for development',
          'In production, configure a backend proxy for IPFS uploads',
          'Contact the developer to update CSP settings'
        ]
      };
    }
    
    if (message.includes('quota') || message.includes('storage')) {
      return {
        type: 'storage',
        title: '💾 Storage Quota Exceeded',
        explanation: 'Your browser storage is full and cannot store more audio files.',
        solutions: [
          'Clear browser data for this site',
          'Use smaller audio files (under 5MB recommended)',
          'Use Incognito/Private mode for testing'
        ]
      };
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'network',
        title: '🌐 Network Connection Error',
        explanation: 'Cannot reach the IPFS service due to network issues.',
        solutions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Use local storage mode for development'
        ]
      };
    }
    
    if (message.includes('cors')) {
      return {
        type: 'cors',
        title: '🚫 CORS Policy Block',
        explanation: 'Cross-origin requests are blocked by browser security.',
        solutions: [
          'Using local storage fallback',
          'Configure CORS on the server',
          'Use a backend proxy in production'
        ]
      };
    }
    
    return {
      type: 'generic',
      title: '❌ Upload Error',
      explanation: 'An unexpected error occurred during the upload process.',
      solutions: [
        'Try uploading a different file',
        'Check file format and size',
        'Refresh the page and try again'
      ]
    };
  };

  const errorInfo = getErrorInfo(error);

  return (
    <div className={`error-message error-${errorInfo.type}`}>
      <div className="error-header">
        <h4>{errorInfo.title}</h4>
        <button className="error-close" onClick={() => window.location.reload()}>
          ✕
        </button>
      </div>
      
      <div className="error-body">
        <p className="error-explanation">{errorInfo.explanation}</p>
        
        <div className="error-solutions">
          <h5>Solutions:</h5>
          <ul>
            {errorInfo.solutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ul>
        </div>
        
        <div className="error-details">
          <details>
            <summary>Technical Details</summary>
            <pre>{error}</pre>
          </details>
        </div>
      </div>
      
      <div className="error-actions">
        {onRetry && (
          <button className="btn-retry" onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
        {onFallback && (
          <button className="btn-fallback" onClick={onFallback}>
            💾 Use Local Storage
          </button>
        )}
        <button className="btn-refresh" onClick={() => window.location.reload()}>
          🔃 Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
