import React, { useState, useEffect } from 'react';
import { chatApi, userApi } from '../api';
import { X, Search, AlertCircle, UserSearch, User, CheckCircle } from 'lucide-react';
import './NewChatModal.css';

const NewChatModal = ({ isOpen, onClose, onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // Search for users by username
        const results = await userApi.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserSelect = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleStartChat = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // For now, we only support direct chats (one-on-one)
      if (selectedUsers.length === 1) {
        const conversation = await chatApi.createDirectConversation(selectedUsers[0]._id);
        onChatCreated(conversation);
        onClose();
      } else {
        // Group chat support can be added later
        setError('Group chats are not yet supported');
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err.response?.data?.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Start a new chat</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Search input */}
        <div className="modal-body">
          <div className="search-section">
            <div className="search-input-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Selected users chips */}
          {selectedUsers.length > 0 && (
            <div className="selected-users">
              {selectedUsers.map(user => (
                <div key={user._id} className="user-chip">
                  <span>{user.username}</span>
                  <button
                    className="chip-remove-btn"
                    onClick={() => handleUserSelect(user)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Search results */}
          <div className="search-results">
            {loading && searchQuery.trim().length >= 2 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Searching...</span>
              </div>
            ) : searchQuery.trim().length < 2 ? (
              <div className="empty-state">
                <Search size={48} strokeWidth={1.5} />
                <p>Type at least 2 characters to search for users</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="empty-state">
                <UserSearch size={48} strokeWidth={1.5} />
                <p>No users found</p>
              </div>
            ) : (
              <div className="results-list">
                {searchResults.map(user => {
                  const isSelected = selectedUsers.find(u => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      className={`user-result ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="user-avatar">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.username}</div>
                        {user.email && (
                          <div className="user-email">{user.email}</div>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle size={20} className="check-icon" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleStartChat}
            disabled={selectedUsers.length === 0 || loading}
          >
            {loading ? 'Creating...' : `Start Chat ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
