import React, { useState, useEffect } from 'react';
import './MintNFTModal.css';

const MintNFTModal = ({ projects, onSubmit, onClose, onRefreshProjects, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    projectId: '',
    price: ''
  });

  // Auto-select project if only one exists
  useEffect(() => {
    if (projects && projects.length === 1 && !formData.projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: String(projects[0].id || 0)
      }));
    }
  }, [projects, formData.projectId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.projectId && formData.price) {
      const nftData = {
        name: formData.name,
        description: formData.description,
        image_url: formData.imageUrl || `https://picsum.photos/400/400?random=${Date.now()}`,
        creator: user?.principal || 'anonymous',
        project_id: Number(formData.projectId), // Ensure it's a number
        price: Math.round(parseFloat(formData.price) * 1000000) // Convert ICP to smallest unit
      };
      onSubmit(nftData);
    } else {
    }
  };

  return (
    <div className="modal-overlay">
      <div className="mint-nft-modal">
        <div className="modal-header">
          <h3>Mint Music NFT</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="mint-form">
          <div className="form-group">
            <label htmlFor="name">NFT Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., 'Cosmic Melody #1'"
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
              placeholder="Describe your NFT..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
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
              {Array.isArray(projects) && projects.length > 0 ? (
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
                <option value="" disabled style={{color: '#fca5a5'}}>
                  No projects available - Create a project first
                </option>
              )}
            </select>
            {(!Array.isArray(projects) || projects.length === 0) && (
              <div className="helper-text">
                <p>⚠️ You need to create a music project first before minting NFTs.</p>
                <p>Projects loaded: {Array.isArray(projects) ? projects.length : 'Not loaded'}</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                  <button 
                    type="button" 
                    className="btn-secondary small"
                    onClick={(e) => { e.preventDefault(); onClose(); }}
                  >
                    Go to Projects
                  </button>
                  {onRefreshProjects && (
                    <button 
                      type="button" 
                      className="btn-secondary small"
                      onClick={async (e) => { 
                        e.preventDefault(); 
                        console.log('Refreshing projects...');
                        await onRefreshProjects();
                      }}
                    >
                      Refresh Projects
                    </button>
                  )}
                </div>
              </div>
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
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (Optional)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/artwork.jpg"
            />
            <small>Leave empty to generate a random image</small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!formData.name || !formData.description || !formData.projectId || !formData.price}
            >
              Mint NFT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MintNFTModal;
