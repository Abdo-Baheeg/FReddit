import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { notificationApi, userApi } from '../api';
import { 
  Sparkles, Sun, Moon, LogIn, MessageSquare, Bell, Plus, 
  User, Settings, FileText, Award, Users, Star, Zap, LogOut, Briefcase
} from 'lucide-react';
import './Navbar.css';
import Login from '../pages/Login_windows/Login';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png');
  const [userKarma, setUserKarma] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  
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
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleAskAi = () => navigate("/ask-ai");
  
  const handleItemClick = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate("/");
    window.location.reload();
  };

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (isLoggedIn) {
        try {
          const { count } = await notificationApi.getUnreadCount();
          setNotificationCount(count);
        } catch (err) {
          console.error('Error fetching notification count:', err);
        }
      }
    };

    fetchNotificationCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // --- AUTH & EVENT LISTENERS ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if(token) {
        setIsLoggedIn(true);
        try {
          const user = await userApi.getCurrentUser();
          console.log('User data:', user);
          
          if(user) {
            setUsername(user.username);
            setUserEmail(user.email);
            setUserAvatar(user.avatar || user.profilePicture || 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png');
            setUserKarma(user.karma || user.totalKarma || 0);
            setPostCount(user.postCount || 0);
          }
        } catch(e) {
          console.error('Error fetching user data:', e);
          // If token is invalid, clear it
          if (e.response && e.response.status === 401) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
    window.addEventListener('storage', (e) => {
      if (e.key === 'token') checkAuthStatus();
    });
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowAppModal(false);
        setShowDotMenu(false);
        setShowUserMenu(false);
        setShowCreateMenu(false);
      }
    };

    if (showAppModal || showDotMenu || showUserMenu || showCreateMenu) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
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
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <div className={`vpBody ${isDarkMode ? "vpDarkMode" : ""}`}>
      <header className="vpNewTopBar">
        <div className="vpTopBarContainer">
          {/* LOGO */}
          <div
            className="vpLogoNew"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            title="Go to Home"
          >
            <span className="vpLogoTextNew">reddit</span>
          </div>

          {/* SEARCH BAR */}
          <div className="vpSearchContainer">
            <div className="vpSearchWrapper">
              <div className="vpSearchLogoContainer">
                <img
                  src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                  alt="Reddit Logo"
                  className="vpSearchLogoIcon"
                />
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
                  <Sparkles size={20} className="vpAskIcon" style={{ color: '#FF4500' }} />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          {!isLoggedIn ? (
            /* --- LOGGED OUT VIEW --- */
            <>
              <button
                className="vpGetAppBtn"
                onClick={() => setShowAppModal(true)}
              >
                Get App
              </button>
              <div className="vpRightIcons">
                 <button className="vpIconBtn" onClick={toggleTheme}>
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 <button className="vpLoginBtn" onClick={() => setIsLoginOpen(true)}>Log In</button>
                 
                 {/* Dot Menu (Logged Out) - UPDATED WITH ICONS FROM IMAGE */}
                 <div className="vpDotMenuContainer" ref={dotMenuRef}>
                    <button className="vpdotBtn" onClick={() => setShowDotMenu(!showDotMenu)}><b>•••</b></button>
                    {showDotMenu && (
                      <div className="vpDotDropdown">
                        <button onClick={() => setIsLoginOpen(true)} className="vpDotDropItem">
                           <LogIn size={20} />
                           Log In / Sign Up
                        </button>
                        <button onClick={() => navigate('/ads')} className="vpDotDropItem">
                           <Briefcase size={20} />
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
              <MessageSquare size={20} />
            </button>

            <button 
              className="vpCreateBtnNew" 
              aria-label="Create"
              onClick={() => navigate('/createpost')}
              title="Create a post"
            >
              <Plus size={20} />
              Create
            </button>

            <button 
              className="vpIconBtn" 
              aria-label="Notifications" 
              title={notificationCount > 0 ? `${notificationCount} unread notifications` : 'Notifications'}
              onClick={() => navigate('/notifications')}
              style={{ position: 'relative' }}
            >
              <Bell size={20} />
              {notificationCount > 0 && <span className="vpNotifBadge">{notificationCount}</span>}
            </button>

            {/* User Avatar with Dropdown Menu */}
            <div className="vpUserMenuContainer" ref={userMenuRef}>
              <div 
                className="vpUserAvatarNew" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={`${username} - Click for options`}
              >
                <img
                  src={userAvatar}
                  alt={username}
                  className="vpAvatarImg"
                  onError={(e) => {
                    e.target.src = 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png';
                  }}
                />
                <div className="vpOnlineIndicator"></div>
              </div>
              
              {showUserMenu && (
                <div className="vpUserDropdown">
                  <div className="vpUserDropdownHeader" onClick={() => { navigate('/me'); setShowUserMenu(false); }}>
                    <div className="vpUserDropdownAvatar">
                      <img
                        src={userAvatar}
                        alt={username}
                        onError={(e) => {
                          e.target.src = 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png';
                        }}
                      />
                      <div className="vpUserDropdownOnline"></div>
                    </div>
                    <div className="vpUserDropdownInfo">
                      <div className="vpUserDropdownName">
                        u/{username}
                      </div>
                      <div className="vpUserDropdownEmail">
                        {userEmail}
                      </div>
                    </div>
                  </div>

                  <div className="vpUserDropdownStats">
                    <div className="vpUserDropdownStat">
                      <span className="vpUserDropdownStatValue">{userKarma.toLocaleString()}</span>
                      <span className="vpUserDropdownStatLabel">Karma</span>
                    </div>
                    <div className="vpUserDropdownStat">
                      <span className="vpUserDropdownStatValue">{postCount}</span>
                      <span className="vpUserDropdownStatLabel">Posts</span>
                    </div>
                  </div>
                  
                  <button 
                    className="vpUserDropdownItem" 
                    onClick={() => { navigate('/me'); setShowUserMenu(false); }}
                  >
                    <User size={20} />
                    <span>View Profile</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { 
                      navigate('/me/edit'); 
                      setShowUserMenu(false); 
                    }}
                  >
                    <Settings size={20} />
                    <span>Edit Avatar</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/drafts'); setShowUserMenu(false); }}
                  >
                    <FileText size={20} />
                    <span>Drafts</span>
                  </button>
                
                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/achievements'); setShowUserMenu(false); }}
                  >
                    <Award size={20} />
                    <span>Achievements</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/all'); setShowUserMenu(false); }}
                  >
                    <Users size={20} />
                    <span>View Communities</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/premium'); setShowUserMenu(false); }}
                  >
                    <Star size={20} />
                    <span>Premium</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { toggleTheme(); setShowUserMenu(false); }}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                     
                  <button 
                    className="vpUserDropdownItem vpUserDropdownItemLogout" 
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                  
                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { window.open('https://ads.reddit.com', '_blank'); setShowUserMenu(false); }}
                  >
                    <Briefcase size={20} />
                    <span>Advertise on Reddit</span>
                  </button>

                  <button 
                    className="vpUserDropdownItem"
                    onClick={() => { navigate('/pro'); setShowUserMenu(false); }}
                  >
                    <Zap size={20} />
                    <span>Try Reddit Pro BETA</span>
                  </button>

                  <div className="vpUserDropdownDivider"></div>
                  
                  <button 
                    className="vpUserDropdownItem" 
                    onClick={() => { navigate('/setting'); setShowUserMenu(false); }}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </div>)}

                {showUserMenu && (
                  <div className="vpUserDropdown">
                    <div className="vpUserDropdownHeader">
                      <div className="vpUserDropdownAvatar">
                        <img
                          src={userAvatar}
                          alt={username}
                          onError={(e) => {
                            e.target.src =
                              "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png";
                          }}
                        />
                        <div className="vpUserDropdownOnline"></div>
                      </div>
                      <div className="vpUserDropdownInfo">
                        <div className="vpUserDropdownName">u/{username}</div>
                        <div className="vpUserDropdownEmail">{userEmail}</div>
                      </div>
                    </div>

                    <div className="vpUserDropdownStats">
                      <div className="vpUserDropdownStat">
                        <span className="vpUserDropdownStatValue">
                          {userKarma.toLocaleString()}
                        </span>
                        <span className="vpUserDropdownStatLabel">Karma</span>
                      </div>
                      <div className="vpUserDropdownStat">
                        <span className="vpUserDropdownStatValue">
                          {postCount}
                        </span>
                        <span className="vpUserDropdownStatLabel">Posts</span>
                      </div>
                    </div>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/viewprofile");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>View Profile</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/viewprofile");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
                      </svg>
                      <span>Edit Avatar</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/drafts");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M16 13H8m8 4H8" />
                      </svg>
                      <span>Drafts</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/achievements");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 010-5H6m12 5h1.5a2.5 2.5 0 000-5H18M6 9v12m12-12v12M6 15h12M6 21h12" />
                      </svg>
                      <span>Achievements</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/all");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      <span>View Communities</span>
                    </button>

                    <div className="vpUserDropdownDivider"></div>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/premium");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>Premium</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        toggleTheme();
                        setShowUserMenu(false);
                      }}
                    >
                      {isDarkMode ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      )}
                      <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    <div className="vpUserDropdownDivider"></div>

                    <button
                      className="vpUserDropdownItem vpUserDropdownItemLogout"
                      onClick={handleLogout}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      <span>Log Out</span>
                    </button>

                    <div className="vpUserDropdownDivider"></div>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        window.open("https://ads.reddit.com", "_blank");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                      </svg>
                      <span>Adv</span>
                    </button>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/pro");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>Try Reddit Pro BETA</span>
                    </button>

                    <div className="vpUserDropdownDivider"></div>

                    <button
                      className="vpUserDropdownItem"
                      onClick={() => {
                        navigate("/setting");
                        setShowUserMenu(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
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
                    onClick={() =>
                      window.open(
                        "https://apps.apple.com/us-app/reddit/id1064216828",
                        "_blank"
                      )
                    }
                  >
                    <span className="vpAppStoreText">
                      Download on the App Store
                    </span>
                  </button>
                  <button
                    className="vpPlayStoreBtn"
                    onClick={() =>
                      window.open(
                        "https://play.google.com/store/apps/details?id=com.reddit.frontpage&pli=1",
                        "_blank"
                      )
                    }
                  >
                    <span className="vpPlayStoreText">
                      GET IT ON Google Play
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {isLoginOpen && <Login setOpen={setIsLoginOpen} />}
    </div>
  );
};

export default Navbar;
