import React, { useState } from 'react';
import './BuyNFTModal.css';

const BuyNFTModal = ({ nft, project, onBuy, onClose, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatPrice = (price) => {
    return (Number(price) / 1000000).toFixed(2);
  };

  const handleConfirmPurchase = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);
    try {
      await onBuy(nft);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="buy-nft-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Purchase NFT</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {/* NFT Preview */}
          <div className="nft-preview">
            <div className="nft-image">
              {nft.image_url ? (
                <img src={nft.image_url} alt={nft.name} />
              ) : (
                <div className="placeholder-image">
                  <span className="music-icon">🎵</span>
                </div>
              )}
            </div>
            
            <div className="nft-details">
              <h3>{nft.name}</h3>
              <p className="nft-description">{nft.description}</p>
              
              <div className="nft-meta">
                <div className="meta-item">
                  <span className="label">Creator:</span>
                  <span className="value">{nft.creator.slice(0, 8)}...{nft.creator.slice(-6)}</span>
                </div>
                
                {project && (
                  <div className="meta-item">
                    <span className="label">Project:</span>
                    <span className="value">{project.title}</span>
                  </div>
                )}
                
                <div className="meta-item">
                  <span className="label">NFT ID:</span>
                  <span className="value">#{nft.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="price-section">
            <div className="price-breakdown">
              <div className="price-row">
                <span>NFT Price</span>
                <span className="price">{formatPrice(nft.price)} ICP</span>
              </div>
              <div className="price-row">
                <span>Platform Fee (2.5%)</span>
                <span className="price">{(formatPrice(nft.price) * 0.025).toFixed(4)} ICP</span>
              </div>
              <div className="price-row royalty-info">
                <span>Creator Royalty (10%)</span>
                <span className="price">{(formatPrice(nft.price) * 0.1).toFixed(4)} ICP</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span className="price">{formatPrice(nft.price)} ICP</span>
              </div>
            </div>
          </div>

          {/* Royalty Information */}
          <div className="royalty-section">
            <div className="royalty-header">
              <span className="royalty-icon">💎</span>
              <h4>Royalty Information</h4>
            </div>
            <p className="royalty-text">
              This NFT includes a 10% royalty that goes to the original creator on all future sales. 
              You will become the owner and can resell this NFT at any time.
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-section">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="terms-text">
                I agree that this NFT represents a Proof of Contribution and Royalty Right, 
                not a copyright transfer. I understand the terms of ownership and royalty distribution.
              </span>
            </label>
          </div>

          {/* Buyer Information */}
          <div className="buyer-info">
            <div className="info-item">
              <span className="label">Purchasing as:</span>
              <span className="value">{user?.principal?.slice(0, 8)}...{user?.principal?.slice(-6)}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          
          <button 
            className={`btn-primary purchase-btn ${!agreedToTerms ? 'disabled' : ''}`}
            onClick={handleConfirmPurchase}
            disabled={!agreedToTerms || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <span className="purchase-icon">💎</span>
                Buy for {formatPrice(nft.price)} ICP
              </>
            )}
          </button>
        </div>

        {/* Transaction Status */}
        {isProcessing && (
          <div className="transaction-status">
            <div className="status-content">
              <div className="status-icon">⏳</div>
              <div className="status-text">
                <h4>Processing Purchase</h4>
                <p>Please wait while we process your transaction on the blockchain...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyNFTModal;