// Backend proxy service for uploading to Pinata via IC backend
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/music-collab-backend';

class BackendPinataService {
  constructor() {
    this.agent = new HttpAgent({
      host: process.env.DFX_NETWORK === 'local' ? 'http://localhost:4943' : 'https://ic0.app',
    });

    // Only fetch root key when in development
    if (process.env.DFX_NETWORK === 'local') {
      this.agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      });
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: process.env.CANISTER_ID_MUSIC_COLLAB_BACKEND,
    });
  }

  /**
   * Upload file to Pinata via backend proxy
   */
  async uploadFile(file, metadata = {}) {
    try {
      console.log('📤 Uploading via backend proxy...', file.name);

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const fileData = Array.from(new Uint8Array(arrayBuffer));

      const uploadRequest = {
        file_data: fileData,
        file_name: file.name,
        content_type: file.type,
        api_key: process.env.REACT_APP_PINATA_API_KEY,
        secret_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
      };

      const response = await this.actor.upload_to_pinata(uploadRequest);

      if (response.success) {
        console.log('✅ Backend upload successful:', response.ipfs_hash);
        return {
          ipfsHash: response.ipfs_hash,
          pinSize: Number(response.pin_size),
          timestamp: Date.now(),
          isBackendUpload: true,
        };
      } else {
        throw new Error(response.error || 'Backend upload failed');
      }
    } catch (error) {
      console.error('❌ Backend upload failed:', error);
      throw error;
    }
  }

  /**
   * Validate audio file before upload
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

  /**
   * Get file URL from IPFS hash
   */
  getFileUrl(ipfsHash, gateway = 'pinata') {
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
}

export const backendPinataService = new BackendPinataService();
export default backendPinataService;
