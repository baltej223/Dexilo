import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ currentView, onViewChange, user, onLogout, onLogin }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const authenticatedNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'nft', label: 'NFT Market' },
    { id: 'collaborate', label: 'Collaborate' },
  ];

  const publicNavItems = [
    { id: 'home', label: 'Home' },
  ];

  const handleLogout = async () => {
    setShowUserMenu(false);
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-brand" onClick={() => onViewChange('home')} style={{ cursor: 'pointer' }}>
        <img src="/dexilogo.png" alt="Dexilo Logo" className="nav-logo" />
        <span className="nav-title">Dexilo</span>
      </div>
      
      <div className="nav-items">
        {(user ? authenticatedNavItems : publicNavItems).map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
          <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">
                <span>U</span>
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
                  <div className="user-avatar large">U</div>
                  <div className="user-info-full">
                    <span className="user-name">Anonymous User</span>
                    <span className="user-id-full">{user?.principal}</span>
                  </div>
                </div>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item" onClick={() => navigator.clipboard.writeText(user?.principal)}>
                  Copy Principal ID
                </button>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="login-btn" onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
