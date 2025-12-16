import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useCreateCommunity } from '../context/CreateCommunityContext';

const Sidebar = () => {
  // State for the whole sidebar visibility
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { openCreateCommunityModal } = useCreateCommunity();

  // State to manage the open/close status of the collapsible sections
  const [openSections, setOpenSections] = useState({
    games: true,
    customFeeds: true,
    recent: true,
    communities: true,
    resources: true,
  });
  const navigate = useNavigate();


  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // --- NEW: Generic handler for menu clicks ---
  const handleItemClick = (label) => {
    console.log(`Navigating to: ${label}`);
    // You can replace this with navigation logic, e.g., navigate('/home')
    alert(`You clicked on: ${label}`); 
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
        <MenuItem icon="home" label="Home" onClick={() => handleItemClick('Home')} />
        <MenuItem icon="popular" label="Popular" onClick={() => handleItemClick('Popular')} />
        <MenuItem icon="explore" label="Explore" onClick={() => handleItemClick('Explore')} />
        <MenuItem icon="all" label="All" onClick={() => handleItemClick('All')} />
      </div>

      <div className="separator"></div>

      {/* --- SECTION: ACTIONS --- */}

      <div className="menu-group" onClick={openCreateCommunityModal}>
        <MenuItem icon="add" label="Start a community" />

     
      </div>

      <div className="separator"></div>

      {/* --- SECTION: GAMES --- */}
      <Collapsible 
        title="GAMES ON REDDIT" 
        isOpen={openSections.games} 
        onToggle={() => toggleSection('games')}
      >
        <div className="game-promo" onClick={() => handleItemClick('Jump Cat Game')}>
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

        <MenuItem 
            gameIcon="HC" 
            gameColor="#000" 
            label="Hot and Cold" 
            onClick={() => handleItemClick('Hot and Cold')}
        />
        <MenuItem 
            gameIcon="PG" 
            gameColor="#FFD635" 
            label="Pocket Grids" 
            onClick={() => handleItemClick('Pocket Grids')}
        />
        <MenuItem 
            gameIcon="SF" 
            gameColor="#FF4500" 
            label="Stonefall" 
            onClick={() => handleItemClick('Stonefall')}
        />
        <MenuItem icon="controller" label="Discover More Games" onClick={() => handleItemClick('Discover More Games')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: CUSTOM FEEDS --- */}
      <Collapsible 
        title="CUSTOM FEEDS" 
        isOpen={openSections.customFeeds} 
        onToggle={() => toggleSection('customFeeds')}
      >
        <MenuItem icon="add" label="Create Custom Feed" onClick={() => handleItemClick('Create Custom Feed')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: RECENT --- */}
      <Collapsible 
        title="RECENT" 
        isOpen={openSections.recent} 
        onToggle={() => toggleSection('recent')}
      >
        <MenuItem 
            imgSrc="https://styles.redditmedia.com/t5_5l62s/styles/communityIcon_s936154673.png" 
            label="r/AlexandriaEgy" 
            isRound={true}
            onClick={() => handleItemClick('r/AlexandriaEgy')}
        />
        <MenuItem 
            imgSrc="https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Egypt.svg" 
            label="r/ExEgypt" 
            isRound={true}
            onClick={() => handleItemClick('r/ExEgypt')}
        />
        <MenuItem 
            imgSrc="https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png" 
            label="r/Egypt" 
            isRound={true}
            onClick={() => handleItemClick('r/Egypt')}
        />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: COMMUNITIES --- */}
      <Collapsible 
        title="COMMUNITIES" 
        isOpen={openSections.communities} 
        onToggle={() => toggleSection('communities')}
      >
        <MenuItem 
            imgSrc="https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png" 
            label="r/Cairo" 
            isRound={true}
            onClick={() => handleItemClick('r/Cairo')}
        />
        <MenuItem 
            imgSrc="https://styles.redditmedia.com/t5_2qh2j/styles/communityIcon_72w75202678b1.png" 
            label="r/PersonalFinance" 
            isRound={true}
            onClick={() => handleItemClick('r/PersonalFinance')}
        />
      </Collapsible>

      <div className="separator"></div>

      {/* --- SECTION: RESOURCES --- */}
      <Collapsible 
        title="RESOURCES" 
        isOpen={openSections.resources} 
        onToggle={() => toggleSection('resources')}
      >
        <MenuItem icon="reddit" label="About Reddit" onClick={() => handleItemClick('About Reddit')} />
        <MenuItem icon="advertise" label="Advertise" onClick={() => handleItemClick('Advertise')} />
        <MenuItem icon="dev" label="Developer Platform" onClick={() => handleItemClick('Developer Platform')} />
        <div className="menu-item" onClick={() => handleItemClick('Reddit Pro')} style={{cursor: 'pointer'}}>
            <span className="icon">{getSvg('pro')}</span>
            <span className="label-text">Reddit Pro</span>
            <span className="beta-tag">BETA</span>
        </div>
        <MenuItem icon="help" label="Help" onClick={() => handleItemClick('Help')} />
        <MenuItem icon="blog" label="Blog" onClick={() => handleItemClick('Blog')} />
        <MenuItem icon="careers" label="Careers" active={true} onClick={() => handleItemClick('Careers')} />
        <MenuItem icon="press" label="Press" onClick={() => handleItemClick('Press')} />
      </Collapsible>

      <div className="separator"></div>

      {/* --- FOOTER LINKS (BEST OF) --- */}
      <div className="menu-group footer-links">
        <MenuItem icon="communities_footer" label="Communities" isFooter={true} onClick={() => handleItemClick('Footer: Communities')} />
        <MenuItem icon="best_of" label="Best of Reddit" isFooter={true} onClick={() => handleItemClick('Footer: Best of Reddit')} />
        <MenuItem icon="translate" label="Best of Reddit in Port..." isFooter={true} onClick={() => handleItemClick('Footer: Portuguese')} />
        <MenuItem icon="translate" label="Best of Reddit in Ger..." isFooter={true} onClick={() => handleItemClick('Footer: German')} />
      </div>

      <div className="separator"></div>

      {/* --- FOOTER LINKS (LEGAL) --- */}
      <div className="menu-group footer-links">
        <MenuItem icon="rules" label="Reddit Rules" isFooter={true} onClick={() => handleItemClick('Rules')} />
        <MenuItem icon="rules" label="Privacy Policy" isFooter={true} onClick={() => handleItemClick('Privacy')} />
        <MenuItem icon="rules" label="User Agreement" isFooter={true} onClick={() => handleItemClick('User Agreement')} />
        <MenuItem icon="access" label="Accessibility" isFooter={true} onClick={() => handleItemClick('Accessibility')} />
      </div>

      <div className="copyright">
        Reddit, Inc. © 2025. All rights reserved.
      </div>

    </nav>
  );
};

