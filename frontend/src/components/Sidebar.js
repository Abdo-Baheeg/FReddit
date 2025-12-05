import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside className={`reddit-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Home Section */}
        <div className="sidebar-section">
          <Link to="/" className="sidebar-item">
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-text">Home</span>
          </Link>
          <Link to="/create-post" className="sidebar-item">
            <span className="sidebar-icon">➕</span>
            <span className="sidebar-text">Create Post</span>
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        {/* Features Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-header">FEATURES</h3>
          <Link to="/chat" className="sidebar-item">
            <span className="sidebar-icon">💬</span>
            <span className="sidebar-text">Messages</span>
          </Link>
          <button className="sidebar-item" onClick={() => alert('Search coming soon!')}>
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-text">Search</span>
          </button>
          <button className="sidebar-item" onClick={() => alert('Notifications coming soon!')}>
            <span className="sidebar-icon">🔔</span>
            <span className="sidebar-text">Notifications</span>
          </button>
        </div>

        <div className="sidebar-divider"></div>

        {/* Communities Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-header">COMMUNITIES</h3>
          <button className="sidebar-item" onClick={() => alert('Create Community coming soon!')}>
            <span className="sidebar-icon">➕</span>
            <span className="sidebar-text">Create Community</span>
          </button>
          <Link to="/?filter=popular" className="sidebar-item">
            <span className="sidebar-icon">🔥</span>
            <span className="sidebar-text">Popular</span>
          </Link>
          <Link to="/?filter=all" className="sidebar-item">
            <span className="sidebar-icon">🌍</span>
            <span className="sidebar-text">All</span>
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        {/* Resources Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-header">RESOURCES</h3>
          <button className="sidebar-item" onClick={() => alert('About coming soon!')}>
            <span className="sidebar-icon">ℹ️</span>
            <span className="sidebar-text">About</span>
          </button>
          <button className="sidebar-item" onClick={() => alert('Help coming soon!')}>
            <span className="sidebar-icon">❓</span>
            <span className="sidebar-text">Help</span>
          </button>
          <Link to="/setting" className="sidebar-item">
            <span className="sidebar-icon">⚙️</span>
            <span className="sidebar-text">Settings</span>
          </Link>
        </div>

        {/* User Section at Bottom */}
        {isLoggedIn ? (
          <>
            <div className="sidebar-divider"></div>
            <div className="sidebar-section">
              <Link to="/viewprofile" className="sidebar-item">
                <span className="sidebar-icon">👤</span>
                <span className="sidebar-text">Profile</span>
              </Link>
              <button className="sidebar-item sidebar-item-danger" onClick={handleLogout}>
                <span className="sidebar-icon">🚪</span>
                <span className="sidebar-text">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar-divider"></div>
            <div className="sidebar-section">
              <Link to="/login" className="sidebar-item sidebar-item-primary">
                <span className="sidebar-icon">🔐</span>
                <span className="sidebar-text">Log In</span>
              </Link>
              <Link to="/register" className="sidebar-item">
                <span className="sidebar-icon">📝</span>
                <span className="sidebar-text">Sign Up</span>
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">© 2025 FReddit, Inc.</p>
          <p className="sidebar-footer-text">v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
