import React from 'react';
import './Home.css';

const Home = ({ onNavigate, onLogin, user }) => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Flexbox 1: Title/Description + Logo */}
          <div className="hero-top">
            <div className="hero-text-left">
              <h1 className="hero-title">Dexilo</h1>
              <p className="hero-subtitle">
                A decentralized B2B SaaS platform empowering music platforms with NFT-powered collaboration, 
                certified digital ownership, and comprehensive music monetization on the Internet Computer Protocol.
              </p>
            </div>
            <div className="hero-logo">
              <img src="/logo-black-transparent.png" alt="Dexilo Logo" className="hero-logo-img" />
            </div>
          </div>

          {/* Flexbox 2: Buttons */}
          <div className="hero-actions">
            {user ? (
              <>
                <button 
                  className="btn-primary-hero"
                  onClick={() => onNavigate('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className="btn-secondary-hero"
                  onClick={() => onNavigate('projects')}
                >
                  Projects
                </button>
                <button 
                  className="btn-tertiary-hero"
                  onClick={() => onNavigate('nft')}
                >
                  NFT Market
                </button>
              </>
            ) : (
              <button 
                className="btn-primary-hero"
                onClick={onLogin}
              >
                Get Started - Login with Internet Identity
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title" style={{color: "#ffffff"}}>Empowering Music Platforms</h2>
          <div className="features-grid">
            <div className="feature-card">

              <h3>NFT Marketplace</h3>
              <p>Comprehensive NFT creation, trading, and royalty management system with automated smart contract distribution.</p>
            </div>
            <div className="feature-card">

              <h3>Dexilo Certification</h3>
              <p>Industry-standard on-chain provenance certificates creating network effects and competitive advantages.</p>
            </div>
            <div className="feature-card">

              <h3>Waveform Visualizations</h3>
              <p>Advanced 2D visualizations with Watercolor, Ink Brush, and Mandala styles powered by Anime.js.</p>
            </div>
            <div className="feature-card">

              <h3>Secure & Private</h3>
              <p>Internet Identity authentication with pseudonymous addresses and GDPR-compliant privacy protection.</p>
            </div>
            <div className="feature-card">

              <h3>Analytics Dashboard</h3>
              <p>Real-time NFT marketplace metrics, collaboration analytics, and digital ownership tracking insights.</p>
            </div>
            <div className="feature-card">

              <h3>Sync Licensing</h3>
              <p>Supporting automated music licensing services with transparent agreements and smart contract royalties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Music Platform?</h2>
          <p>Join the decentralized music revolution with NFT-powered collaboration and certified digital ownership.</p>
          <button 
            className="btn-cta"
            onClick={() => onNavigate('dashboard')}
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;