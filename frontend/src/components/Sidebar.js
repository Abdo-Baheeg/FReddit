import React, { useState, useEffect, useRef } from 'react';
import './sideBar.css';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768) {
        if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Auto-close on mobile when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <div className="sidebar-hamburger-container">
        <button
          ref={hamburgerRef}
          onClick={toggleSidebar}
          className="sidebar-hamburger-btn"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <svg className="sidebar-hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar-left ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="sidebar-content">
          {/* Navigation */}
          <nav className="sidebar-nav">
            <a href="/" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/>
              </svg>
              Home
            </a>
            <a href="/popular" className="sidebar-link sidebar-active-link">
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-2-5h4v-2H8v2zm-4-4h10v-2H4v2zm2-4h6V5H6v2z"/>
              </svg>
              Popular
            </a>
            <a href="/answers" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/>
              </svg>
              Answers <span className="sidebar-beta-tag">BETA</span>
            </a>
            <a href="/explore" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/>
              </svg>
              Explore
            </a>
            <a href="/all" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/>
              </svg>
              All
            </a>
            <a href="/create-community" className="sidebar-link sidebar-create-community">
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Start a community
            </a>
          </nav>

          <hr className="sidebar-divider" />

          {/* Games Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">GAMES ON REDDIT</div>
            <div className="sidebar-game-item sidebar-new-game">
              <div className="sidebar-game-icon">Pocket Grids</div>
              <div>
                <div className="sidebar-game-name">Daily mini crosswords</div>
                <div className="sidebar-game-players">80K monthly players</div>
              </div>
              <span className="sidebar-new-badge">NEW</span>
            </div>
            <div className="sidebar-game-item">
              <div className="sidebar-game-icon">HC</div>
              <div><div className="sidebar-game-name">Hot and Cold</div></div>
            </div>
            <div className="sidebar-game-item">
              <div className="sidebar-game-icon">FM</div>
              <div><div className="sidebar-game-name">Farm Merge Valley</div></div>
            </div>
            <div className="sidebar-game-item">
              <div className="sidebar-game-icon">NG</div>
              <div><div className="sidebar-game-name">Ninigrams</div></div>
            </div>
            <div className="sidebar-game-item">
              <div className="sidebar-game-icon">+</div>
              <div><div className="sidebar-game-name">Discover More Games</div></div>
            </div>
          </div>
          
          <hr className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-title">CUSTOM FEEDS</div>
            <a href="/custom-feeds" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Create Custom Feed
            </a>
          </div>

          <hr className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-title">COMMUNITIES</div>
            <a href="/manage-communities" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Manage Communities
            </a>
          </div>

          {/* User Communities (if logged in) */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">YOUR COMMUNITIES</div>
            <a href="/your-communities" className="sidebar-link">
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              Your Communities
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}