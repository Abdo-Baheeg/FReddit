import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Home.css';

const Premium = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Reddit Premium</h1>
        <p>Upgrade to Reddit Premium for an ad-free experience and exclusive features</p>
        <div className="premium-content">
          <h2>Benefits</h2>
          <ul>
            <li>Ad-free browsing</li>
            <li>Exclusive avatar gear</li>
            <li>Members lounge access</li>
            <li>700 Coins per month</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Premium;
