import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './Navbar.css';
import Login from '../pages/Login_windows/Login';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAppModal, setShowAppModal] = useState(false);
  
  const [showDotMenu, setShowDotMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dotMenuRef = useRef(null);
  const userMenuRef = useRef(null);


  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsResetOpen(false);
  };
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Checking auth status:', { token, user });
      if(token) setIsLoggedIn(true);
      setLoading(false);
    };

    checkAuthStatus();

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowAppModal(false);
        setShowDotMenu(false);
        setShowUserMenu(false);
      }
    };
    
    if (showAppModal || showDotMenu || showUserMenu) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAppModal, showDotMenu, showUserMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(event.target)) {
        setShowDotMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { unreadCounts = {} } = useSocket() || {};

  const handleLogout = () => {
    console.log('Logging out...');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    setIsLoggedIn(false);
    setShowUserMenu(false);
    
    navigate('/');
    window.location.reload();
  };


  const handleViewProfile = () => {
    setShowUserMenu(false);
    // Navigate to external URL
    window.location.href = 'http://localhost:3001/viewprofile#';
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    // Navigate to external URL
    window.location.href = 'http://localhost:3001/setting#';
  };

  const totalUnread = Object.values(unreadCounts).reduce(
    (sum, count) => sum + (Number(count) || 0),
    0
  );

  if (loading) {
    return (
      <div className="vpBody">
        <header className="vpNewTopBar">
          <div className="vpTopBarContainer">
            <div className="vpLogoNew">
              <img
                src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                alt="Reddit"
                className="vpLogoIcon"
              />
              <span className="vpLogoTextNew">reddit</span>
            </div>
            <div className="vpSearchContainer">
              <div className="vpSearchWrapper">
                <input
                  type="text"
                  placeholder="Loading..."
                  className="vpSearchInput"
                  disabled
                />
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="vpBody">
        <header className="vpNewTopBar">
          <div className="vpTopBarContainer">
            <div className="vpLogoNew">
              <img
                src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                alt="Reddit"
                className="vpLogoIcon"
              />
              <span className="vpLogoTextNew">reddit</span>
            </div>

            <div className="vpSearchContainer">
              <div className="vpSearchWrapper">
                <svg className="vpSearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Find anything"
                  className="vpSearchInput"
                />
              </div>
            </div>

            <button 
              className="vpGetAppBtn" 
              onClick={() => setShowAppModal(true)}
            >
              Get App
            </button>

            <div className="vpRightIcons">
              
                <button className="vpLoginBtn" onClick={() => setIsLoginOpen(true)}>Log In</button>
              {/* Modal */}
             {isLoginOpen && <Login setOpen={setIsLoginOpen} />}

              <div className="vpDotMenuContainer" ref={dotMenuRef}>
                <button 
                  className="vpdotBtn" 
                  onClick={() => setShowDotMenu(!showDotMenu)}
                >
                  <b>•••</b>
                </button>
                
                {showDotMenu && (
                  <div className="vpDotDropdown">
                    <Link to="/login" className="vpDotDropdownItem" style={{ textDecoration: "none", color: "inherit" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      <span>Log in / Sign up</span>
                    </Link>
                    
                    <div className="vpDotDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                      </svg>
                      <span>Advertise on Reddit</span>
                    </div>
                    
                    <div className="vpDotDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 5a9 9 0 019 9M4 5v9h9M4 5l7 7"/>
                        <path d="M20 5a9 9 0 01-9 9M20 5v9h-9M20 5l-7 7"/>
                      </svg>
                      <span>Try Reddit Pro Beta</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal لعرض صورة Get App */}
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
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.reddit.frontpage&pli=1')}
                    >
                      <span className="vpPlayStoreText">GET IT ON Google Play</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="vpBody">
      <header className="vpNewTopBar">
        <div className="vpTopBarContainer">
          <div className="vpLogoNew">
            <img
              src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
              alt="Reddit"
              className="vpLogoIcon"
            />
            <span className="vpLogoTextNew">reddit</span>
          </div>

          <div className="vpSearchContainer">
            <div className="vpSearchWrapper">
              <svg className="vpSearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search Reddit" className="vpSearchInput" />
            </div>
          </div>

          <div className="vpRightIcons">
            <button 
              className="vpIconBtn" 
              aria-label="Advertise"
              onClick={() => navigate('/ads')} // Added navigation handler
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9.75 14h-1.5v-7.5h1.5V17zm-.75-8.5a.75.75 0 110-1.5.75.75 0 010 1.5zm6.5 8.5h-1.5v-4.75c0-1.24-.56-1.95-1.58-1.95-.88 0-1.42.59-1.42 1.95V17h-1.5v-7.5h1.5v1.03c.2-.62.95-1.28 2.03-1.28 1.48 0 2.47 1.01 2.47 3.22V17z"/>
              </svg>
              <span className="vpAdLabel">AD</span>
            </button>

            <button className="vpIconBtn" aria-label="Chat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 12H6v-1h12v1zm0-3H6V9h12v2zm0-3H6V5h12v2z"/>
              </svg>
            </button>

            <button 
              className="vpCreateBtnNew" 
              aria-label="Create"
              onClick={() => navigate('/createpost')} // Added navigation handler
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>

            <button 
              className="vpIconBtn" 
              aria-label="Notifications" 
              title={`${totalUnread} unread`}
              onClick={() => navigate('/notifications')} // Added navigation handler
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
                        <button 
                    className="vpUserDropdownItem" 
                    onClick={handleViewProfile}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'right' }}
                  >
                    <span>View Profile</span>
                  </button>
                      </div>

                    </div>
                  </div>
                  
                  <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Edit Avatar</span>
                    </div>

                  <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Drafts</span>
                    </div>
                
                      <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Achievements</span>
                    </div>

                      <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Earn</span>
                    </div>

                      <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Premium</span>
                    </div>

                     <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Dark Mode </span>
                    </div>

                     
                  <button 
                    className="vpUserDropdownItem vpUserDropdownItemLogout" 
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                  
                   <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Advertise on Reddit</span>
                    </div>

                     <div className="vpUserDropdownItem">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                      <span>Try Reddin Pro BETA</span>
                    </div>

                  <div className="vpUserDropdownDivider"></div>
                  <button 
                    className="vpUserDropdownItem" 
                    onClick={handleSettings}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
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
        </div>
      </header>

      {/* Modal لعرض صورة Get App */}
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
                    onClick={() => window.open('https://play.google.com/store/apps/details?id=com.reddit.frontpage&pli=1')}
                  >
                    <span className="vpPlayStoreText">GET IT ON Google Play</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;