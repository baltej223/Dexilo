import React, { useState } from 'react';
import simplePinataService from '../services/simplePinataService';

const PinataDebugPanel = () => {
  const [status, setStatus] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const testConnection = async () => {
    setStatus('🔄 Testing Pinata connection...');
    
    try {
      // Test with a small text file
      const testFile = new File(['Hello IPFS!'], 'test.txt', { type: 'text/plain' });
      
      // Try simple upload
      const result = await simplePinataService.uploadFileSimple(testFile, {
        name: 'Connection Test'
      });
      
      setStatus(`✅ Success! IPFS Hash: ${result.ipfsHash}`);
      
    } catch (error) {
      setStatus(`❌ Failed: ${error.message}`);
    }
  };

  const testAudioUpload = async () => {
    setStatus('🔄 Testing audio upload...');
    
    // Create a test file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const result = await simplePinataService.uploadFileSimple(file, {
            name: file.name
          });
          setStatus(`✅ Audio upload success! Hash: ${result.ipfsHash}`);
        } catch (error) {
          setStatus(`❌ Audio upload failed: ${error.message}`);
        }
      }
    };
    input.click();
  };

  if (!process.env.REACT_APP_DEBUG_IPFS) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <button onClick={() => setIsVisible(!isVisible)}>
        🔧 Debug Panel
      </button>
      
      {isVisible && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={testConnection} style={{ margin: '5px', padding: '5px' }}>
            Test Connection
          </button>
          <button onClick={testAudioUpload} style={{ margin: '5px', padding: '5px' }}>
            Test Audio Upload
          </button>
          
          {status && (
            <div style={{ 
              marginTop: '10px', 
              padding: '5px', 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              wordBreak: 'break-all'
            }}>
              {status}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PinataDebugPanel;
