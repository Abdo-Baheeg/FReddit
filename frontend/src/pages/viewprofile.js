import React, { useState, useRef, useEffect } from 'react';
import './viewprofile.css';

export default function RedditProfilePageMock() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeView, setActiveView] = useState('top'); // 'top' or 'back'
  const [selectedTime, setSelectedTime] = useState('Today');
  
  // Separate state for each dropdown
  const [showOptions, setShowOptions] = useState({
    feed: false,
    comments: false
  });

  const optionsRef = useRef(null);
  const buttonRef = useRef(null);
  const commentsOptionsRef = useRef(null);
  const commentsButtonRef = useRef(null);
  const topBackButtonRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
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

  return (
    <div className="vpBody">

      {/* Main Layout Container (Flexbox) */}
      <div className="vpLayoutContainer">
        
        {/* Left Sidebar - Now part of the flow */}
        <aside className={`vpLeftSidebar ${isSidebarOpen ? 'vpSidebarOpen' : 'vpSidebarClosed'}`}>
          <div className="vpSidebarContent">
            {/* Navigation */}
            <nav className="vpSidebarNav">
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/></svg>
                Home
              </a>
              <a href="#" className="vpSidebarLink vpActiveLink">
                <svg className="vpSidebarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-2-5h4v-2H8v2zm-4-4h10v-2H4v2zm2-4h6V5H6v2z"/></svg>
                Popular
              </a>
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/></svg>
                Answers <span className="vpBetaTag">BETA</span>
              </a>
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/></svg>
                Explore
              </a>
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 20a10 10 0 110-20 10 10 0 0110 20zm-5.5-8.5l4.5-4.5 4.5 4.5L16 10l-6-6-6 6 1.5 1.5z"/></svg>
                All
              </a>
              <a href="#" className="vpSidebarLink vpCreateCommunity">
                <svg className="vpSidebarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                Start a community
              </a>
            </nav>

            <hr className="vpSidebarDivider" />

            {/* Games Section */}
            <div className="vpSidebarSection">
              <div className="vpSidebarSectionTitle">GAMES ON REDDIT</div>
              <div className="vpGameItem vpNewGame">
                <div className="vpGameIcon">Pocket Grids</div>
                <div>
                  <div className="vpGameName">Daily mini crosswords</div>
                  <div className="vpGamePlayers">80K monthly players</div>
                </div>
                <span className="vpNewBadge">NEW</span>
              </div>
              <div className="vpGameItem">
                <div className="vpGameIcon">HC</div>
                <div><div className="vpGameName">Hot and Cold</div></div>
              </div>
              <div className="vpGameItem">
                <div className="vpGameIcon">FM</div>
                <div><div className="vpGameName">Farm Merge Valley</div></div>
              </div>
              <div className="vpGameItem">
                <div className="vpGameIcon">NG</div>
                <div><div className="vpGameName">Ninigrams</div></div>
              </div>
              <div className="vpGameItem">
                <div className="vpGameIcon">+</div>
                <div><div className="vpGameName">Discover More Games</div></div>
              </div>
            </div>
            
            <hr className="vpSidebarDivider" />

            <div className="vpSidebarSection">
              <div className="vpSidebarSectionTitle">CUSTOM FEEDS</div>
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                Create Custom Feed
              </a>
            </div>

             <hr className="vpSidebarDivider" />

            <div className="vpSidebarSection">
              <div className="vpSidebarSectionTitle">COMMUNITIES</div>
              <a href="#" className="vpSidebarLink">
                <svg className="vpSidebarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Manage Communities
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Shifts when sidebar opens */}
        <div className="vpPageContentWrapper">
          
          {/* Hamburger Button - Inside content wrapper so it moves with content */}
          <div className="vpHamburgerContainer">
            <button onClick={toggleSidebar} className="vpHamburgerBtnNew" aria-label="Open menu">
              <svg className="vpHamburgerIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="vpPageContent">
            <main className="vpMain">
              <div className="vpBanner" />

              <div className="vpProfileInfo">
                <div className="vpAvatarLarge">
                  <img
                    src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                    alt="avatar"
                  />
                </div>
                <div className="vpNameSection">
                  <h1 className="vpUsername">Tough-Sherbert-2286</h1>
                  <p className="vpHandle">u/Tough-Sherbert-2286</p>
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
                    <div className="vpShowContent">
                      <span className="vpEyeIcon">👁️</span>
                      <span className="vpText">Showing all content</span>
                      <span className="vpShowArrow"> > </span>
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
                            New <span>></span>
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
                    <button className="vpCreatePostBtn">
                      <span>+</span> Create Post
                    </button>
                    
                    {/* Arrow button with relative positioning for dropdown */}
                    <div className="vpFeedButtonWrapper" style={{position: 'relative', display: 'inline-block'}}>
                      <button 
                        ref={buttonRef}
                        className="vpfeedBtn"
                        onClick={toggleFeedOptions}
                      >
                        <span>-></span>
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
        {/* اضغط على النص */}
        <span 
          className="time-option-label"
          onClick={() => handleTimeSelect(time.value)}
        >
          {time.label}
        </span>

        {/* اضغط على الدائرة */}
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
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>You don't have any posts yet</b></h2>
                      <p>Once you post to a community, it'll show up here.</p>
                      <button className="vpUpdateSettingsBtn">Update Settings</button>
                    </div>
                  )}

                  {activeTab === 'Posts' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                       <h2><b>You don't have any posts yet</b></h2>
                      <p>Once you post to a community, it'll show up here.</p>
                      <button className="vpUpdateSettingsBtn">Update Settings</button>
                    </div>
                  )}

                  {activeTab === 'Comments' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>You don't have any Comments yet</b></h2>
                      <button className="vpUpdateSettingsBtn">Update Settings</button>
                    </div>
                  )}

                  {activeTab === 'Saved' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>Looks like you haven't saved anything yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'History' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>Looks like you haven't visited any posts yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'Hidden' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>You haven't hidden any posts</b></h2>
                    </div>
                  )}

                  {activeTab === 'Upvoted' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>You haven't upvoted anything yet</b></h2>
                    </div>
                  )}

                  {activeTab === 'Downvoted' && (
                    <div className="vpEmptyState">
                      <div className="vpEmptyRobot">
                        <img
                          src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
                          alt="Thinking Snoo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <h2><b>You haven't downvoted anything yet</b></h2>
                    </div>
                  )}

                </div>

              </div>
            </main>

            <aside className="vpRightSidebar">
              <div className="vpRightCard">
                <div className="Vpback">
                 <button className="vpBackBtn">🖼️</button>
                </div>

                <div className="vpRightHeader">
                  <div className="vpRightUsername">Tough-Sherbert-2286</div>
                </div>

                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    
                    <button className="vpSectionBtnSmall">Share</button>
                  </div>
                </div> 

                <div className="vpStatsGrid">
                  <div><div className="vpStatValue">0</div><div className="vpStatLabel">Followers</div></div>
                  <div><div className="vpStatValue">1</div><div className="vpStatLabel">Karma</div></div>
                  <div><div className="vpStatValue">0</div><div className="vpStatLabel">Contributions</div></div>
                  <div><div className="vpStatValue">1 m</div><div className="vpStatLabel">Reddit Age</div></div>
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
                      <button className="vpSectionBtn">View All</button>
                    </a>
                  </div>
                </div>

                <hr className="vpDivider" />

                {/* ================= PROFILE ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Profile</h4>
                    <button className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Customize your profile</span>
                </div>

                {/* ================= CURATE PROFILE ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Curate your profile</h4>
                    <button className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Manage what people see when they visit your profile</span>
                </div>

                {/* ================= AVATAR ================= */}
                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Avatar</h4>
                    <button className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Style your avatar</span>
                </div>

                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">
                    <h4>Mod Tools</h4>
                    <button className="vpSectionBtnSmall">Update</button>
                  </div>
                  <span className="vpSectionSubtitle">Style your avatar</span>
                </div>   

                <div className="vpSocialLinks">
                  <div className="vpSectionHeaderRow">
                    <h4><b>SOCIAL LINKS</b></h4>
                  </div>
                </div>

                <div className="vpProfileSection">
                  <div className="vpSectionHeaderRow">  
                    <button className="vpSectionBtnSmall">+ Add Social Link </button>
                  </div>
                </div> 

              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}