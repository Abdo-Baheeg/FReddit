import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const { unreadCounts } = useSocket();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    // Top Bar (Fixed)
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
          <button className="vpIconBtn" aria-label="Advertise">
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

          <button className="vpCreateBtnNew">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Create
          </button>

          <button className="vpIconBtn" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>

          <div className="vpUserAvatarNew">
            <img
              src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
              alt="User"
              className="vpAvatarImg"
            />
            <div className="vpOnlineIndicator"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
