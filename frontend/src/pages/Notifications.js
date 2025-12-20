import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { notificationApi } from '../api';
import NotificationItem from '../components/NotificationItem';
import NotificationFilters from '../components/NotificationFilters';
import { Bell, Loader } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await notificationApi.deleteAllNotifications();
        setNotifications([]);
      } catch (err) {
        console.error('Error deleting all notifications:', err);
      }
    }
  };

  const handleCreateTestNotifications = async () => {
    try {
      await notificationApi.createTestNotifications();
      await fetchNotifications();
    } catch (err) {
      console.error('Error creating test notifications:', err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'mentions') return notif.type === 'mention';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`notifications-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>

        <NotificationFilters
          filter={filter}
          setFilter={setFilter}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteAll={handleDeleteAll}
          unreadCount={unreadCount}
          totalCount={notifications.length}
        />

        <div className="notifications-content">
          {loading ? (
            <div className="notifications-loading">
              <Loader size={32} className="spinner" />
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="notifications-error">
              <p>{error}</p>
              <button onClick={fetchNotifications}>Try Again</button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <Bell size={64} strokeWidth={1} />
              <h2>
                {filter === 'unread' 
                  ? 'No unread notifications' 
                  : filter === 'mentions'
                  ? 'No mentions'
                  : 'No notifications yet'}
              </h2>
              <p>
                {filter === 'all'
                  ? "You'll see notifications here when someone interacts with your content"
                  : 'Change filters to see other notifications'}
              </p>
            </div>
          ) : (
            <>
              <div className="notifications-list">
                {filteredNotifications.map(notif => (
                  <NotificationItem
                    key={notif._id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              {process.env.NODE_ENV === 'development' && notifications.length === 0 && (
                <div className="test-notification-btn-container">
                  <button 
                    className="test-notification-btn"
                    onClick={handleCreateTestNotifications}
                  >
                    Create Test Notifications
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
