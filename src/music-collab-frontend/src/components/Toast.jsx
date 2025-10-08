import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClass = () => {
    const baseClass = 'toast-notification';
    switch (type) {
      case 'waveform':
        return `${baseClass} waveform-success`;
      case 'mint':
        return `${baseClass} mint-success`;
      case 'upload':
        return `${baseClass} upload-success`;
      case 'creation':
        return `${baseClass} creation-success`;
      case 'error':
        return `${baseClass} error-notification`;
      case 'warning':
        return `${baseClass} warning-notification`;
      default:
        return `${baseClass} success-notification`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'waveform':
        return '🌊';
      case 'mint':
        return '💎';
      case 'upload':
        return '📤';
      case 'creation':
        return '🎵';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '✅';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getToastClass()} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
