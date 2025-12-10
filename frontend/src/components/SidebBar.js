import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('popular'); // Track active link
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleLinkClick = (linkName, e) => {
    e.preventDefault(); // Prevent actual navigation in this example
    setActiveLink(linkName);
    
    // On mobile, close sidebar after selecting a link
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside (mobile only)
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

  // Auto-close sidebar on mobile when window resizes
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
      {/* Hamburger Toggle Button */}
      <div 
        ref={hamburgerRef}
        className={`sidebar-hamburger-container ${isSidebarOpen ? 'hamburger-with-sidebar-open' : 'hamburger-with-sidebar-closed'}`}
      >
        <button
          onClick={toggleSidebar}
          className="sidebar-hamburger-btn"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <svg className="sidebar-hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar-left ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="sidebar-content">
          {/* Main Navigation Links */}
          <nav className="sidebar-nav">
            <a 
              href="/" 
              className={`sidebar-link ${activeLink === 'home' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('home', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </a>
            <a 
              href="/popular" 
              className={`sidebar-link ${activeLink === 'popular' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('popular', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </a>
            <a 
              href="/explore" 
              className={`sidebar-link ${activeLink === 'explore' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('explore', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Explore
            </a>
            <a 
              href="/all" 
              className={`sidebar-link ${activeLink === 'all' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('all', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              All
            </a>
            <a 
              href="/create-community" 
              className={`sidebar-link ${activeLink === 'create-community' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('create-community', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Start a community
            </a>
          </nav>

          <hr className="sidebar-divider" />

          {/* CUSTOM FEEDS Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">CUSTOM FEEDS</div>
            <a 
              href="/custom-feeds" 
              className={`sidebar-link ${activeLink === 'custom-feeds' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('custom-feeds', e)}
            >
              <svg className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create Custom Feed
            </a>
          </div>

          <hr className="sidebar-divider" />

          {/* GAMES ON REDDIT Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">GAMES ON REDDIT</div>
            <button 
              className={`sidebar-game-item sidebar-new-game ${activeLink === 'syllo' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('syllo', e)}
            >
              <div className="sidebar-game-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)', color: 'white', fontSize: '14px', fontWeight: '700' }}>S</div>
              <div>
                <div className="sidebar-game-name">Syllo</div>
                <div className="sidebar-game-players">Merge syllables</div>
              </div>
              <span className="sidebar-new-badge">NEW</span>
            </button>
            <button 
              className={`sidebar-game-item ${activeLink === 'two-spies' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('two-spies', e)}
            >
              <div className="sidebar-game-icon" style={{ background: 'linear-gradient(135deg, #4ecdc4, #44a08d)', color: 'white' }}>TS</div>
              <div><div className="sidebar-game-name">Two Spies</div></div>
            </button>
            <button 
              className={`sidebar-game-item ${activeLink === 'word-city' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('word-city', e)}
            >
              <div className="sidebar-game-icon" style={{ background: 'linear-gradient(135deg, #ffd166, #ffb347)', color: '#1c1c1c' }}>WC</div>
              <div><div className="sidebar-game-name">Word City</div></div>
            </button>
            <button 
              className={`sidebar-game-item ${activeLink === 'farm-merge' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('farm-merge', e)}
            >
              <div className="sidebar-game-icon" style={{ background: 'linear-gradient(135deg, #06d6a0, #0cb577)', color: 'white' }}>FM</div>
              <div><div className="sidebar-game-name">Farm Merge Valley</div></div>
            </button>
            <button 
              className={`sidebar-game-item ${activeLink === 'discover-games' ? 'sidebar-active-link' : ''}`}
              onClick={(e) => handleLinkClick('discover-games', e)}
            >
              <div className="sidebar-game-icon" style={{ background: '#f6f7f8', color: '#878a8c', fontSize: '18px' }}>+</div>
              <div><div className="sidebar-game-name">Discover More Games</div></div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}