import React, { useState } from 'react';
import { Music, Eye, Gem, Clock, Edit, Diamond } from 'lucide-react';
import './NFTCard.css';

const NFTCard = ({ 
  nft, 
  project, 
  isOwner, 
  onBuy, 
  onTransfer, 
  onViewDetails, 
  onUpdatePrice,
  showQuickActions = true 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (onBuy && !isOwner && !isLoading) {
      setIsLoading(true);
      try {
        await onBuy(nft);
      } catch (error) {
        console.error('Purchase failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(nft);
    }
  };

  const formatPrice = (price) => {
    return (Number(price) / 1000000).toFixed(2); // Convert from smallest unit to ICP
  };

  const getStatusBadge = () => {
    if (isOwner) {
      return <div className="status-badge owned">Owned</div>;
    }
    return <div className="status-badge for-sale">For Sale</div>;
  };

  return (
    <div 
      className={`nft-card ${isOwner ? 'owned' : 'for-sale'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="nft-image">
        {nft.image_url ? (
          <img src={nft.image_url} alt={nft.name} />
        ) : (
          <div className="placeholder-image">
            <span className="music-icon"><Music size={24} /></span>
          </div>
        )}
        
        {/* Status Badge */}
        {getStatusBadge()}
        
        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className={`quick-actions-overlay ${showActions ? 'visible' : ''}`}>
            <button 
              className="quick-action-btn view-btn"
              onClick={handleViewDetails}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            {!isOwner && (
              <button 
                className="quick-action-btn buy-btn"
                onClick={handlePurchase}
                disabled={isLoading}
                title="Quick Buy"
              >
                {isLoading ? <Clock size={16} /> : <Gem size={16} />}
              </button>
            )}
            {isOwner && onUpdatePrice && (
              <button 
                className="quick-action-btn edit-btn"
                onClick={() => onUpdatePrice(nft)}
                title="Update Price"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        )}

        {/* NFT ID Badge */}
        <div className="nft-id-badge">#{nft.id}</div>
      </div>
      
      <div className="nft-content">
        <div className="nft-header">
          <h3 className="nft-name" title={nft.name}>{nft.name}</h3>
          <div className="nft-price">
            <span className="price-amount">{formatPrice(nft.price)}</span>
            <span className="price-currency">ICP</span>
          </div>
        </div>
        
        <p className="nft-description" title={nft.description}>
          {nft.description.length > 80 
            ? `${nft.description.substring(0, 80)}...` 
            : nft.description
          }
        </p>
        
        <div className="nft-meta">
          <div className="nft-creator">
            <span className="meta-label">Creator:</span>
            <span className="meta-value" title={nft.creator}>
              {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
            </span>
          </div>
          
          {(nft.current_owner && nft.current_owner !== nft.creator) && (
            <div className="nft-owner">
              <span className="meta-label">Owner:</span>
              <span className="meta-value" title={nft.current_owner}>
                {nft.current_owner.slice(0, 6)}...{nft.current_owner.slice(-4)}
              </span>
            </div>
          )}
          
          {project && (
            <div className="nft-project">
              <span className="meta-label">Project:</span>
              <span className="meta-value" title={project.title}>{project.title}</span>
            </div>
          )}
        </div>
        
        <div className="nft-actions">
          {isOwner ? (
            <div className="owner-actions">
              <button 
                className="btn-secondary view-details-btn"
                onClick={handleViewDetails}
              >
                View Details
              </button>
              {onUpdatePrice && (
                <button 
                  className="btn-outline update-price-btn"
                  onClick={() => onUpdatePrice(nft)}
                >
                  Update Price
                </button>
              )}
            </div>
          ) : (
            <button 
              className={`btn-primary buy-btn ${isLoading ? 'loading' : ''}`}
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="buy-icon"><Diamond size={16} /></span>
                  Buy for {formatPrice(nft.price)} ICP
                </>
              )}
            </button>
          )}
        </div>

        {/* Royalty Info */}
        <div className="royalty-info">
          <span className="royalty-icon"><Diamond size={12} /></span>
          <span className="royalty-text">10% royalty to creator</span>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
