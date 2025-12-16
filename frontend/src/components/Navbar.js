import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import Login from '../pages/Login_windows/Login';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  
  // Menus & Modals
  const [showAppModal, setShowAppModal] = useState(false);
  const [showDotMenu, setShowDotMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const dotMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  // --- HANDLERS ---
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleAskAi = () => navigate('/ask-ai');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate('/');
    window.location.reload();
  };

  // --- AUTH & EVENT LISTENERS ---
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      if(token) setIsLoggedIn(true);
      setLoading(false);
    };
    checkAuthStatus();
    window.addEventListener('storage', (e) => {
      if (e.key === 'token' || e.key === 'user') checkAuthStatus();
    });
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowAppModal(false);
        setShowDotMenu(false);
        setShowUserMenu(false);
        setShowCreateMenu(false);
      }
    };
    
    if (showAppModal || showDotMenu || showUserMenu || showCreateMenu) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAppModal, showDotMenu, showUserMenu, showCreateMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(event.target)) {
        setShowDotMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { unreadCounts = {} } = useSocket() || {};
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + (Number(count) || 0), 0);

  if (loading) return null;

  return (
    <div className={`vpBody ${isDarkMode ? 'vpDarkMode' : ''}`}>
      <header className="vpNewTopBar">
        <div className="vpTopBarContainer">
          
          {/* LOGO */}
          <div className="vpLogoNew" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} title="Go to Home">
            <span className="vpLogoTextNew">reddit</span>
          </div>

          {/* SEARCH BAR */}
          <div className="vpSearchContainer">
            <div className="vpSearchWrapper">
              <div className="vpSearchLogoContainer">
                <img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" alt="Reddit Logo" className="vpSearchLogoIcon"/>
              </div>
              <input
                type="text"
                placeholder="Find anything"
                className="vpSearchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <div className="vpAskContainer">
                <div className="vpAskSeparator"></div>
                <button className="vpAskButton" onClick={handleAskAi}>
                  <svg className="vpAskIcon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.11 14.41 11.08 13.53 11.64L12 13L10.47 11.64C9.59 11.08 9 10.11 9 9C9 7.34 10.34 6 12 6ZM12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18Z" fill="#FF4500"/>
                    <circle cx="12" cy="12" r="10" stroke="#FF4500" strokeWidth="2" fill="none"/> 
                    <path d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" fill="currentColor" fillOpacity="0.2"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#FF4500"/>
                  </svg>
                  <span>Ask</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          {!isLoggedIn ? (
            /* --- LOGGED OUT VIEW --- */
            <>
              <button className="vpGetAppBtn" onClick={() => setShowAppModal(true)}>Get App</button>
              <div className="vpRightIcons">
                 <button className="vpIconBtn" onClick={toggleTheme}>
                  {isDarkMode ? 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> 
                    : 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  }
                 </button>
                 <button className="vpLoginBtn" onClick={() => setIsLoginOpen(true)}>Log In</button>
                 
                 {/* Dot Menu (Logged Out) - UPDATED WITH ICONS FROM IMAGE */}
                 <div className="vpDotMenuContainer" ref={dotMenuRef}>
                    <button className="vpdotBtn" onClick={() => setShowDotMenu(!showDotMenu)}><b>•••</b></button>
                    {showDotMenu && (
                      <div className="vpDotDropdown">
                        <button onClick={() => setIsLoginOpen(true)} className="vpDotDropItem">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
                           Log In / Sign Up
                        </button>
                        <button onClick={() => navigate('/ads')} className="vpDotDropItem">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                           Advertise on Reddit
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            </>
          ) : (
            /* --- LOGGED IN VIEW --- */
            <div className="vpRightIcons">
            <button 
              className="vpIconBtn" 
              aria-label="Advertise"
              onClick={() => window.open('https://ads.reddit.com', '_blank')}
              title="Advertise on Reddit"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9.75 14h-1.5v-7.5h1.5V17zm-.75-8.5a.75.75 0 110-1.5.75.75 0 010 1.5zm6.5 8.5h-1.5v-4.75c0-1.24-.56-1.95-1.58-1.95-.88 0-1.42.59-1.42 1.95V17h-1.5v-7.5h1.5v1.03c.2-.62.95-1.28 2.03-1.28 1.48 0 2.47 1.01 2.47 3.22V17z"/>
              </svg>
              <span className="vpAdLabel">AD</span>
            </button>

            <button 
              className="vpIconBtn" 
              aria-label="Chat"
              onClick={() => navigate('/chat')}
              title="Chat"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 12H6v-1h12v1zm0-3H6V9h12v2zm0-3H6V5h12v2z"/>
              </svg>
            </button>

            <button 
              className="vpCreateBtnNew" 
              aria-label="Create"
              onClick={() => navigate('/createpost')}
              title="Create a post"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>

            <button 
              className="vpIconBtn" 
              aria-label="Notifications" 
              title={totalUnread > 0 ? `${totalUnread} unread notifications` : 'Notifications'}
              onClick={() => navigate('/notifications')}
              style={{ position: 'relative' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {totalUnread > 0 && <span className="vpNotifBadge">{totalUnread}</span>}
            </button>

            {/* User Avatar with Dropdown Menu */}
            <div className="vpUserMenuContainer" ref={userMenuRef}>
              <div 
                className="vpUserAvatarNew" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Click for options"
              >
                <img
                  src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                  alt="User"
                  className="vpAvatarImg"
                />
                <div className="vpOnlineIndicator"></div>
              </div>
              
              {showUserMenu && (
                <div className="vpUserDropdown">
                  <div className="vpUserDropdownHeader">
                    <div className="vpUserDropdownAvatar">
                      <img
                        src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                        alt="User"
                      />
                      <div className="vpUserDropdownOnline"></div>
                    </div>
                    <div className="vpUserDropdownInfo">
                      <div className="vpUserDropdownName">
                        {JSON.parse(localStorage.getItem('user') || '{}').username || 'User'}
                      </div>
                      <div className="vpUserDropdownEmail">
                        {JSON.parse(localStorage.getItem('user') || '{}').email || ''}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="vpUserDropdownItem" 
                    onClick={() => { navigate('/viewprofile'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>View Profile</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { setShowUserMenu(false); /* Add edit avatar functionality */ }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"/>
                    </svg>
                    <span>Edit Avatar</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/drafts'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <path d="M14 2v6h6M16 13H8m8 4H8"/>
                    </svg>
                    <span>Drafts</span>
                  </button>
                
                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/achievements'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 010-5H6m12 5h1.5a2.5 2.5 0 000-5H18M6 9v12m12-12v12M6 15h12M6 21h12"/>
                    </svg>
                    <span>Achievements</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/earn'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>Earn</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/premium'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Premium</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { toggleTheme(); setShowUserMenu(false); }}
                  >
                    {isDarkMode ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    )}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                     
                  <button 
                    className="vpUserDropdownItem vpUserDropdownItemLogout" 
                    onClick={handleLogout}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    <span>Log Out</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                  
                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { window.open('https://ads.reddit.com', '_blank'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                    </svg>
                    <span>Advertise on Reddit</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/pro'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <span>Try Reddit Pro BETA</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                  
                  <button 
                    className="vpUserDropdownItem" 
                    onClick={() => { navigate('/setting'); setShowUserMenu(false); }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                    <span>Settings</span>
                  </button>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal for Get App */}
      {showAppModal && (
        <div className="vpModalOverlay" onClick={() => setShowAppModal(false)}>
          <div className="vpModalContent" onClick={(e) => e.stopPropagation()}>
            <button
              className="vpModalClose"
              onClick={() => setShowAppModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="vpModalImageContainer">
              <h1>Get the Reddit app</h1>
              <p>Scan this QR code to download the app now</p>
              <img
                src={process.env.PUBLIC_URL + "/images/Qr.png"}
                alt="QR Code"
                className="vpModalImage"
              />
              <p>Or check it out in the app stores</p>
              <div className="vpModalText">
                <div className="vpAppStores">
                  <button 
                    className="vpAppStoreBtn"
                    onClick={() => window.open('https://apps.apple.com/us-app/reddit/id1064216828', '_blank')}
                  >
                    <span className="vpAppStoreText">Download on the App Store</span>
                  </button>
                  <button 
                    className="vpPlayStoreBtn"
                    onClick={() => window.open('https://play.google.com/store/apps/details?id=com.reddit.frontpage&pli=1', '_blank')}
                  >
                    <span className="vpPlayStoreText">GET IT ON Google Play</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <Login 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
        />
      )}
    </div>
  );
};

export default Navbar;