import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Home.css';

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Fetch notifications from API
  }, []);

  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="feed-container">
        <h1>Notifications</h1>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications yet</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                {notif.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
