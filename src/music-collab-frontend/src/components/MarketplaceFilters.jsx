import React, { useState } from 'react';
import './MarketplaceFilters.css';

const MarketplaceFilters = ({ 
  onSearch, 
  onFilter, 
  onSort, 
  totalNFTs = 0,
  filteredCount = 0 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'hip-hop', label: 'Hip-Hop' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'pop', label: 'Pop' },
    { value: 'indie', label: 'Indie' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters({ category });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onSort?.(sort);
  };

  const handlePriceRangeChange = (type, value) => {
    const newRange = { ...priceRange, [type]: parseFloat(value) };
    setPriceRange(newRange);
    applyFilters({ priceRange: newRange });
  };

  const applyFilters = (newFilters = {}) => {
    const filters = {
      category: selectedCategory,
      priceRange,
      searchQuery,
      ...newFilters
    };
    onFilter?.(filters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000 });
    setSelectedCategory('all');
    setSortBy('newest');
    onSearch?.('');
    onFilter?.({ category: 'all', priceRange: { min: 0, max: 1000 }, searchQuery: '' });
    onSort?.('newest');
  };

  return (
    <div className="marketplace-filters">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search NFTs by name, creator, or description..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchQuery('');
                onSearch?.('');
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Results Count */}
        <div className="results-count">
          Showing {filteredCount} of {totalNFTs} NFTs
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button 
          className={`advanced-filters-toggle ${showAdvancedFilters ? 'active' : ''}`}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          Advanced Filters
          <span className={`toggle-icon ${showAdvancedFilters ? 'rotated' : ''}`}>▼</span>
        </button>

        {/* Clear Filters */}
        <button 
          className="clear-filters"
          onClick={clearAllFilters}
          title="Clear all filters"
        >
          Clear All
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="advanced-filter-group">
            <label>Price Range (ICP):</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="price-input"
                min="0"
                step="0.01"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="price-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="price-range-slider">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="range-slider min-slider"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="range-slider max-slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all' || priceRange.min > 0 || priceRange.max < 1000) && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          
          {searchQuery && (
            <span className="filter-tag">
              Search: "{searchQuery}"
              <button onClick={() => {
                setSearchQuery('');
                onSearch?.('');
              }}>✕</button>
            </span>
          )}
          
          {selectedCategory !== 'all' && (
            <span className="filter-tag">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
              <button onClick={() => handleCategoryChange('all')}>✕</button>
            </span>
          )}
          
          {(priceRange.min > 0 || priceRange.max < 1000) && (
            <span className="filter-tag">
              Price: {priceRange.min} - {priceRange.max} ICP
              <button onClick={() => handlePriceRangeChange('min', 0) || handlePriceRangeChange('max', 1000)}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters;