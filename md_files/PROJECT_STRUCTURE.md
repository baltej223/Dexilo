# 🏗️ Dexilo - Project Structure

## Overview

This document provides a comprehensive overview of the Dexilo project structure, explaining the organization, architecture, and key components of the decentralized music collaboration platform.

## 📁 Root Directory Structure

```
music-collab/
├── 📄 README.md                    # Main project documentation
├── 📄 FEATURES.md                  # Detailed feature documentation
├── 📄 PROJECT_STRUCTURE.md         # This file - project architecture
├── 📄 package.json                 # Workspace configuration and scripts
├── 📄 dfx.json                     # Internet Computer configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 canister_ids.json            # Deployed canister identifiers
├── 📁 src/                         # Source code directory
│   ├── 📁 music-collab-backend/    # Rust backend canister
│   └── 📁 music-collab-frontend/   # React frontend application
└── 📁 target/                      # Rust build artifacts
```

## 🦀 Backend Structure (`src/music-collab-backend/`)

```
music-collab-backend/
├── 📄 Cargo.toml                   # Rust dependencies and metadata
├── 📄 music-collab-backend.did     # Candid interface definition
└── 📁 src/
    └── 📄 lib.rs                   # Main backend logic and API
```

### Backend Architecture

#### Core Components

1. **Data Models** (`lib.rs`)
   - `Project`: Music project structure with metadata
   - `NFT`: Non-fungible token representation
   - `User`: User account information
   - `Collaboration`: Collaboration session data

2. **API Functions** (`lib.rs`)
   ```rust
   // Project Management
   create_project(title, description, owner) -> ProjectId
   get_project(id) -> Option<Project>
   list_projects() -> Vec<Project>
   update_project(id, updates) -> Result<(), String>

   // NFT Operations
   mint_nft(name, description, image_url, creator, project_id, price) -> NFTId
   get_nft(id) -> Option<NFT>
   list_nfts() -> Vec<NFT>
   transfer_nft(id, to) -> Result<(), String>

   // User Management
   get_user_info() -> Option<User>
   update_user_profile(updates) -> Result<(), String>
   ```

3. **Storage Management**
   - Stable memory for persistent data
   - Thread-local storage for temporary data
   - Efficient serialization with Candid

#### Dependencies (Cargo.toml)
- `ic-cdk`: Internet Computer Development Kit
- `ic-cdk-macros`: Procedural macros for IC development
- `candid`: Interface description language
- `serde`: Serialization framework

## ⚛️ Frontend Structure (`src/music-collab-frontend/`)

```
music-collab-frontend/
├── 📄 package.json                 # Frontend dependencies and scripts
├── 📄 vite.config.js              # Vite build configuration
├── 📄 index.html                  # Entry HTML file
└── 📁 src/
    ├── 📄 App.jsx                 # Main application component
    ├── 📄 App.css                 # Global application styles
    ├── 📄 main.jsx                # Application entry point
    ├── 📁 components/             # React components
    ├── 📁 services/               # API and authentication services
    └── 📁 assets/                 # Static assets and media
```

### Frontend Architecture

#### Core Components (`src/components/`)

```
components/
├── 📄 Navigation.jsx              # Main navigation bar
├── 📄 Navigation.css
├── 📄 ProjectList.jsx             # Project listing and management
├── 📄 ProjectList.css
├── 📄 ProjectForm.jsx             # Project creation form
├── 📄 ProjectForm.css
├── 📄 ProjectDetail.jsx           # Individual project view
├── 📄 ProjectDetail.css
├── 📄 NFTMarketplace.jsx          # NFT marketplace interface
├── 📄 NFTMarketplace.css
├── 📄 NFTCard.jsx                 # Individual NFT display
├── 📄 NFTCard.css
├── 📄 MintNFTModal.jsx            # Basic NFT minting modal
├── 📄 MintNFTModal.css
├── 📄 WaveformNFTModal.jsx        # Advanced audio NFT minting
├── 📄 WaveformNFTModal.css
├── 📄 WaveformGenerator.jsx       # Waveform visualization engine
├── 📄 WaveformGenerator.css
└── 📄 CollaborationHub.jsx        # Real-time collaboration interface
    └── 📄 CollaborationHub.css
```

#### Component Hierarchy

```
App
├── Navigation
├── ProjectList
│   └── ProjectCard (implicit)
├── ProjectForm
├── ProjectDetail
│   └── CollaborationHub
├── NFTMarketplace
│   ├── NFTCard
│   ├── MintNFTModal
│   └── WaveformNFTModal
│       └── WaveformGenerator
└── Loading/Error States
```

#### Services Layer (`src/services/`)

```
services/
├── 📄 auth.js                     # Authentication service
├── 📄 api.js                      # Backend API communication
└── 📄 waveform.js                 # Waveform processing utilities
```

**Authentication Service (`auth.js`)**
- Internet Identity integration
- Session management
- Actor creation and management
- User state persistence

**API Service (`api.js`)**
- RESTful API wrapper
- Error handling and retry logic
- Data transformation utilities
- Caching mechanisms

## 🎨 Styling Architecture

