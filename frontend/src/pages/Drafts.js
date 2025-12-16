import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Home.css';

const Drafts = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Drafts</h1>
        <p>Your saved drafts</p>
        <div className="drafts-list">
          <p>No drafts yet</p>
        </div>
      </div>
    </div>
  );
};

export default Drafts;
