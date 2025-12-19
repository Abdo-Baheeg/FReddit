import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useCreateCommunity } from '../context/CreateCommunityContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {

  // State to manage the open/close status of the collapsible sections
  const [openSections, setOpenSections] = useState({
    games: true,
    customFeeds: true,
    recent: true,
    communities: true,
    resources: true,
  });

  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { openCreateCommunityModal } = useCreateCommunity();
  const navigate = useNavigate();

  // Fetch joined communities on mount
  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/communities/joined', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setJoinedCommunities(data);
        }
      } catch (error) {
        console.error('Error fetching joined communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedCommunities();
  }, []);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSidebarToggle = () => {
    setIsCollapsed?.(!isCollapsed);
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      {/* --- TOGGLE BUTTON --- */}
      <button className="sidebar-toggle-btn" onClick={handleSidebarToggle}>
        <svg viewBox="0 0 20 20" className="toggle-icon">
          <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z"/>
        </svg>
      </button>

      {/* --- SECTION: MAIN NAV --- */}
      <div className="menu-group first-group">
        <MenuItem icon="home" label="Home" onClick={() => handleItemClick('/')} />
        <MenuItem icon="popular" label="Popular" onClick={() => handleItemClick('/popular')} />
        <MenuItem icon="explore" label="Explore" onClick={() => handleItemClick('/explore')} />
        <MenuItem icon="all" label="All" onClick={() => handleItemClick('/all')} />
      </div>

      <div className="separator"></div>

      {/* --- SECTION: ACTIONS --- */}
      <div className="menu-group">
        <MenuItem icon="add" label="Create Post" onClick={() => handleItemClick('/create-post')} />
        <MenuItem icon="rules" label="Create Community" onClick={openCreateCommunityModal} />
        <MenuItem icon="best_of" label="Best Communities" onClick={() => handleItemClick('/communities')} />
      </div>

      <div className="separator"></div>

      {/* --- SECTION: GAMES --- */}
      <Collapsible 
        title="GAMES ON REDDIT" 
        isOpen={openSections.games} 
        onToggle={() => toggleSection('games')}
      >
        <div className="game-promo" onClick={() => handleItemClick('/games/jump-cat')}>
          <div className="new-tag">NEW</div>
          <div className="promo-content">
            <img 
              src="https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png" 
              className="game-promo-img"
              alt="cat"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="game-text">
              <strong>Jump Cat</strong>
              <span>Mind the Gaps</span>
              <small>199K monthly players</small>
            </div>
          </div>
        </div>

        <MenuItem gameIcon="HC" gameColor="#000" label="Hot and Cold" onClick={() => handleItemClick('/games/hot-cold')} />
        <MenuItem gameIcon="PG" gameColor="#FFD635" label="Pocket Grids" onClick={() => handleItemClick('/games/pocket-grids')} />
        <MenuItem gameIcon="SF" gameColor="#FF4500" label="Stonefall" onClick={() => handleItemClick('/games/stonefall')} />
        <MenuItem icon="controller" label="Discover More Games" onClick={() => handleItemClick('/games')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: CUSTOM FEEDS --- */}
      <Collapsible 
        title="CUSTOM FEEDS" 
        isOpen={openSections.customFeeds} 
        onToggle={() => toggleSection('customFeeds')}
      >
        <MenuItem icon="add" label="Create Custom Feed" onClick={() => handleItemClick('/custom-feeds')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: RECENT --- */}
      <Collapsible 
        title="RECENT" 
        isOpen={openSections.recent} 
        onToggle={() => toggleSection('recent')}
      >
        <MenuItem imgSrc="https://styles.redditmedia.com/t5_5l62s/styles/communityIcon_s936154673.png" label="r/AlexandriaEgy" isRound onClick={() => handleItemClick('/r/AlexandriaEgy')} />
        <MenuItem imgSrc="https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Egypt.svg" label="r/ExEgypt" isRound onClick={() => handleItemClick('/r/ExEgypt')} />
        <MenuItem imgSrc="https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png" label="r/Egypt" isRound onClick={() => handleItemClick('/r/Egypt')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: COMMUNITIES (JOINED) --- */}
      <Collapsible 
        title="COMMUNITIES" 
        isOpen={openSections.communities} 
        onToggle={() => toggleSection('communities')}
      >
        {loading ? (
          <div className="loading-communities">Loading...</div>
        ) : joinedCommunities.length > 0 ? (
          joinedCommunities.map((community) => (
            <MenuItem 
              key={community._id}
              imgSrc={community.icon || 'https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png'} 
              label={`r/${community.name}`} 
              isRound 
              onClick={() => handleItemClick(`/r/${community.name}`)} 
            />
          ))
        ) : (
          <div className="no-communities">
            <span className="no-communities-text">No communities joined yet</span>
          </div>
        )}
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: RESOURCES --- */}
      <Collapsible 
        title="RESOURCES" 
        isOpen={openSections.resources} 
        onToggle={() => toggleSection('resources')}
      >
        <MenuItem icon="reddit" label="About Reddit" onClick={() => handleItemClick('/about')} />
        <MenuItem icon="advertise" label="Advertise" onClick={() => handleItemClick('/advertise')} />
        <MenuItem icon="dev" label="Developer Platform" onClick={() => handleItemClick('/developers')} />
        <MenuItem icon="help" label="Help" onClick={() => handleItemClick('/help')} />
        <MenuItem icon="blog" label="Blog" onClick={() => handleItemClick('/blog')} />
        <MenuItem icon="careers" label="Careers" active onClick={() => handleItemClick('/careers')} />
        <MenuItem icon="press" label="Press" onClick={() => handleItemClick('/press')} />
      </Collapsible>

      <div className="copyright">
        Reddit, Inc. © 2025. All rights reserved.
      </div>

    </nav>
  );
};

