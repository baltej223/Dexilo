import React, { useState, useMemo } from 'react';
import NFTCard from './NFTCard';
import MintNFTModal from './MintNFTModal';
import WaveformNFTModal from './WaveformNFTModal';
import BuyNFTModal from './BuyNFTModal';
import MarketplaceFilters from './MarketplaceFilters';
import FeaturedNFTs from './FeaturedNFTs';
import './NFTMarketplace.css';

const NFTMarketplace = ({ nfts, projects, onRefresh, onRefreshProjects, onMintNFT, user }) => {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showWaveformModal, setShowWaveformModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'available'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilters, setMarketplaceFilters] = useState({
    category: 'all',
    priceRange: { min: 0, max: 1000 },
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  console.log('NFTMarketplace received projects:', projects);

  // Enhanced filtering and sorting logic
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = nfts.filter(nft => {
      // Basic filter (all, my, available)
      let matchesBasicFilter = true;
      switch (filter) {
        case 'my':
          matchesBasicFilter = (nft.current_owner || nft.creator) === user?.principal;
          break;
        case 'available':
          matchesBasicFilter = (nft.current_owner || nft.creator) !== user?.principal && (nft.is_for_sale !== false);
          break;
        default:
          matchesBasicFilter = true;
      }

      // Search query filter
      const searchLower = marketplaceFilters.searchQuery.toLowerCase();
      const matchesSearch = !searchLower || 
        nft.name.toLowerCase().includes(searchLower) ||
        nft.description.toLowerCase().includes(searchLower) ||
        nft.creator.toLowerCase().includes(searchLower);

      // Price range filter
      const price = Number(nft.price) / 1000000; // Convert to ICP
      const matchesPrice = price >= marketplaceFilters.priceRange.min && 
                          price <= marketplaceFilters.priceRange.max;

      return matchesBasicFilter && matchesSearch && matchesPrice;
    });

    // Sort NFTs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        case 'oldest':
          return a.id - b.id;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return filtered;
  }, [nfts, filter, marketplaceFilters, sortBy, user]);

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

  const handleBuyNFT = (nft) => {
    setSelectedNFT(nft);
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async (nft) => {
    try {
      // Get authenticated actor
      const { authService } = await import('../services/auth');
      const actor = authService.getActor();
      if (!actor) throw new Error('No authenticated actor available');
      
      // Call backend buy_nft function
      const result = await actor.buy_nft(
        BigInt(nft.id),
        user.principal
      );
      
      console.log('Purchase result:', result);
      
      // Show success message
      setSuccessData({
        name: nft.name,
        id: nft.id,
        type: 'Purchase',
        action: 'purchased'
      });
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessData(null);
      }, 5000);
      
      // Refresh NFT list to show updated ownership
      onRefresh();
      
      return result;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw new Error(error.message || 'Purchase failed. Please try again.');
    }
  };

  const handleViewDetails = (nft) => {
    // TODO: Implement NFT details modal/page
    console.log('View details for NFT:', nft);
    alert(`Viewing details for "${nft.name}"`);
  };

  const handleUpdatePrice = async (nft) => {
    const newPrice = prompt(`Enter new price for "${nft.name}" (current: ${(Number(nft.price) / 1000000).toFixed(2)} ICP):`);
    
    if (newPrice === null) return; // User cancelled
    
    const priceInUnits = Math.floor(parseFloat(newPrice) * 1000000);
    
    if (isNaN(priceInUnits) || priceInUnits <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    try {
      const { authService } = await import('../services/auth');
      const actor = authService.getActor();
      if (!actor) throw new Error('No authenticated actor available');
      
      const result = await actor.update_nft_price(
        BigInt(nft.id),
        BigInt(priceInUnits),
        user.principal
      );
      
      console.log('Price update result:', result);
      
      // Show success message
      setSuccessData({
        name: nft.name,
        id: nft.id,
        type: 'Price Update',
        action: 'updated'
      });
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessData(null);
      }, 3000);
      
      // Refresh NFT list to show updated price
      onRefresh();
      
    } catch (error) {
      console.error('Price update failed:', error);
      alert(`Failed to update price: ${error.message}`);
    }
  };

  const handleSearch = (query) => {
    setMarketplaceFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  const handleFilter = (filters) => {
    setMarketplaceFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  return (
    <div className="nft-marketplace">
      {showSuccessMessage && successData && (
        <div className="nft-success-message">
          <div className="success-icon">
            {successData.type === 'Audio NFT' ? '🎵' : 
             successData.type === 'Purchase' ? '💎' : '🎉'}
          </div>
          <div className="success-content">
            <h4>
              {successData.action === 'purchased' 
                ? `NFT Purchased Successfully!` 
                : successData.action === 'updated'
                ? `Price Updated Successfully!`
                : `${successData.type} Minted Successfully!`
              }
            </h4>
            <p>
              <strong>"{successData.name}"</strong> 
              {successData.action === 'purchased' 
                ? ' is now in your collection!' 
                : successData.action === 'updated'
                ? ' price has been updated in the marketplace!'
                : ' has been minted and added to the marketplace!'
              }
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
        <div className="header-content">
          <h1>Music NFT Marketplace</h1>
          <p>Discover, buy, and sell unique music NFTs with automated royalties</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowMintModal(true)}
          >

            Quick Mint
          </button>
          <button 
            className="btn-gradient"
            onClick={() => setShowWaveformModal(true)}
          >

            Audio NFT
          </button>
        </div>
      </div>

      {/* Marketplace Filters */}
      <MarketplaceFilters
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        totalNFTs={nfts.length}
        filteredCount={filteredAndSortedNFTs.length}
      />

      {/* Basic Filter Tabs */}
      <div className="filter-tabs-container">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span className="tab-icon">🌐</span>
            All NFTs ({nfts.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'my' ? 'active' : ''}`}
            onClick={() => setFilter('my')}
          >
            <span className="tab-icon">👤</span>
            My NFTs ({nfts.filter(nft => (nft.current_owner || nft.creator) === user?.principal).length})
          </button>
          <button 
            className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            <span className="tab-icon">🛒</span>
            Available ({nfts.filter(nft => (nft.current_owner || nft.creator) !== user?.principal).length})
          </button>
        </div>
      </div>

      {/* Featured NFTs Section */}
      {filteredAndSortedNFTs.length > 0 && filter !== 'my' && (
        <FeaturedNFTs
          nfts={nfts}
          onBuy={handleBuyNFT}
          onViewDetails={handleViewDetails}
          user={user}
        />
      )}

      {/* NFTs Grid */}
      {filteredAndSortedNFTs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💎</div>
          <h3>No NFTs found</h3>
          <p>
            {filter === 'my' 
              ? 'You haven\'t minted any NFTs yet. Create your first music NFT!'
              : marketplaceFilters.searchQuery 
                ? `No NFTs match your search for "${marketplaceFilters.searchQuery}"`
                : 'Be the first to mint a music NFT on this platform!'
            }
          </p>
          <div className="empty-actions">
            <button 
              className="btn-primary"
              onClick={() => setShowMintModal(true)}
            >

              Mint Your First NFT
            </button>
            {marketplaceFilters.searchQuery && (
              <button 
                className="btn-secondary"
                onClick={() => setMarketplaceFilters(prev => ({ ...prev, searchQuery: '' }))}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="nft-grid">
          {filteredAndSortedNFTs.map(nft => (
            <NFTCard
              key={nft.id}
              nft={nft}
              project={projects.find(p => p.id === nft.project_id)}
              isOwner={(nft.current_owner || nft.creator) === user?.principal}
              onBuy={handleBuyNFT}
              onViewDetails={handleViewDetails}
              onUpdatePrice={handleUpdatePrice}
              showQuickActions={true}
            />
          ))}
        </div>
      )}

      {/* Pagination would go here in the future */}

      {/* Modals */}
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

      {showBuyModal && selectedNFT && (
        <BuyNFTModal
          nft={selectedNFT}
          project={projects.find(p => p.id === selectedNFT.project_id)}
          onBuy={handleConfirmPurchase}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedNFT(null);
          }}
          user={user}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