/* --- SUB-COMPONENTS --- */

const Collapsible = ({ title, isOpen, onToggle, children }) => (
    <div className={`collapsible-section ${isOpen ? 'expanded' : ''}`}>
      <div className="section-header" onClick={onToggle} style={{cursor: 'pointer'}}>
        <span>{title}</span>
        <ArrowIcon />
      </div>
      {isOpen && <div className="section-content">{children}</div>}
    </div>
    {isOpen && <div className="section-content">{children}</div>}
  </div>
);

// --- UPDATE: Added onClick prop and style cursor pointer ---
const MenuItem = ({ label, icon, imgSrc, isRound, gameIcon, gameColor, active, isFooter, onClick }) => {
  return (
    <div 
        className={`menu-item ${active ? 'active' : ''} ${isFooter ? 'footer-item' : ''}`}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
    >
      {/* SVG Icon */}
      {icon && <span className="icon">{getSvg(icon)}</span>}
      
      {/* Image Icon (Subreddit) */}
      {imgSrc && (
        <img 
          src={imgSrc} 
          alt="" 
          className={`sub-icon ${isRound ? 'round' : ''}`}
          onError={(e) => {e.target.style.opacity=0}} 
        />
      )}

      {/* Game Icon Square */}
      {gameIcon && (
        <div className="game-placeholder-icon" style={{backgroundColor: gameColor}}>
            {gameIcon}
        </div>
      )}

      <span className="label-text">{label}</span>
    </div>
  );
};

/* --- ICONS --- */
const ArrowIcon = () => (
  <svg className="arrow" viewBox="0 0 20 20">
    <path d="M10 13.125l-5.25-5.25 1.5-1.5 3.75 3.75 3.75-3.75 1.5 1.5z"/>
  </svg>
);

