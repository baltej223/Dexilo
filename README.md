[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Internet%20Computer-blue)](https://internetcomputer.org/)
[![Frontend](https://img.shields.io/badge/frontend-React%2019-61dafb)](https://react.dev/)
[![Backend](https://img.shields.io/badge/backend-Rust-orange)](https://www.rust-lang.org/)
<br />
<div align="center">
  <a href="#">
    <img src="src/music-collab-frontend/public/dexilogo.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Dexilo</h1>

  <p align="center">
  </p>
</div>

Dexilo is a decentralized B2B SaaS platform on ICP, empowering music platforms with NFT-powered collaboration, certified digital ownership, and supporting sync licensing services.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Business Model](#business-model)
- [Technical Architecture](#technical-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Legal Framework](#legal-framework)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Dexilo serves as a B2B service provider for music platforms (e.g., DistroKid, BandLab, even YouTube) to facilitate NFT-powered decentralized collaboration, digital ownership certification, and comprehensive music monetization. Our platform focuses on innovative NFT creation and marketplace services as the core offering, with supporting sync licensing and visualization features.

### Core Identity

We provide music platforms with:
- **NFT Marketplace & Minting**: Comprehensive NFT creation, trading, and royalty management system
- **Dexilo Certification**: Industry-standard on-chain provenance for digital music ownership
- **Professional UI**: Clean, minimalistic design with vibrant waveform visualizations
- **Sync Licensing**: Supporting automated music licensing services

### Problems We Solve

- Provide legally compliant NFT creation and marketplace services with clear royalty rights (not copyright transfers)
- Enable seamless digital ownership and provenance tracking for music assets
- Offer professional-grade collaboration tools with blockchain transparency
- Support additional revenue streams through automated sync licensing

## Key Features

### NFT Marketplace & Digital Ownership

#### Core NFT Services
- **Contribution NFTs**: Mint tokens representing collaboration contributions with royalty rights
- **Trading Platform**: Discover and trade music NFTs with built-in royalty management
- **Automated Distribution**: Smart contracts handle royalty payments without manual intervention
- **Dexilo Certification**: Industry-standard on-chain provenance certificates

#### Supporting RWA Services
- **Sync Licensing**: Facilitates licensing of music for film, TV, and commercial media
- **Smart Contract Royalties**: Automatic royalty distribution for licensing agreements
- **Transparent Agreements**: Immutable audit trails for all licensing transactions

### Waveform Visualizations
Advanced 2D visualizations powered by Anime.js:
- **Watercolor**: Soft, flowing effects with gentle color bleeding
- **Ink Brush**: Traditional ink painting aesthetics with black strokes
- **Mandala**: Intricate circular patterns with radial symmetry

### Authentication & Privacy
- **Internet Identity**: Secure, one-click Web3 login
- **Pseudonymous Addresses**: Privacy-first approach with wallet-based identity
- **No PII On-Chain**: Personal data remains with client platforms

### Analytics Dashboard
- NFT marketplace performance and trading metrics
- Project statistics and collaboration analytics
- Digital ownership and provenance tracking
- Supporting sync licensing revenue insights

## Business Model

### 3-Pillar Revenue Engine

#### 1. SaaS Licensing
- Annual fees based on platform user base
- Predictable revenue stream for operational sustainability
- Scalable pricing from small platforms to enterprise clients

#### 2. Value-Added Reseller
- 20% revenue share from NFT marketplace transactions and secondary sales
- Additional revenue from sync licensing services
- Aligned incentives with platform success
- Creates profit centers for client platforms

#### 3. Dexilo Certification
- On-chain provenance certificates for platform-created content
- Industry-standard certification creates competitive moat
- Network effects increase platform lock-in

### Target Clients
Music platforms seeking to offer:
- Comprehensive NFT marketplace and minting services
- Certified digital ownership and provenance tracking
- Collaborative creation tools with blockchain integration
- Supporting monetization through sync licensing

## Technical Architecture

### Platform
Built on **Internet Computer Protocol (ICP)** for:
- Gas-free transactions via reverse gas model
- Scalable smart contract deployment
- Native Web3 integration

### Frontend Stack
- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS with Pinata-inspired design (teal/purple palette)
- **Animations**: Anime.js for waveform visualizations
- **Features**: Responsive design, WCAG 2.1 AA accessibility, lazy loading

### Backend Stack
- **Language**: Rust
- **Framework**: ic-cdk, ic-cdk-macros
- **Storage**: Stable memory for persistent data
- **APIs**: Candid interfaces for type-safe communication

### Blockchain Infrastructure
- **Smart Contracts**: NFT management, certification, and supporting sync licensing
- **Storage**: Pinata IPFS for audio and visualization assets
- **Authentication**: Internet Identity integration

### Key Canisters
1. **NFT Minting & Marketplace**: Creates, manages, and facilitates trading of Contribution NFTs
2. **Dexilo Certification**: Issues industry-standard on-chain provenance certificates
3. **Project Management**: Handles collaboration and version control
4. **Sync Licensing**: Supporting service for licensing agreements and automated royalties

## Prerequisites

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **DFX SDK**: Latest version for ICP development
- **Git**: For repository management
- **Rust**: For backend canister development

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/baltej223/tantra.git
cd tantra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install DFX SDK
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

### 4. Start Local ICP Network
```bash
dfx start --background
```

### 5. Deploy Canisters
```bash
dfx deploy
```

### 6. Start Frontend Development Server
```bash
npm start
```

## Development

### Building the Project
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### Backend Development
Navigate to the backend directory and use Cargo for Rust development:
```bash
cd src/music-collab-backend
cargo test
cargo check
```

### Frontend Development
The frontend is located in `src/music-collab-frontend/` and uses Vite for fast development:
```bash
cd src/music-collab-frontend
npm run dev
```

## Project Structure

```
├── dfx.json                    # DFX configuration
├── package.json               # Workspace configuration
├── src/
│   ├── music-collab-backend/  # Rust backend canisters
│   │   ├── Cargo.toml         # Rust dependencies
│   │   ├── src/lib.rs         # Backend logic
│   │   └── music-collab-backend.did  # Candid interface
│   └── music-collab-frontend/ # React frontend
│       ├── src/
│       │   ├── App.jsx        # Main application
│       │   ├── components/    # React components
│       │   ├── services/      # API and external services
│       │   └── utils/         # Utilities and helpers
│       └── package.json       # Frontend dependencies
└── target/                    # Compiled Rust artifacts
```

### Key Components

#### Frontend Components
- **App.jsx**: Main application entry point
- **WaveformGenerator.jsx**: Renders advanced waveform visualizations
- **NFTMarketplace.jsx**: Manages NFT trading and discovery
- **CollaborationHub.jsx**: Real-time collaboration interface
- **RoyaltyManager.jsx**: Tracks and distributes royalty payments

#### Services
- **pinataService.js**: IPFS integration for asset storage
- **auth.js**: Internet Identity authentication management

## API Documentation

### Candid Interface
The backend exposes type-safe APIs through Candid interfaces. Key endpoints include:

#### Project Management
- `create_project(name: text, description: text)`: Create new collaboration project
- `add_collaborator(project_id: text, user_id: principal)`: Add project collaborator

#### Sync Licensing
- `create_license(track_id: text, terms: LicenseTerms)`: Create licensing agreement
- `process_payment(license_id: text, amount: nat64)`: Process licensing payment

#### NFT Operations
- `mint_contribution_nft(project_id: text, contribution: text)`: Mint NFT for contributions
- `transfer_nft(token_id: nat64, to: principal)`: Transfer NFT ownership

## Security

### Measures
- **End-to-End Encryption**: Sensitive data protection in transit
- **Smart Contract Audits**: Regular security assessments of blockchain code
- **Immutable Audit Trail**: All transactions recorded on-chain
- **Access Control**: Role-based permissions for platform operations

### Privacy
- **Off-Chain PII**: Personal data stored by client platforms, not on blockchain
- **Pseudonymous Identity**: Wallet addresses used instead of personal identifiers
- **GDPR/CCPA Compliance**: Privacy regulations handled by client platforms

## Legal Framework

### Dual-Layer Agreement Structure

#### Smart Contracts
- **Execution Layer**: Automated payments and provenance tracking
- **Integration**: Incorporated by reference in platform Terms of Service

#### Terms of Service
- **Legal Binding**: Enforceable agreements on client platforms
- **NFT Clarification**: Tokens represent contribution proof and royalty rights, not copyright transfers

### Compliance Strategy
- **Securities Regulation**: NFTs positioned as utility tokens (Royalty Distribution Tokens)
- **Tax Integration**: CoinTracker API for automated tax reporting
- **Liability Shield**: Client platforms handle user-facing compliance

### Proactive Legal Steps
- Standard Collaboration Agreement drafted with music/tech law firms
- Regulatory engagement through sandbox programs
- Decentralized arbitration network for dispute resolution

## Roadmap

### MVP Timeline: 2 Hours (Current Focus)
- Frontend redesign with Pinata-inspired UI
- Core backend canisters (collaboration, sync licensing, NFTs)
- Basic waveform visualizations (Watercolor, Ink Brush, Mandala)
- Internet Identity authentication

### Post-MVP Enhancements
- **AI-Powered Features**: Collaboration recommendations and smart matching
- **Mobile Applications**: Native iOS and Android apps
- **VR Collaboration**: Immersive virtual reality environments
- **Cross-Chain Support**: Interoperability with other blockchain networks
- **Advanced Visualizations**: Holographic and Galaxy waveform styles
- **Security Hardening**: Comprehensive smart contract audits

## Contributing

We welcome contributions to improve Dexilo. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Rust and JavaScript/React best practices
- Write comprehensive tests for new features
- Ensure accessibility compliance (WCAG 2.1 AA)
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Dexilo** - Empowering music platforms with decentralized collaboration, sync licensing, and NFT services on the Internet Computer Protocol.

For business inquiries and partnership opportunities, please contact our team through the repository's issue tracker or discussion forums.
