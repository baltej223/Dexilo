import React from 'react';
import { Flame, Star, Music, Eye, Gem, Diamond } from 'lucide-react';
import './FeaturedNFTs.css';

const FeaturedNFTs = ({ nfts = [], onBuy, onViewDetails, user }) => {
  const formatPrice = (price) => {
    return (Number(price) / 1000000).toFixed(2);
  };

  const getFeaturedNFTs = () => {
    // Sort by price (high to low) and take top 6 for featured
    return nfts
      .filter(nft => (nft.current_owner || nft.creator) !== user?.principal) // Don't feature own NFTs
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 6);
  };

  const featuredNFTs = getFeaturedNFTs();

  if (featuredNFTs.length === 0) {
    return null;
  }

  return (
    <div className="featured-nfts">
      <div className="featured-header">
        <h3><Flame size={20} /> Featured NFTs</h3>
        <p>Discover the most valuable music NFTs in our marketplace</p>
      </div>

      <div className="featured-carousel">
        {featuredNFTs.map((nft, index) => (
          <div key={nft.id} className={`featured-card ${index < 3 ? 'primary' : 'secondary'}`}>
            <div className="card-badges">
              {index === 0 && <div className="badge hot"><Flame size={12} /> Hot</div>}
              {index < 3 && <div className="badge featured"><Star size={12} /> Featured</div>}
              <div className="badge price-badge">{formatPrice(nft.price)} ICP</div>
            </div>

            <div className="card-image">
              {nft.image_url ? (
                <img src={nft.image_url} alt={nft.name} />
              ) : (
                <div className="placeholder-image">
                  <span className="music-icon"><Music size={24} /></span>
                </div>
              )}
              <div className="image-overlay">
                <button 
                  className="quick-view-btn"
                  onClick={() => onViewDetails?.(nft)}
                  title="Quick View"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="quick-buy-btn"
                  onClick={() => onBuy?.(nft)}
                  title="Quick Buy"
                >
                  <Gem size={16} />
                </button>
              </div>
            </div>

            <div className="card-content">
              <h4 className="nft-title">{nft.name}</h4>
              <p className="nft-creator">
                By {(nft.current_owner || nft.creator).slice(0, 6)}...{(nft.current_owner || nft.creator).slice(-4)}
              </p>
              
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">{formatPrice(nft.price)} ICP</span>
                </div>
                <div className="stat">
                  <span className="stat-label">ID</span>
                  <span className="stat-value">#{nft.id}</span>
                </div>
              </div>

              <button 
                className="featured-buy-btn"
                onClick={() => onBuy?.(nft)}
              >
                <span className="buy-icon"><Diamond size={16} /></span>
                Buy Now
              </button>
            </div>

            {/* Ranking badge for top 3 */}
            {index < 3 && (
              <div className="ranking-badge">
                <span className="ranking-number">{index + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation dots for mobile */}
      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(featuredNFTs.length / 2) }).map((_, index) => (
          <div key={index} className="dot"></div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedNFTs;