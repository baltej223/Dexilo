import React, { useState } from 'react';
import NFTCard from './NFTCard';
import MintNFTModal from './MintNFTModal';
import WaveformNFTModal from './WaveformNFTModal';
import './NFTMarketplace.css';

const NFTMarketplace = ({ nfts, projects, onRefresh, onRefreshProjects, onMintNFT, user }) => {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showWaveformModal, setShowWaveformModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'available'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successData, setSuccessData] = useState(null);

  console.log('NFTMarketplace received projects:', projects);

  const filteredNFTs = nfts.filter(nft => {
    switch (filter) {
      case 'my':
        return nft.creator === user?.principal;
      case 'available':
        return nft.creator !== user?.principal;
      default:
        return true;
    }
  });

  const handleMintNFT = async (nftData) => {
    try {
      const nftId = await onMintNFT(nftData);
      const isAudioNFT = showWaveformModal; // Determine if it's an audio NFT
      
      setShowMintModal(false);
      setShowWaveformModal(false);
      
      // Show success message
      setSuccessData({
        name: nftData.name,
        id: nftId,
        type: isAudioNFT ? 'Audio NFT' : 'NFT'
      });
      setShowSuccessMessage(true);
      
      // Hide success message after 6 seconds (longer for audio NFTs)
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessData(null);
      }, 6000);
      
      onRefresh();
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    }
  };

  return (
    <div className="nft-marketplace">
      {showSuccessMessage && successData && (
        <div className="nft-success-message">
          <div className="success-icon">
            {successData.type === 'Audio NFT' ? '�' : '�🎉'}
          </div>
          <div className="success-content">
            <h4>{successData.type} Minted Successfully!</h4>
            <p>
              <strong>"{successData.name}"</strong> has been minted and added to the marketplace!
              {successData.type === 'Audio NFT' && ' Your waveform visualization is now a unique digital asset.'}
            </p>
            <small>NFT ID: {successData.id}</small>
          </div>
          <button 
            className="success-dismiss"
            onClick={() => {
              setShowSuccessMessage(false);
              setSuccessData(null);
            }}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="marketplace-header">
        <h2>🎵 Music NFT Marketplace</h2>
        <div className="marketplace-actions">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              data-filter="all"
            >
              🌐 All NFTs
            </button>
            <button 
              className={`filter-tab ${filter === 'my' ? 'active' : ''}`}
              onClick={() => setFilter('my')}
              data-filter="my"
            >
              👤 My NFTs
            </button>
            <button 
              className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
              data-filter="available"
            >
              🛒 Available
            </button>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowMintModal(true)}
          >
            💎 Quick Mint
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowWaveformModal(true)}
          >
            🎵 Audio NFT
          </button>
        </div>
      </div>

      {filteredNFTs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💎</div>
          <h3>No NFTs found</h3>
          <p>
            {filter === 'my' 
              ? 'You haven\'t minted any NFTs yet. Create your first music NFT!'
              : 'Be the first to mint a music NFT on this platform!'
            }
          </p>
          <button 
            className="btn-primary"
            onClick={() => setShowMintModal(true)}
          >
            Mint Your First NFT
          </button>
        </div>
      ) : (
        <div className="nft-grid">
          {filteredNFTs.map(nft => (
            <NFTCard
              key={nft.id}
              nft={nft}
              project={projects.find(p => p.id === nft.project_id)}
              isOwner={nft.creator === user?.principal}
            />
          ))}
        </div>
      )}

      {showMintModal && (
        <MintNFTModal
          projects={projects}
          onSubmit={handleMintNFT}
          onClose={() => setShowMintModal(false)}
          onRefreshProjects={onRefreshProjects}
          user={user}
        />
      )}

      {showWaveformModal && (
        <WaveformNFTModal
          projects={projects}
          onSubmit={handleMintNFT}
          onClose={() => setShowWaveformModal(false)}
          onRefreshProjects={onRefreshProjects}
          user={user}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
