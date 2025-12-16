import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Home.css';

const Achievements = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Achievements</h1>
        <p>Your Reddit achievements and milestones</p>
        <div className="achievements-grid">
          <p>Achievements coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
