import axios from 'axios';

class PinataService {
  constructor() {
    // These should be moved to environment variables in production
    this.pinataApiKey = process.env.REACT_APP_PINATA_API_KEY || 'your_pinata_api_key';
    this.pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY || 'your_pinata_secret_key';
    this.pinataBaseUrl = 'https://api.pinata.cloud';
    
    // Configure axios defaults
    this.api = axios.create({
      baseURL: this.pinataBaseUrl,
      timeout: 30000, // 30 second timeout
      headers: {
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretApiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for debugging
    this.api.interceptors.request.use(
      (config) => {
        if (process.env.REACT_APP_DEBUG_IPFS === 'true') {
          console.log('🚀 Pinata Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for debugging
    this.api.interceptors.response.use(
      (response) => {
        if (process.env.REACT_APP_DEBUG_IPFS === 'true') {
          console.log('✅ Pinata Response:', response.status, response.data);
        }
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload with retry mechanism
   */
  async uploadFileWithRetry(file, metadata = {}, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`🔄 Upload attempt ${attempt}/${maxRetries + 1}`);
        
        if (attempt > 1) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await this.uploadFile(file, metadata);
      } catch (error) {
        lastError = error;
        console.log(`❌ Attempt ${attempt} failed:`, error.message);
        
        // Don't retry on certain errors
        if (error.message.includes('Invalid API credentials') || 
            error.message.includes('File too large') ||
            error.message.includes('Unsupported')) {
          break;
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Alternative upload method using fetch instead of axios
   */
  async uploadFileAlternative(file, metadata = {}) {
    try {
      console.log('🔄 Trying alternative upload method...');
      
      this.validateAudioFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: {
          type: 'audio',
          uploadedBy: metadata.uploadedBy || 'unknown',
          projectId: metadata.projectId || '',
          originalName: file.name,
          size: file.size.toString(),
          uploadTimestamp: new Date().toISOString(),
          ...metadata.customData
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1
      });
      formData.append('pinataOptions', pinataOptions);

      const response = await fetch(`${this.pinataBaseUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretApiKey,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Alternative upload successful:', data);

      return {
        ipfsHash: data.IpfsHash,
        pinSize: data.PinSize,
        timestamp: data.Timestamp,
        isDuplicate: data.isDuplicate || false
      };
    } catch (error) {
      console.error('❌ Alternative upload failed:', error);
      throw new Error(`Alternative upload failed: ${error.message}`);
    }
  }
  async testAuthentication() {
    try {
      const response = await this.api.get('/data/testAuthentication');
      return response.data;
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      throw new Error('Failed to authenticate with Pinata');
    }
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file, metadata = {}) {
    try {
      console.log('📤 Starting Pinata upload...', file.name);
      
      // Validate file before upload
      this.validateAudioFile(file);

      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: {
          type: 'audio',
          uploadedBy: metadata.uploadedBy || 'unknown',
          projectId: metadata.projectId || '',
          originalName: file.name,
          size: file.size.toString(),
          uploadTimestamp: new Date().toISOString(),
          ...metadata.customData
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      // Pin options
      const pinataOptions = JSON.stringify({
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 1
            },
            {
              id: 'NYC1',
              desiredReplicationCount: 1
            }
          ]
        }
      });
      formData.append('pinataOptions', pinataOptions);

      console.log('🔄 Uploading to Pinata...');
      
      const response = await this.api.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minute timeout for uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Upload progress: ${percentCompleted}%`);
          // Call progress callback if provided
          if (metadata.onProgress) {
            metadata.onProgress(percentCompleted);
          }
        },
      });

      console.log('✅ Upload successful:', response.data);

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        isDuplicate: response.data.isDuplicate || false
      };
    } catch (error) {
      console.error('❌ Pinata upload failed:', error);
      
      // Enhanced error handling
      let errorMessage = 'Upload failed';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Upload timeout - please try again with a smaller file';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Network error - please check your internet connection and try again';
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'Invalid API credentials - please check your Pinata API keys';
            break;
          case 402:
            errorMessage = 'Pinata account limit exceeded - please upgrade your plan';
            break;
          case 413:
            errorMessage = 'File too large for your Pinata plan';
            break;
          case 429:
            errorMessage = 'Too many requests - please wait and try again';
            break;
          default:
            errorMessage = data?.error || `Upload failed with status ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from Pinata servers - please try again later';
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Validate audio file before upload
   */
  validateAudioFile(file) {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = [
      'audio/mpeg',     // MP3
      'audio/wav',      // WAV
      'audio/mp4',      // M4A
      'audio/x-m4a',    // M4A alternative
      'audio/flac',     // FLAC
      'audio/ogg',      // OGG
      'audio/webm',     // WebM audio
    ];

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB`);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Unsupported audio format: ${file.type}. Supported formats: MP3, WAV, M4A, FLAC, OGG`);
    }

    // Additional file name validation
    if (file.name.length > 255) {
      throw new Error('File name too long (maximum 255 characters)');
    }
  }

  /**
   * Get file URL from IPFS hash
   */
  getFileUrl(ipfsHash, gateway = 'pinata') {
    const gateways = {
      pinata: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      ipfs: `https://ipfs.io/ipfs/${ipfsHash}`,
      cloudflare: `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
      dweb: `https://dweb.link/ipfs/${ipfsHash}`
    };

    return gateways[gateway] || gateways.pinata;
  }

  /**
   * Get multiple gateway URLs for redundancy
   */
  getMultipleGatewayUrls(ipfsHash) {
    return [
      this.getFileUrl(ipfsHash, 'pinata'),
      this.getFileUrl(ipfsHash, 'ipfs'),
      this.getFileUrl(ipfsHash, 'cloudflare'),
      this.getFileUrl(ipfsHash, 'dweb')
    ];
  }

  /**
   * Verify file exists on IPFS
   */
  async verifyFile(ipfsHash) {
    try {
      // Skip verification for local hashes only
      if (ipfsHash.startsWith('QmLocal')) {
        console.log('🔧 Skipping verification for local hash:', ipfsHash);
        return true; // Always return true for local hashes
      }
      
      const url = this.getFileUrl(ipfsHash);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('File verification failed:', error);
      return false;
    }
  }

  /**
   * Get file metadata from Pinata
   */
  async getFileMetadata(ipfsHash) {
    try {
      const response = await this.api.get(`/data/pinList?hashContains=${ipfsHash}`);
      const pins = response.data.rows;
      return pins.length > 0 ? pins[0] : null;
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      return null;
    }
  }

  /**
   * Unpin file from Pinata (delete)
   */
  async unpinFile(ipfsHash) {
    try {
      await this.api.delete(`/pinning/unpin/${ipfsHash}`);
      return true;
    } catch (error) {
      console.error('Failed to unpin file:', error);
      return false;
    }
  }

  /**
   * Get account usage statistics
   */
  async getUsageStats() {
    try {
      const response = await this.api.get('/data/userPinnedDataTotal');
      return response.data;
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  }
}

// Create singleton instance
export const pinataService = new PinataService();
export default pinataService;
