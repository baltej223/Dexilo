// Simplified Pinata service without CORS issues
class SimplePinataService {
  constructor() {
    this.pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    this.pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;
    
    // Debug: Log environment variables (remove in production)
    if (process.env.REACT_APP_DEBUG_IPFS === 'true') {
      console.log('🔑 Environment Variables Check:');
      console.log('API Key loaded:', this.pinataApiKey ? '✅ Present' : '❌ Missing');
      console.log('Secret Key loaded:', this.pinataSecretApiKey ? '✅ Present' : '❌ Missing');
      console.log('API Key value:', this.pinataApiKey);
      console.log('Secret Key value:', this.pinataSecretApiKey ? '[REDACTED]' : 'undefined');
    }
    
    // Debug logging
    console.log('🔑 Pinata API Key loaded:', this.pinataApiKey ? `${this.pinataApiKey.slice(0, 8)}...` : 'NOT FOUND');
    console.log('🔑 Pinata Secret loaded:', this.pinataSecretApiKey ? `${this.pinataSecretApiKey.slice(0, 8)}...` : 'NOT FOUND');
    
    // Check if keys are valid
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      console.error('❌ Pinata API keys not found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
    }
  }

  /**
   * Upload file using form submission approach (bypasses CORS)
   */
  async uploadFileSimple(file, metadata = {}) {
    try {
      console.log('📤 Starting simple upload...', file.name);
      
      // Validate API keys before attempting upload
      if (!this.pinataApiKey || !this.pinataSecretApiKey) {
        throw new Error('Missing Pinata API credentials. Please check your environment variables.');
      }
      
      if (this.pinataApiKey === 'your_pinata_api_key' || this.pinataSecretApiKey === 'your_pinata_secret_key') {
        throw new Error('Invalid API credentials - placeholder values detected. Please configure real Pinata API keys.');
      }
      
      // Validate API keys first
      if (!this.pinataApiKey || !this.pinataSecretApiKey) {
        throw new Error('Invalid API credentials - Pinata API keys not configured properly');
      }
      
      // Create a hidden form for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Add minimal metadata
      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: {
          type: 'audio',
          originalName: file.name,
          uploadTimestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      // Simple upload without complex options
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretApiKey
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      return {
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp
      };
      
    } catch (error) {
      console.error('Simple upload failed:', error);
      throw error;
    }
  }

  /**
   * For development: create a simulated upload using IndexedDB for larger files
   */
  async uploadFileLocal(file, metadata = {}) {
    console.log('🔧 Using IndexedDB storage for development...');
    
    try {
      // Use IndexedDB for larger files instead of localStorage
      const hash = `QmLocal${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Store file in IndexedDB
      await this.storeFileInIndexedDB(hash, file, metadata);
      
      console.log('📁 File stored in IndexedDB with hash:', hash);
      
      return {
        ipfsHash: hash,
        pinSize: file.size,
        timestamp: Date.now(),
        isLocal: true
      };
      
    } catch (error) {
      console.error('IndexedDB storage failed:', error);
      throw new Error('Local storage failed - file is too large or storage quota exceeded');
    }
  }

  /**
   * Store file in IndexedDB for larger storage capacity
   */
  async storeFileInIndexedDB(hash, file, metadata) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicCollabStorage', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'hash' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        
        // Create a FileReader to convert file to ArrayBuffer
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const transaction = db.transaction(['audioFiles'], 'readwrite');
            const store = transaction.objectStore('audioFiles');
            
            const fileData = {
              hash: hash,
              name: file.name,
              size: file.size,
              type: file.type,
              arrayBuffer: e.target.result, // Store as ArrayBuffer
              metadata: metadata,
              timestamp: Date.now()
            };
            
            const addRequest = store.add(fileData);
            addRequest.onsuccess = () => {
              console.log('✅ File stored in IndexedDB successfully');
              resolve();
            };
            addRequest.onerror = (error) => {
              console.error('❌ IndexedDB add failed:', error);
              reject(new Error('Failed to store file in IndexedDB'));
            };
            
            transaction.onerror = (error) => {
              console.error('❌ IndexedDB transaction failed:', error);
              reject(new Error('IndexedDB transaction failed'));
            };
          } catch (error) {
            console.error('❌ IndexedDB operation failed:', error);
            reject(error);
          }
        };
        
        reader.onerror = (error) => {
          console.error('❌ FileReader failed:', error);
          reject(new Error('Failed to read file'));
        };
        
        // Convert file to ArrayBuffer
        reader.readAsArrayBuffer(file);
      };
    });
  }

  /**
   * Get file from IndexedDB
   */
  async getFileFromIndexedDB(hash) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicCollabStorage', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['audioFiles'], 'readonly');
        const store = transaction.objectStore('audioFiles');
        
        const getRequest = store.get(hash);
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result && result.arrayBuffer) {
            // Convert ArrayBuffer back to Blob for playback
            const blob = new Blob([result.arrayBuffer], { type: result.type });
            resolve({
              ...result,
              file: blob // Return as Blob instead of original File
            });
          } else {
            resolve(result);
          }
        };
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  /**
   * Get file object for playback
   */
  async getFile(ipfsHash) {
    // Check if it's a local hash
    if (ipfsHash.startsWith('QmLocal')) {
      try {
        // Try IndexedDB first
        const fileData = await this.getFileFromIndexedDB(ipfsHash);
        if (fileData && fileData.file) {
          return fileData.file;
        }
      } catch (error) {
        console.warn('Could not retrieve from IndexedDB:', error);
      }
      
      // If file not found in IndexedDB, return null
      return null;
    }
    
    // For real IPFS hashes, we can't return a file object directly
    // The caller should use the URL directly
    return null;
  }

  /**
   * Get file URL - handle both real IPFS and local storage
   */
  async getFileUrl(ipfsHash, gateway = 'pinata') {
    // Check if it's a local hash
    if (ipfsHash.startsWith('QmLocal')) {
      try {
        // Try IndexedDB first
        const fileData = await this.getFileFromIndexedDB(ipfsHash);
        if (fileData && fileData.file) {
          return URL.createObjectURL(fileData.file);
        }
      } catch (error) {
        console.warn('Could not retrieve from IndexedDB:', error);
      }
      
      // Fallback to localStorage
      const fileData = localStorage.getItem(`ipfs_${ipfsHash}`);
      if (fileData) {
        const parsed = JSON.parse(fileData);
        return parsed.data; // Return data URL for local files
      }
      
      // If file not found, return null
      return null;
    }
    
    // Check if it's a demo hash
    if (ipfsHash.startsWith('QmDemo')) {
      // Demo hashes are no longer supported
      return null;
    }
    
    // Real IPFS hash
    const gateways = {
      pinata: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      custom: process.env.REACT_APP_PINATA_GATEWAY_URL ? 
        `${process.env.REACT_APP_PINATA_GATEWAY_URL}/ipfs/${ipfsHash}` : 
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      ipfs: `https://ipfs.io/ipfs/${ipfsHash}`,
      cloudflare: `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`
    };
    
    return gateways[gateway] || gateways.custom;
  }

  /**
   * Validate audio file
   */
  validateAudioFile(file) {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = [
      'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 
      'audio/flac', 'audio/ogg', 'audio/webm'
    ];

    if (!file) throw new Error('No file provided');
    if (file.size > MAX_SIZE) throw new Error(`File too large (max 50MB)`);
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Unsupported format: ${file.type}`);
    }
  }
}

export const simplePinataService = new SimplePinataService();
export default simplePinataService;
