import React from 'react';
import './NFTCard.css';

const NFTCard = ({ nft, project, isOwner, onBuy, onTransfer }) => {
  const handlePurchase = () => {
    if (onBuy && !isOwner) {
      onBuy(nft);
    }
  };

  const formatPrice = (price) => {
    return (Number(price) / 1000000).toFixed(2); // Convert from smallest unit to ICP
  };

  return (
    <div className="nft-card">
      <div className="nft-image">
        {nft.image_url ? (
          <img src={nft.image_url} alt={nft.name} />
        ) : (
          <div className="placeholder-image">
            <span className="music-icon">🎵</span>
          </div>
        )}
        {isOwner && <div className="owner-badge">Owned</div>}
      </div>
      
      <div className="nft-content">
        <div className="nft-header">
          <h3 className="nft-name">{nft.name}</h3>
          <div className="nft-price">
            {formatPrice(nft.price)} ICP
          </div>
        </div>
        
        <p className="nft-description">{nft.description}</p>
        
        <div className="nft-meta">
          <div className="nft-creator">
            <strong>Creator:</strong> {nft.creator.slice(0, 8)}...
          </div>
          {project && (
            <div className="nft-project">
              <strong>Project:</strong> {project.title}
            </div>
          )}
        </div>
        
        <div className="nft-actions">
          {isOwner ? (
            <button className="btn-secondary" disabled>
              You own this NFT
            </button>
          ) : (
            <button 
              className="btn-primary"
              onClick={handlePurchase}
            >
              Buy for {formatPrice(nft.price)} ICP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
