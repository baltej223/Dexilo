import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ currentView, onViewChange, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '🎵' },
    { id: 'nft', label: 'NFT Market', icon: '💎' },
    { id: 'collaborate', label: 'Collaborate', icon: '🤝' },
  ];

  const handleLogout = async () => {
    setShowUserMenu(false);
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="nav-logo">🎼</span>
        <span className="nav-title">Dexilo</span>
      </div>
      
      <div className="nav-items">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-user">
        <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="user-details">
            <span className="user-name">User</span>
            <span className="user-id">{user?.principal?.slice(0, 8)}...</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        {showUserMenu && (
          <div className="user-menu">
            <div className="user-menu-header">
              <div className="user-avatar large">👤</div>
              <div className="user-info-full">
                <span className="user-name">Anonymous User</span>
                <span className="user-id-full">{user?.principal}</span>
              </div>
            </div>
            <div className="user-menu-divider"></div>
            <button className="user-menu-item" onClick={() => navigator.clipboard.writeText(user?.principal)}>
              📋 Copy Principal ID
            </button>
            <button className="user-menu-item logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
