import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../pages/Home.css';

const All = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>All Posts</h1>
        <p>Browse posts from all communities</p>
        <div className="posts-list">
          {/* All posts will be displayed here */}
          <p>All posts coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default All;