/* --- SUB-COMPONENTS --- */

const Collapsible = ({ title, isOpen, onToggle, children }) => (
  <div className={`collapsible-section ${isOpen ? 'expanded' : ''}`}>
    <div className="section-header" onClick={onToggle}>
      <span>{title}</span>
      <ArrowIcon />
    </div>
    {isOpen && <div className="section-content">{children}</div>}
  </div>
);

const MenuItem = ({ label, icon, imgSrc, isRound, gameIcon, gameColor, active, isFooter, onClick }) => (
  <div className={`menu-item ${active ? 'active' : ''} ${isFooter ? 'footer-item' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
    {icon && <span className="icon">{getSvg(icon)}</span>}
    {imgSrc && <img src={imgSrc} alt="" className={`sub-icon ${isRound ? 'round' : ''}`} />}
    {gameIcon && <div className="game-placeholder-icon" style={{ backgroundColor: gameColor }}>{gameIcon}</div>}
    <span className="label-text">{label}</span>
  </div>
);

/* --- ICONS --- */
const ArrowIcon = () => (
  <svg className="arrow" viewBox="0 0 20 20">
    <path d="M10 13.125l-5.25-5.25 1.5-1.5 3.75 3.75 3.75-3.75 1.5 1.5z"/>
  </svg>
);

const getSvg = (name) => {
   switch (name) {
    case 'home': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z"/>
        </svg>
      );
    case 'popular': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a1 1 0 0 1 .894.553l2.5 5 5.5.8a1 1 0 0 1 .554 1.706l-4 3.9.95 5.478a1 1 0 0 1-1.451 1.054L10 17.5l-4.947 2.991a1 1 0 0 1-1.451-1.054l.95-5.478-4-3.9a1 1 0 0 1 .554-1.706l5.5-.8 2.5-5A1 1 0 0 1 10 2Z"/>
        </svg>
      );
    case 'explore': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd"/>
        </svg>
      );
    case 'all': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 0 1 5.567 3.75H4.433A6 6 0 0 1 10 4Zm-5.567 5.75h11.134A6 6 0 0 1 10 16a6 6 0 0 1-5.567-6.25Z"/>
        </svg>
      );
    case 'add': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H3a1 1 0 1 1 0-2h6V3a1 1 0 0 1 1-1Z" clipRule="evenodd"/>
        </svg>
      );
    case 'controller': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM13 7h2v2h-2v2h-2V9H9V7h2V5h2v2Z"/>
          <path fillRule="evenodd" d="M14 2H6a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4ZM6 4h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" clipRule="evenodd"/>
        </svg>
      );
    case 'reddit': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Zm0 7.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" clipRule="evenodd"/>
        </svg>
      );
    case 'advertise': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 3a1 1 0 1 0-2 0v1.07A7.5 7.5 0 0 0 3.82 12H2a1 1 0 1 0 0 2h1.82A7.5 7.5 0 0 0 9 17.93V19a1 1 0 1 0 2 0v-1.07A7.5 7.5 0 0 0 16.18 14H18a1 1 0 1 0 0-2h-1.82A7.5 7.5 0 0 0 11 4.07V3Z"/>
        </svg>
      );
    case 'dev': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707ZM11 14a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"/>
        </svg>
      );
    case 'help': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2 1 1 0 0 0-1 1 1 1 0 0 1-2 0 3 3 0 0 1 3-3Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
        </svg>
      );
    case 'blog': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm3 1a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H5Zm0 4a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H5Zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H5Z" clipRule="evenodd"/>
        </svg>
      );
    case 'careers': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2Zm2-2h4v2H8V4Zm5 6a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm-4 0a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clipRule="evenodd"/>
        </svg>
      );
    case 'press': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Zm3.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM10 7a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Zm-6 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
        </svg>
      );
    case 'rules': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm3 1a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H7Zm0 4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H7Z" clipRule="evenodd"/>
        </svg>
      );
    case 'best_of': 
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z"/>
        </svg>
      );
    default: return null;
  }
};

export default Sidebar;