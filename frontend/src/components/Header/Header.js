import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="Header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
      <div className="logo-circle">
        <span style={{ fontSize: '20px' }}>F</span>
      </div>
      <div className="logo-text">
        FReddit
      </div>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div id="Header-searchbar">
      <input type="search" placeholder="Search FReddit" />
    </div>
  );
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    setIsOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div id="Header-icons">
        <button 
          id="login-button" 
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
        <button 
          id="get-app-btn"
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="user-menu-container">
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          <span>👤</span>
        </div>
        <span className="user-menu-caret">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="user-menu-backdrop" onClick={() => setIsOpen(false)}></div>
          <div className="user-menu-dropdown">
            <div className="user-menu-header">
              <div className="user-avatar-large">
                <span>👤</span>
              </div>
              <div className="user-menu-info">
                <div className="user-menu-name">My Profile</div>
                <div className="user-menu-karma">View Profile</div>
              </div>
            </div>
            
            <div className="user-menu-divider"></div>
            
            <button className="user-menu-item" onClick={() => { navigate('/viewprofile'); setIsOpen(false); }}>
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button className="user-menu-item" onClick={() => { navigate('/create-post'); setIsOpen(false); }}>
              <span>➕</span>
              <span>Create Post</span>
            </button>
            <button className="user-menu-item" onClick={() => { navigate('/chat'); setIsOpen(false); }}>
              <span>💬</span>
              <span>Messages</span>
            </button>
            <button className="user-menu-item" onClick={() => { navigate('/setting'); setIsOpen(false); }}>
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            
            <div className="user-menu-divider"></div>
            
            <button className="user-menu-item user-menu-item-danger" onClick={handleLogout}>
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

function Header() {
  return (
    <div id="Header-container">
      <Logo />
      <SearchBar />
      <UserMenu />
    </div>
  );
}

export default Header;

