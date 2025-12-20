import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Reply, ThumbsUp, ThumbsDown, 
  AtSign, UserPlus, FileText, Users, Trash2, Circle 
} from 'lucide-react';
import './NotificationItem.css';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageCircle size={20} />;
      case 'reply':
        return <Reply size={20} />;
      case 'upvote':
        return <ThumbsUp size={20} />;
      case 'downvote':
        return <ThumbsDown size={20} />;
      case 'mention':
        return <AtSign size={20} />;
      case 'follow':
        return <UserPlus size={20} />;
      case 'post':
        return <FileText size={20} />;
      case 'community':
        return <Users size={20} />;
      default:
        return <Circle size={20} />;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'upvote':
        return '#FF4500';
      case 'downvote':
        return '#7193FF';
      case 'follow':
        return '#46D160';
      case 'mention':
        return '#FFD635';
      default:
        return '#818384';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(notification._id);
  };

  return (
    <div 
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-icon" style={{ color: getIconColor() }}>
        {getIcon()}
      </div>

      <div className="notification-content">
        {notification.triggeredBy && (
          <div className="notification-avatar">
            {notification.triggeredBy.avatar ? (
              <img 
                src={notification.triggeredBy.avatar} 
                alt={notification.triggeredBy.username}
              />
            ) : (
              <div className="notification-avatar-placeholder">
                {notification.triggeredBy.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        <div className="notification-text">
          {notification.title && (
            <div className="notification-title">{notification.title}</div>
          )}
          <div className="notification-message">{notification.message}</div>
          <div className="notification-time">{formatTime(notification.createdAt)}</div>
        </div>
      </div>

      <div className="notification-actions">
        {!notification.isRead && <div className="notification-unread-dot"></div>}
        <button 
          className="notification-delete-btn"
          onClick={handleDelete}
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
