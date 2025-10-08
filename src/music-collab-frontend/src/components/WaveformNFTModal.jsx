import React, { useState, useEffect } from 'react';
import WaveformGenerator from './WaveformGenerator';
import './WaveformNFTModal.css';

const WaveformNFTModal = ({ projects, onSubmit, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    price: '',
    audioFile: null,
    waveformStyle: 'gradient'
  });
  const [waveformImage, setWaveformImage] = useState(null);
  const [step, setStep] = useState(1); // 1: Form, 2: Audio Upload, 3: Waveform
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Auto-select project if only one exists
  useEffect(() => {
    if (projects && projects.length === 1 && !formData.projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: String(projects[0].id || 0)
      }));
    }
  }, [projects, formData.projectId]);

  const waveformStyles = [
    // Classic Styles
    { value: 'gradient', name: 'Gradient Bars', description: 'Colorful gradient bars with glow effect' },
    { value: 'neon', name: 'Neon Pulse', description: 'Electric neon waveform with pulse effect' },
    { value: 'minimal', name: 'Minimal Lines', description: 'Clean minimal line waveform' },
    { value: 'vintage', name: 'Vintage Vinyl', description: 'Retro vinyl record style' },
    { value: 'spectrum', name: 'Frequency Spectrum', description: 'Audio frequency spectrum visualization' },
    { value: 'glitch', name: 'Digital Glitch', description: 'Cyberpunk glitch art style' },
    
    // Artistic Styles
    { value: 'watercolor', name: 'Watercolor Splash', description: 'Artistic watercolor paint effect' },
    { value: 'crystalline', name: 'Crystal Formation', description: 'Geometric crystal-like structures' },
    { value: 'organic', name: 'Organic Flow', description: 'Natural flowing organic shapes' },
    { value: 'holographic', name: 'Holographic Foil', description: 'Iridescent holographic effect' },
    { value: 'plasma', name: 'Plasma Energy', description: 'Electric plasma energy waves' },
    { value: 'galaxy', name: 'Galaxy Nebula', description: 'Cosmic nebula with stars' },
    
    // Geometric Styles
    { value: 'geometric', name: 'Sacred Geometry', description: 'Mathematical geometric patterns' },
    { value: 'hexagonal', name: 'Hexagon Grid', description: 'Honeycomb hexagonal pattern' },
    { value: 'triangular', name: 'Triangle Mosaic', description: 'Triangular mosaic composition' },
    { value: 'circular', name: 'Circular Waves', description: 'Concentric circular patterns' },
    
    // Nature-Inspired
    { value: 'mountain', name: 'Mountain Range', description: 'Mountain silhouette landscape' },
    { value: 'ocean', name: 'Ocean Waves', description: 'Fluid ocean wave motion' },
    { value: 'forest', name: 'Forest Canopy', description: 'Tree canopy silhouettes' },
    { value: 'aurora', name: 'Aurora Borealis', description: 'Northern lights effect' },
    
    // Futuristic Styles
    { value: 'matrix', name: 'Digital Matrix', description: 'Matrix-style digital rain' },
    { value: 'cyberpunk', name: 'Cyberpunk Grid', description: 'Futuristic grid overlay' },
    { value: 'neural', name: 'Neural Network', description: 'Brain synapse connections' },
    { value: 'quantum', name: 'Quantum Field', description: 'Quantum particle field' },
    
    // Abstract Art
    { value: 'abstract', name: 'Abstract Art', description: 'Abstract expressionist style' },
    { value: 'fractal', name: 'Fractal Pattern', description: 'Mathematical fractal design' },
    { value: 'mandala', name: 'Mandala Circle', description: 'Spiritual mandala pattern' },
    { value: 'kaleidoscope', name: 'Kaleidoscope', description: 'Symmetrical kaleidoscope view' },
    
    // Vintage & Retro
    { value: 'retro80s', name: 'Retro 80s', description: 'Synthwave retro aesthetic' },
    { value: 'artdeco', name: 'Art Deco', description: '1920s art deco styling' },
    { value: 'steampunk', name: 'Steampunk', description: 'Victorian steampunk design' },
    { value: 'psychedelic', name: 'Psychedelic', description: '60s psychedelic art' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setFormData({
        ...formData,
        audioFile: file
      });
      setStep(3);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const handleWaveformGenerated = (imageUrl) => {
    setWaveformImage(imageUrl);
    setShowSuccessMessage(true);
    
    // Hide success message after 5 seconds (increased from 3 seconds)
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.projectId && formData.price && waveformImage) {
      const nftData = {
        name: formData.name,
        description: formData.description,
        image_url: waveformImage,
        creator: user?.principal || 'anonymous',
        project_id: parseInt(formData.projectId),
        price: Math.round(parseFloat(formData.price) * 1000000) // Convert ICP to smallest unit
      };
      onSubmit(nftData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3>🎵 Create Audio NFT - Step 1</h3>
            <div className="form-group">
              <label htmlFor="name">NFT Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., 'Epic Beat Drop #1'"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your audio NFT..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Source Project *</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
                className="project-select"
              >
                <option value="">Select a project</option>
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => {
                    const projectId = project.id !== undefined ? String(project.id) : String(index);
                    const projectTitle = project.title || `Project ${index + 1}`;
                    return (
                      <option key={projectId} value={projectId}>
                        {projectTitle}
                      </option>
                    );
                  })
                ) : (
                  <option value="" disabled>No projects available - Create a project first</option>
                )}
              </select>
              {(!projects || projects.length === 0) && (
                <small className="helper-text">
                  You need to create a music project first before minting NFTs. 
                  <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
                    Go to Projects
                  </a>
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (ICP) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.5"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="step-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.description || !formData.projectId || !formData.price}
              >
                Next: Upload Audio
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>🎵 Create Audio NFT - Step 2</h3>
            
            <div className="waveform-style-selection">
              <h4>Choose Waveform Style</h4>
              <div className="style-grid">
                {waveformStyles.map((style) => (
                  <div 
                    key={style.value}
                    className={`style-option ${formData.waveformStyle === style.value ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, waveformStyle: style.value})}
                  >
                    <div className="style-preview">
                      <div className={`preview-${style.value}`}></div>
                    </div>
                    <div className="style-info">
                      <h5>{style.name}</h5>
                      <small>{style.description}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="audio-upload-container">
              <div className="audio-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    id="audioFile"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="audioFile" className="upload-label">
                    <div className="upload-icon">🎵</div>
                    <p>Click to upload audio file</p>
                    <small>Supports MP3, WAV, M4A formats</small>
                  </label>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>🎵 Create Audio NFT - Step 3</h3>
            
            {showSuccessMessage && (
              <div className="success-message">
                <div className="success-icon">✨</div>
                <div className="success-text">
                  <h4>Waveform Generated Successfully!</h4>
                  <p>Your audio visualization is ready. You can now mint your NFT!</p>
                </div>
                <button 
                  className="success-dismiss"
                  onClick={() => setShowSuccessMessage(false)}
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
            
            <WaveformGenerator
              audioFile={formData.audioFile}
              waveformStyle={formData.waveformStyle}
              onWaveformGenerated={handleWaveformGenerated}
            />

            <div className="style-controls-container">
              <div className="style-controls">
                <label className="style-label">
                  <span className="style-icon">🎨</span>
                  Change Style:
                </label>
                <select 
                  value={formData.waveformStyle} 
                  onChange={(e) => setFormData({...formData, waveformStyle: e.target.value})}
                  className="style-selector"
                >
                  {waveformStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!waveformImage}
              >
                Mint Audio NFT
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="waveform-nft-modal">
        <div className="modal-header">
          <h3>💎 Create Audio NFT with Waveform</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>
        
        <form className="waveform-form">
          {renderStep()}
        </form>
      </div>
    </div>
  );
};

export default WaveformNFTModal;
