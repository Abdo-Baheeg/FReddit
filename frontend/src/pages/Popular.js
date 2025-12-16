import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../pages/Home.css';

const Popular = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Popular Posts</h1>
        <p>See the most popular posts from across Reddit</p>
        <div className="posts-list">
          {/* Popular posts will be displayed here */}
          <p>Popular posts coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Popular;
