import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, postApi, membershipApi } from '../api';
import './viewprofile.css';

export default function RedditProfilePageMock() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeView, setActiveView] = useState('top'); // 'top' or 'back'
  const [selectedTime, setSelectedTime] = useState('Today');
  
  // User data
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Separate state for each dropdown
  const [showOptions, setShowOptions] = useState({
    feed: false,
    comments: false
  });

  // NEW: State for background image
  const [backgroundImage, setBackgroundImage] = useState(null);
  const fileInputRef = useRef(null);

  const optionsRef = useRef(null);
  const buttonRef = useRef(null);
  const commentsOptionsRef = useRef(null);
  const commentsButtonRef = useRef(null);
  const topBackButtonRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const userData = await userApi.getCurrentUser();
        setUser(userData);

        // Fetch user's posts
        const allPosts = await postApi.getAllPosts();
        const userPosts = allPosts.filter(post => post.author?._id === userData.id);
        setPosts(userPosts);

        // Fetch user's memberships
        const userMemberships = await membershipApi.getUserMemberships();
        setMemberships(userMemberships);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // NEW: Function to handle button click
  const handleBackgroundButtonClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };

  // NEW: Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's an image file
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }

      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  // NEW: Function to remove background image
  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleFeedOptions = () => {
    setShowOptions(prev => ({
      ...prev,
      feed: !prev.feed,
      comments: false
    }));
  };

  const toggleCommentsOptions = () => {
    setShowOptions(prev => ({
      ...prev,
      comments: !prev.comments,
      feed: false
    }));
  };

  const toggleView = () => {
    setActiveView(prev => prev === 'top' ? 'back' : 'top');
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setActiveView('top'); // Switch back to top view after selecting time
  };

  // Time options data
  const timeOptions = [
    { value: 'Now', label: 'Now' },
    { value: 'Today', label: 'Today' },
    { value: 'This Week', label: 'This Week' },
    { value: 'This Month', label: 'This Month' },
    { value: 'This Year', label: 'This Year' },
    { value: 'All Time', label: 'All Time' }
  ];

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if clicking outside feed dropdown
      const isOutsideFeed = showOptions.feed && 
        optionsRef.current && 
        !optionsRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target) &&
        topBackButtonRef.current && 
        !topBackButtonRef.current.contains(event.target);
      
      // Check if clicking outside comments dropdown
      const isOutsideComments = showOptions.comments && 
        commentsOptionsRef.current && 
        !commentsOptionsRef.current.contains(event.target) &&
        commentsButtonRef.current && 
        !commentsButtonRef.current.contains(event.target);

      if (isOutsideFeed || isOutsideComments) {
        setShowOptions({
          feed: false,
          comments: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions.feed, showOptions.comments]);

  if (loading) {
    return <div className="vpBody"><div className="loading">Loading profile...</div></div>;
  }

  if (error) {
    return <div className="vpBody"><div className="error">{error}</div></div>;
  }

  if (!user) {
    return <div className="vpBody"><div className="error">User not found</div></div>;
  }

  return (
    <div className="vpBody">
      {/* Hidden file input for image selection */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    
      {/* Main Layout Container (Flexbox) */}
      <div className="vpLayoutContainer">
        
        {/* Main Content Area - Shifts when sidebar opens */}
        <div className="vpPageContentWrapper">
          
          <div className="vpPageContent">
            <main className="vpMain">
              <div className="vpBanner" />

              <div className="vpProfileInfo">
                <div className="vpAvatarLarge">
                  <img
                    src={user.imgURL || "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"}
                    alt="avatar"
                  />
                </div>
                <div className="vpNameSection">
                  <h1 className="vpUsername">{user.username}</h1>
                  <p className="vpHandle">u/{user.username}</p>
                  <p className="vpKarma">⭐ {user.karma || 0} karma</p>
                </div>
              </div>

              <div className="vpTabs">
                {['Overview', 'Posts', 'Comments', 'Saved', 'History', 'Hidden', 'Upvoted', 'Downvoted']
                  .map((tab) => (
                    <button
                      key={tab}
                      className={`vpTabBtn ${activeTab === tab ? 'vpActiveTab' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))
                }
              </div>

              <div className="vpContentArea">
                
                {/* Show "Showing all content" section only for Overview, Posts, and Comments tabs */}
                {(activeTab === 'Overview' || activeTab === 'Posts' || activeTab === 'Comments') && (
                  <div className="vpContentHeader">
                    <div 
                      className="vpShowContent"
                      onClick={() => window.location.href = '/setting'}
                    >
                      <span className="vpEyeIcon">👁️</span>
                      <span className="vpText">Showing all content</span>
                      <span className="vpShowArrow"> {'>'} </span>
                    </div>
                    
                    {activeTab === 'Comments' && (
                      <div className="vpCommentsHeaderRight">
                        {/* Comments dropdown wrapper */}
                        <div className="vpFeedButtonWrapper" style={{position: 'relative', display: 'inline-block'}}>
                          <button 
                            ref={commentsButtonRef}
                            className="vpNewButton"
                            onClick={toggleCommentsOptions}
                          >
                            New <span>{'>'}</span>
                          </button>
                          
                          {/* Comments options dropdown menu */}
                          {showOptions.comments && (
                            <div 
                              ref={commentsOptionsRef}
                              className="feed-options-bar"
                            >
                              <div className="feed-options-header">Sort by</div>
                              <div className="feed-options-list">
                                <div className="feed-option-item">
                                  <span className="feed-option-icon">🔥</span>
                                  <span className="feed-option-text">Hot</span>
                                </div>
                                <div className="feed-option-item feed-option-active">
                                  <span className="feed-option-icon">🆕</span>
                                  <span className="feed-option-text">New</span>
                                </div>
                                <div className="feed-option-item">
                                  <span className="feed-option-icon">📈</span>
                                  <span className="feed-option-text">Top</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Show buttons container only for Overview and Posts tabs */}
                {(activeTab === 'Overview' || activeTab === 'Posts') && (
                  <div className="vpButtonsContainer">
                    <button onClick={() => window.location.href = '/createpost'}
                    className="vpCreatePostBtn">
                      
                      <span>+</span> Create Post
                    </button>
                    
                    {/* Arrow button with relative positioning for dropdown */}
                    <div className="vpFeedButtonWrapper" style={{position: 'relative', display: 'inline-block'}}>
                      <button 
                        ref={buttonRef}
                        className="vpfeedBtn"
                        onClick={toggleFeedOptions}
                      >
                        <span>{'->'}</span>
                      </button>
                      
                      {/* Options dropdown menu - appears next to the button */}
                      {showOptions.feed && (
                        <div 
                          ref={optionsRef}
                          className="feed-options-bar"
                        >
                          <div className="feed-options-header">Feed options</div>
                          <div className="feed-options-list">
                            <div className="feed-option-item">
                              <span className="feed-option-icon">🔥</span>
                              <span className="feed-option-text">Hot</span>
                            </div>
                            <div className="feed-option-item">
                              <span className="feed-option-icon">🆕</span>
                              <span className="feed-option-text">New</span>
                            </div>
                            {/* Top/Back Toggle Button */}
                            <div 
                              ref={topBackButtonRef}
                              className={`feed-option-item toggle-button ${activeView === 'back' ? 'top-back-active' : ''}`}
                              onClick={toggleView}
                            >
                              {activeView === 'top' ? (
                                <>
                                  <span className="feed-option-icon">📈</span>
                                  <span className="feed-option-text">Top</span>
                                </>
                              ) : (
                                <>
                                  <span className="feed-option-icon">←</span>
                                  <span className="feed-option-text">Back</span>
                                </>
                              )}
                            </div>

                            {/* Time Filter Options - Only show when in "Back" mode */}
                            {activeView === 'back' && (
                              <div className="time-options">
                                {timeOptions.map((time) => (
                                  <div 
                                    key={time.value}
                                    className={`time-option ${selectedTime === time.value ? 'time-option-selected' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <span 
                                      className="time-option-label"
                                      onClick={() => handleTimeSelect(time.value)}
                                    >
                                      {time.label}
                                    </span>

                                    <span 
                                      className="time-option-circle"
                                      onClick={() => handleTimeSelect(time.value)}
                                    ></span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="feed-options-header">View</div>
                            <div className="feed-option-item">
                              <span className="feed-option-icon">🃏</span>
                              <span className="feed-option-text">Card</span>
                            </div>
                            <div className="feed-option-item">
                              <span className="feed-option-icon">📋</span>
                              <span className="feed-option-text">Compact</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="vpTabContent">

                  {activeTab === 'Overview' && (
                    <div>
                      {posts.length === 0 ? (
                        <div className="vpEmptyState">
                          <div className="vpEmptyRobot">
                            <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                          <h2><b>You don't have any posts yet</b></h2>
                          <p>Once you post to a community, it'll show up here.</p>
                           <button onClick={() => window.location.href = '/setting'}
                       className="vpUpdateSettingsBtn">Update Settings</button>
                        </div>
                      ) : (
                        <div className="vpPostsList">
                          {posts.map(post => (
                            <div key={post._id} className="vpPostCard" onClick={() => navigate(`/post/${post._id}`)}>
                              <div className="vpPostHeader">
                                <span className="vpCommunity">r/{post.community?.name || post.subreddit}</span>
                                <span className="vpPostTime"> • {new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h3 className="vpPostTitle">{post.title}</h3>
                              <p className="vpPostContent">{post.content?.substring(0, 200)}{post.content?.length > 200 ? '...' : ''}</p>
                              <div className="vpPostFooter">
                                <span>↑ {post.upvoteCount || 0}</span>
                                <span>↓ {post.downvoteCount || 0}</span>
                                <span>💬 {post.comments?.length || 0} comments</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Posts' && (
                    <div>
                      {posts.length === 0 ? (
                        <div className="vpEmptyState">
                          <div className="vpEmptyRobot">
                      <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                          <h2><b>You don't have any posts yet</b></h2>
                          <p>Once you post to a community, it'll show up here.</p>
                           <button onClick={() => window.location.href = '/setting'}
                       className="vpUpdateSettingsBtn">Update Settings</button>
                        </div>
                        
                      ) : (
                        <div className="vpPostsList">
                          {posts.map(post => (
                            <div key={post._id} className="vpPostCard" onClick={() => navigate(`/post/${post._id}`)}>
                              <div className="vpPostHeader">
                                <span className="vpCommunity">r/{post.community?.name || post.subreddit}</span>
                                <span className="vpPostTime"> • {new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h3 className="vpPostTitle">{post.title}</h3>
                              <p className="vpPostContent">{post.content?.substring(0, 200)}{post.content?.length > 200 ? '...' : ''}</p>
                              <div className="vpPostFooter">
                                <span>↑ {post.upvoteCount || 0}</span>
                                <span>↓ {post.downvoteCount || 0}</span>
                                <span>💬 {post.comments?.length || 0} comments</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Comments' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>You don't have any Comments yet</b></h2>
                      <button onClick={() => window.location.href = '/setting'}
                       className="vpUpdateSettingsBtn">Update Settings</button>
                    </div>
                  )}

                  {activeTab === 'Saved' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>Looks like you haven't saved anything yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'History' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                         <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>Looks like you haven't visited any posts yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'Hidden' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>You haven't hidden any posts</b></h2>
                    </div>
                  )}

                  {activeTab === 'Upvoted' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                      <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>You haven't upvoted anything yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'Downvoted' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                       <img
                       src="/images/robot.png"
                       width={162}
                       height={162}
                       />
                      </div>
                      <h2><b>You haven't downvoted anything yet</b></h2>
                    </div>
                  )}

                </div>

              </div>
            </main>
{/****************************************Right sidebar******************************************************/}
            <aside className="vpRightSidebar">
              <div className="vpRightCard">
                <div className="Vpback" style={{
                  position: 'relative',
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                  backgroundColor: backgroundImage ? 'transparent' : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  
                  ...(!backgroundImage && {
                    backgroundImage: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
                  })
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    display: 'flex',
                    gap: '5px'
                  }}>
                    <button 
                      onClick={handleBackgroundButtonClick}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: backgroundImage ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                        border: backgroundImage ? '2px solid white' : '2px solid rgba(255,255,255,0.5)',
                        color: backgroundImage ? 'white' : 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        padding: 0,
                        backdropFilter: 'blur(2px)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = backgroundImage ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.4)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = backgroundImage ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.3)';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title={backgroundImage ? "Change background" : "Add background"}
                    >
                      {backgroundImage ? '✏️' : '🖼️'}
                    </button>
                    
                    {backgroundImage && (
                      <button 
                        onClick={removeBackgroundImage}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(220, 53, 69, 0.7)',
                          border: '2px solid white',
                          color: 'white',
                          fontSize: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                          padding: 0,
                          backdropFilter: 'blur(2px)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.7)';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="Remove background"
                      >
                        ❌
                      </button>
                    )}
                  </div>

                  {!backgroundImage && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      textAlign: 'center',
                      fontWeight: '500',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      pointerEvents: 'none'
                    }}>
                      Click the icon to add background
                    </div>
                  )}
                </div>

                <div className="vpRightHeader">

                  <div className="vpRightUsername">{user.username}

                     <div className="vpSectionHeaderRow">
                    <button className="vpSectionBtnSmall" 
                onClick={() => {navigator.clipboard.writeText(window.location.href); alert("Link Copied!");}}>
                   Share
                    </button>
                  </div>
                  </div>
                  
                </div>

            

                <div className="vpStatsGrid">
                  <div><div className="vpStatValue">1</div><div className="vpStatLabel">Karma</div></div>
                  <div><div className="vpStatValue">0</div><div className="vpStatLabel">Contributions</div></div>
                  <div><div className="vpStatValue">1 m</div><div className="vpStatLabel">Reddit Age</div></div>

                  <div>
                    <div className="vpStatValue">0</div> 
                  <button onClick={() => window.location.href = '/setting'}
                  className="vpStatLabel">Actived in >
                  </button>
                  </div>
                   <div><div className="vpStatValue">0</div><div className="vpStatLabel">Gold earned</div></div>
                </div>

                <hr className="vpDivider" />

                <div className="vpAchievements">
                  <h4>ACHIEVEMENTS</h4>
                  <div className="vpAchievementsRow">
                    <img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" alt="Banana Baby" />
                    <img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" alt="Feed Finder" />
                    <img src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" alt="Joined Reddit" />
                    <span className="vpMoreAchievements">+1 more</span>
                  </div>

                  <div className="vpAchievementsCount">
                    4 unlocked 
                    <a href="#" className="vpViewAll">
                      <button onClick={() => window.location.href = '/achievement'}
                      className="vpSectionBtn">View All
                      </button>
                    </a>
                  </div>
                </div>

                <hr className="vpDivider" />

                {/* ================= PROFILE ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Profile</h4>
                    <button onClick={() => window.location.href = '/setting'}
                    className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Customize your profile</span>
                </div>

                {/* ================= CURATE PROFILE ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Curate your profile</h4>
                    <button onClick={() => window.location.href = '/setting'}
                     className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Manage what people see when they visit your profile</span>
                </div>

                {/* ================= AVATAR ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Avatar</h4>
                    <button onClick={() => window.location.href = '/setting'}
                    className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Style your avatar</span>
                </div>

                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Mod Tools</h4>
                    <button onClick={() => window.location.href = '/setting'}
                    className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Style your avatar</span>
                </div>   


                <div className="vpSocialLinks">
                  <div className="vpSectionHeaderRow">
                    <h4><b>SOCIAL LINKS</b></h4>
                  </div>
                  <button onClick={() => window.location.href = '/setting'}
                   className="vpSectionBtnSmall">+ Add Social Link </button>
                </div>   

              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}