### CSS Organization
- **Component-specific styles**: Each component has its own CSS file
- **Global styles**: App.css for shared styles and CSS variables
- **Responsive design**: Mobile-first approach with breakpoints
- **Modern CSS**: Flexbox, Grid, CSS Variables, and animations

### Design System
```css
:root {
  /* Color Palette */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --background-dark: #0f0f23;
  --surface-color: rgba(255, 255, 255, 0.1);
  
  /* Typography */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

## 🔧 Configuration Files

### Internet Computer Configuration (`dfx.json`)
```json
{
  "canisters": {
    "music-collab-backend": {
      "type": "rust",
      "package": "music-collab-backend"
    },
    "music-collab-frontend": {
      "type": "assets",
      "source": ["src/music-collab-frontend/dist/"]
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  }
}
```

### Frontend Build Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🎵 Waveform Visualization System

### Architecture Overview
The waveform system is built with a modular architecture supporting 20+ artistic styles:

```
WaveformGenerator
├── Audio Analysis
│   ├── FFT Processing
│   ├── Frequency Analysis
│   └── Amplitude Detection
├── Canvas Rendering
│   ├── 2D Context Management
│   ├── Animation Loop
│   └── Performance Optimization
└── Style Renderers
    ├── Artistic Styles (4)
    ├── Geometric Patterns (4)
    ├── Nature Themes (4)
    ├── Futuristic Styles (6)
    ├── Abstract Art (3)
    └── Retro Styles (3)
```

### Style Implementation Pattern
Each waveform style follows a consistent pattern:

```javascript
// Style registration
const styles = {
  'watercolor': {
    name: 'Watercolor',
    description: 'Soft, flowing watercolor effects',
    renderer: drawWatercolor
  }
  // ... other styles
}

// Rendering function
function drawWatercolor(canvas, audioData, colors) {
  const ctx = canvas.getContext('2d');
  // Style-specific rendering logic
  // - Data processing
  // - Visual effects
  // - Animation frames
}
```

## 📊 Data Flow Architecture

### Frontend Data Flow
```
User Interaction
    ↓
Component State Update
    ↓
Service Layer Call
    ↓
Backend API Request
    ↓
Canister Processing
    ↓
Response Data
    ↓
State Management
    ↓
UI Re-render
```

### State Management
- **React State**: Component-level state management
- **Props Drilling**: Parent-child data flow
- **Context API**: Global state (authentication)
- **Local Storage**: Session persistence

### Authentication Flow
```
User Login Request
    ↓
Internet Identity Auth
    ↓
Principal Generation
    ↓
Actor Creation
    ↓
Session Storage
    ↓
Authenticated State
```

## 🔄 Development Workflow

### Local Development Setup
1. **Environment Setup**
   ```bash
   npm install
   dfx start --background
   dfx deploy
   npm start
   ```

2. **Development Commands**
   ```bash
   # Frontend development
   npm start                    # Start dev server
   npm run build               # Build for production
   npm test                    # Run tests

   # Backend development  
   dfx deploy                  # Deploy canisters
   dfx generate               # Generate declarations
   dfx canister call <name> <method>  # Test canister methods
   ```

3. **File Watching**
   - Vite hot reload for frontend changes
   - Manual redeployment for backend changes
   - Automatic Candid interface regeneration

### Build Process
```
Source Code
    ↓
TypeScript Compilation (Frontend)
    ↓
Rust Compilation (Backend)
    ↓
Candid Interface Generation
    ↓
Asset Bundling
    ↓
Canister Deployment
    ↓
Frontend Serving
```

## 🚀 Deployment Architecture

### Local Deployment
- DFX local replica for development
- Hot reloading for frontend changes
- Local Internet Identity for testing

### Production Deployment
- Internet Computer mainnet
- CDN distribution for frontend assets
- Decentralized storage for media files

### Scalability Considerations
- Canister upgrade mechanisms
- Data migration strategies
- Load balancing across canisters
- Efficient memory management

## 📝 Code Standards

### Frontend Standards
- **React Best Practices**: Functional components, hooks
- **CSS Methodology**: BEM naming convention
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Organization**: External → Internal → Relative imports

### Backend Standards
- **Rust Conventions**: Standard Rust naming and structure
- **Error Handling**: Comprehensive Result types
- **Documentation**: Inline documentation for all public functions
- **Testing**: Unit tests for core functionality

### Git Workflow
- **Branch Naming**: `feature/`, `bugfix/`, `hotfix/` prefixes
- **Commit Messages**: Conventional commits format
- **Pull Requests**: Required for all changes
- **Code Review**: Mandatory review process

## 📚 Documentation Standards

### Code Documentation
- **JSDoc**: Function and component documentation
- **Rust Docs**: Comprehensive API documentation
- **README Files**: Component and service explanations
- **Type Definitions**: Strong typing throughout

### User Documentation
- **Feature Guides**: Step-by-step user guides
- **API Documentation**: Complete API reference
- **Troubleshooting**: Common issues and solutions
- **FAQ**: Frequently asked questions

---

*This document serves as the single source of truth for the project architecture and is updated regularly to reflect changes and improvements.*
