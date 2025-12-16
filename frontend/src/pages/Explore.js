import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../pages/Home.css';

const Explore = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Explore</h1>
        <p>Discover new communities and topics</p>
        <div className="explore-grid">
          {/* Explore content will be displayed here */}
          <p>Explore content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Explore;
