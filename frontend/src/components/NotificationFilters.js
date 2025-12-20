import React from 'react';
import { Check, Trash2, Filter } from 'lucide-react';
import './NotificationFilters.css';

const NotificationFilters = ({ 
  filter, 
  setFilter, 
  onMarkAllAsRead, 
  onDeleteAll,
  unreadCount,
  totalCount 
}) => {
  return (
    <div className="notification-filters">
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <Filter size={16} />
          <span>All</span>
          {totalCount > 0 && <span className="filter-count">{totalCount}</span>}
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          <span>Unread</span>
          {unreadCount > 0 && <span className="filter-count">{unreadCount}</span>}
        </button>
        <button
          className={`filter-tab ${filter === 'mentions' ? 'active' : ''}`}
          onClick={() => setFilter('mentions')}
        >
          <span>Mentions</span>
        </button>
      </div>

      <div className="filter-actions">
        {unreadCount > 0 && (
          <button
            className="filter-action-btn"
            onClick={onMarkAllAsRead}
            title="Mark all as read"
          >
            <Check size={16} />
            <span>Mark all read</span>
          </button>
        )}
        {totalCount > 0 && (
          <button
            className="filter-action-btn danger"
            onClick={onDeleteAll}
            title="Delete all notifications"
          >
            <Trash2 size={16} />
            <span>Delete all</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;
