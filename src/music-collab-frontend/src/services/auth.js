import { AuthClient } from '@dfinity/auth-client';
import { createActor, music_collab_backend } from '../../../declarations/music-collab-backend';

const MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000); // 7 days in nanoseconds

// Environment variables with fallbacks
const DFX_NETWORK = import.meta.env.DFX_NETWORK || 'local';
const LOCAL_HOST = 'http://localhost:4943';
const BACKEND_CANISTER_ID = import.meta.env.CANISTER_ID_MUSIC_COLLAB_BACKEND || 'u6s2n-gx777-77774-qaaba-cai';
const INTERNET_IDENTITY_CANISTER_ID = import.meta.env.CANISTER_ID_INTERNET_IDENTITY || 'uxrrr-q7777-77774-qaaaq-cai';

// Debug logging
console.log('Auth Service Environment:', {
  DFX_NETWORK,
  LOCAL_HOST,
  BACKEND_CANISTER_ID,
  INTERNET_IDENTITY_CANISTER_ID,
  allEnvVars: import.meta.env
});

class AuthService {
  constructor() {
    this.authClient = null;
    this.actor = null;
    this.identity = null;
    this.principal = null;
  }

  async init() {
    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });

      if (await this.authClient.isAuthenticated()) {
        this.identity = this.authClient.getIdentity();
        this.principal = this.identity.getPrincipal();
        await this.createActor();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing auth client:', error);
      return false;
    }
  }

  async createActor() {
    try {
      if (!this.identity) {
        throw new Error('No identity available');
      }

      this.actor = createActor(BACKEND_CANISTER_ID, {
        agentOptions: {
          identity: this.identity,
          host: DFX_NETWORK === 'local' ? LOCAL_HOST : 'https://ic0.app'
        }
      });
    } catch (error) {
      console.error('Error creating actor:', error);
      // Fallback to default actor
      this.actor = music_collab_backend;
    }
  }

  async login() {
    try {
      if (!this.authClient) {
        await this.init();
      }

      const identityProviderUrl = DFX_NETWORK === 'local' 
        ? `http://${INTERNET_IDENTITY_CANISTER_ID}.localhost:4943/`
        : 'https://identity.ic0.app';
      
      console.log('Login attempt with:', {
        DFX_NETWORK,
        LOCAL_HOST,
        INTERNET_IDENTITY_CANISTER_ID,
        identityProviderUrl,
        fullUrl: identityProviderUrl
      });

      return new Promise((resolve, reject) => {
        this.authClient.login({
          identityProvider: identityProviderUrl,
          maxTimeToLive: MAX_TIME_TO_LIVE,
          windowOpenerFeatures: 
            `left=${window.screen.width / 2 - 525 / 2}, ` +
            `top=${window.screen.height / 2 - 705 / 2},` +
            `toolbar=0,location=0,menubar=0,width=525,height=705`,
          onSuccess: async () => {
            try {
              this.identity = this.authClient.getIdentity();
              this.principal = this.identity.getPrincipal();
              await this.createActor();
              
              const userInfo = {
                principal: this.principal.toString(),
                isAnonymous: this.principal.isAnonymous()
              };
              
              resolve(userInfo);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            console.error('Internet Identity login error:', error);
            reject(new Error(`Authentication failed: ${error.message || error}`));
          }
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.authClient) {
        await this.authClient.logout();
      }
      this.identity = null;
      this.principal = null;
      this.actor = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return this.authClient && this.authClient.isAuthenticated();
  }

  getUserInfo() {
    if (!this.principal) {
      return null;
    }
    
    return {
      principal: this.principal.toString(),
      isAnonymous: this.principal.isAnonymous()
    };
  }

  getActor() {
    return this.actor || music_collab_backend;
  }

  getPrincipal() {
    return this.principal;
  }
}

// Create a singleton instance
export const authService = new AuthService();
