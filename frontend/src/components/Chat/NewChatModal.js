import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewChatModal.css';

const API_URL = process.env.REACT_APP_API_URL;

const NewChatModal = ({ onClose, onCreateChat }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'communities'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (activeTab === 'users') {
          const response = await axios.get(`${API_URL}/api/users/search`, {
            params: { q: searchQuery },
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(response.data);
        } else {
          const response = await axios.get(`${API_URL}/api/communities/search`, {
            params: { q: searchQuery },
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(response.data);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, activeTab]);

  const handleSelectItem = (item) => {
    onCreateChat(activeTab === 'users' ? 'user' : 'community', item._id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>New Chat</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`modal-tab ${activeTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('communities')}
          >
            Communities
          </button>
        </div>

        {/* Search */}
        <div className="modal-search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="search-icon">
            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
          </svg>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="modal-results">
          {loading && (
            <div className="modal-loading">Searching...</div>
          )}
          
          {error && (
            <div className="modal-error">{error}</div>
          )}
          
          {!loading && !error && searchResults.length === 0 && searchQuery && (
            <div className="modal-empty">
              No {activeTab} found
            </div>
          )}
          
          {!loading && !error && searchResults.length === 0 && !searchQuery && (
            <div className="modal-empty">
              Start typing to search for {activeTab}
            </div>
          )}
          
          {!loading && !error && searchResults.length > 0 && (
            <div className="results-list">
              {searchResults.map(item => (
                <div 
                  key={item._id} 
                  className="result-item"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="result-avatar">
                    {item.avatar_url || item.avatarUrl ? (
                      <img src={item.avatar_url || item.avatarUrl} alt={item.username || item.name} />
                    ) : (
                      <div className="result-avatar-placeholder">
                        {activeTab === 'users' ? (
                          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm6 0c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zM7 15c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4zm6 0c-.3 0-.7 0-1.1.1 1.3.9 2.1 2.1 2.1 3.9v2h8v-2c0-2.7-5.3-4-9-4z"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="result-info">
                    <div className="result-name">
                      {activeTab === 'users' ? `u/${item.username}` : `r/${item.name}`}
                    </div>
                    {item.description && (
                      <div className="result-description">{item.description}</div>
                    )}
                    {activeTab === 'communities' && item.memberCount && (
                      <div className="result-members">{item.memberCount} members</div>
                    )}
                  </div>
                  <svg className="result-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 4l6 6-6 6V4z"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