const getSvg = (name) => {
   switch (name) {
    case 'home': return <svg viewBox="0 0 20 20"><path d="M18.6 9.38L10.74 1.95a1.06 1.06 0 0 0-1.48 0L1.4 9.38a1.08 1.08 0 0 0-.32.77v8.77a1 1 0 0 0 1 1h5.83v-5.83h4.18v5.83h5.83a1 1 0 0 0 1-1V10.15a1.08 1.08 0 0 0-.32-.77z"></path></svg>;
    case 'popular': return <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M11 5h-2v4.17l-3.24 3.25 1.41 1.41L11 9.83z"/></svg>;
    case 'explore': return <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="2"/><path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zM10 4a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"/></svg>;
    case 'all': return <svg viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 14a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"/><circle cx="10" cy="10" r="4"/></svg>;
    case 'add': return <svg viewBox="0 0 20 20"><path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z"/></svg>;
    case 'controller': return <svg viewBox="0 0 20 20"><path d="M17.5 7.5a2.5 2.5 0 0 0-2-1.92 5.6 5.6 0 0 0-3.32-.22l-1.35-3.13a.5.5 0 0 0-.92.38l1.24 2.89a7.14 7.14 0 0 0-2.3 0L10.09 2.6a.5.5 0 0 0-.92-.38l-1.35 3.14a5.6 5.6 0 0 0-3.32.21 2.5 2.5 0 0 0-2 1.92c-.17 1-.03 2.5.83 3.36.4.4.92.52 1.34.45a3 3 0 0 0 1.08-.43 4.47 4.47 0 0 0 1-.9l.6 2.08a.5.5 0 0 0 .96-.28l-.55-1.92a6.9 6.9 0 0 0 4.5 0l-.56 1.92a.5.5 0 0 0 .96.28l.6-2.08a4.47 4.47 0 0 0 1 .9 3 3 0 0 0 1.08.43c.42.07.94-.05 1.34-.45.86-.86 1-2.37.83-3.37zm-11 .5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>;
    case 'reddit': return <svg viewBox="0 0 20 20"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>;
    case 'advertise': return <svg viewBox="0 0 20 20"><path d="M9 2H5v2h4V2zm0 7H5v2h4V9zm0 7H5v2h4v-2zm2-14h4v2h-4V2zm4 7h-4v2h4V9zm-4 7h4v-2h-4v2z"/></svg>;
    case 'dev': return <svg viewBox="0 0 20 20"><path d="M10 .5l5.5 3.2v6.3L10 13.2 4.5 10V3.7L10 .5zM10 2L5.5 4.6v5.2L10 12.4l4.5-2.6V4.6L10 2z"/></svg>;
    case 'pro': return <svg viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm2 12H8v-2h4v2zm0-4H8V6h4v4z"/></svg>;
    case 'help': return <svg viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm1 12H9v-2h2v2zm0-4H9V6h2v4z"/></svg>;
    case 'blog': return <svg viewBox="0 0 20 20"><path d="M4 4h12v12H4z"/></svg>;
    case 'careers': return <svg viewBox="0 0 20 20"><path d="M16 4h-3V2h-2v2H9V2H7v2H4v14h12V4zM9 16H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>;
    case 'press': return <svg viewBox="0 0 20 20"><path d="M14.5 2h-9A1.5 1.5 0 0 0 4 3.5v13A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 2zM13 14H7v-2h6v2z"/></svg>;
    case 'rules': return <svg viewBox="0 0 20 20"><path d="M4 2h12v16H4z" fill="none" stroke="currentColor"/></svg>;
    case 'access': return <svg viewBox="0 0 20 20"><circle cx="10" cy="5" r="2"/><path d="M14 9h-3V7h3V9zm-5 0H6V7h3V9zm-1 8H6v-6h2v6zm4 0h-2v-6h2v6z"/></svg>;
    case 'communities_footer': return <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M10 3.5a6.5 6.5 0 1 0 6.5 6.5A6.51 6.51 0 0 0 10 3.5zm0 11a4.5 4.5 0 1 1 4.5-4.5A4.51 4.51 0 0 1 10 14.5z"/><path d="M10 6a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/></svg>;
    case 'best_of': return <svg viewBox="0 0 20 20"><path d="M18.66 10.53a3.5 3.5 0 0 0-3.5-3.5h-.53v-.53a3.5 3.5 0 0 0-3.5-3.5h-.53V2.5a.5.5 0 0 0-1 0v.5h-.53a3.5 3.5 0 0 0-3.5 3.5v.53h-.53a3.5 3.5 0 0 0-3.5 3.5v.53H1a.5.5 0 0 0 0 1h.5v.53a3.5 3.5 0 0 0 3.5 3.5h.53v.53a3.5 3.5 0 0 0 3.5 3.5h.53v.5a.5.5 0 0 0 1 0v-.5h.53a3.5 3.5 0 0 0 3.5-3.5v-.53h.53a3.5 3.5 0 0 0 3.5-3.5v-.53h.5a.5.5 0 0 0 0-1zM10 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5z"/></svg>;
    case 'translate': return <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M10 3a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm0 12a5 5 0 0 1-3.35-1.29l1.28-1.28a3.17 3.17 0 0 0 4.14 0l1.28 1.28A5 5 0 0 1 10 15zm3.5-5a3.5 3.5 0 0 1-7 0 3.46 3.46 0 0 1 .25-1.3H6.5a.5.5 0 0 1 0-1h1.45A3.5 3.5 0 0 1 10 6.5a.5.5 0 0 1 0 1h-1.9a2.5 2.5 0 1 0 3.8 0H10a.5.5 0 0 1 0-1h3.2a3.5 3.5 0 0 1 .3 1z"/></svg>;
    default: return null;
  }
};

export default Sidebar;
