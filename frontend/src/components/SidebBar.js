import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, TrendingUp, Compass, Circle, Plus, Gamepad2, 
  CircleDot, MonitorPlay, Shield, Users as UsersIcon, 
  Trophy, Globe, ChevronDown 
} from 'lucide-react';
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

  // ✅ REAL NAVIGATION
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
    {icon && <span className="icon">{getIcon(icon)}</span>}
    {imgSrc && <img src={imgSrc} alt="" className={`sub-icon ${isRound ? 'round' : ''}`} />}
    {gameIcon && <div className="game-placeholder-icon" style={{ backgroundColor: gameColor }}>{gameIcon}</div>}
    <span className="label-text">{label}</span>
  </div>
);

/* --- ICONS --- */
const ArrowIcon = () => <ChevronDown size={16} className="arrow" />;

const getIcon = (name) => {
   switch (name) {
<<<<<<< HEAD
    case 'home': return <Home size={20} />;
    case 'popular': return <TrendingUp size={20} />;
    case 'explore': return <Compass size={20} />;
    case 'all': return <Circle size={20} />;
    case 'add': return <Plus size={20} />;
    case 'controller': return <Gamepad2 size={20} />;
    case 'reddit': return <CircleDot size={20} />;
    case 'advertise': return <MonitorPlay size={20} />;
    case 'dev': return <CircleDot size={20} />;
    case 'pro': return <CircleDot size={20} />;
    case 'help': return <CircleDot size={20} />;
    case 'blog': return <CircleDot size={20} />;
    case 'careers': return <CircleDot size={20} />;
    case 'press': return <CircleDot size={20} />;
    case 'rules': return <Shield size={20} />;
    case 'access': return <UsersIcon size={20} />;
    case 'communities_footer': return <UsersIcon size={20} />;
    case 'best_of': return <Trophy size={20} />;
    case 'translate': return <Globe size={20} />;
    default: return null;
  }
};

export default Sidebar;