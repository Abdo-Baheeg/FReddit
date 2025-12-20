import React from 'react';
import { Video, Info, ExternalLink, ChevronDown, X, Users, User } from 'lucide-react';
import './ChatHeader.css';

const ChatHeader = ({ conversation, onClose, onMinimize, onOpenNewWindow }) => {
  if (!conversation) return null;

  const currentUserId = localStorage.getItem('userId');
  
  // Get other user info for direct chats
  const getOtherUser = () => {
    if (conversation.type === 'community') return null;
    return conversation.participants.find(p => p._id !== currentUserId);
  };

  const otherUser = getOtherUser();

  // Determine display name and avatar
  const displayName = conversation.type === 'community' 
    ? conversation.community?.name || 'Community Chat'
    : otherUser?.username || 'User';

  const displayAvatar = conversation.type === 'community'
    ? conversation.community?.icon_url
    : otherUser?.avatar_url;

  // TODO: Implement real-time online status tracking
  const isOnline = false; // conversation.type !== 'community' && otherUser?.isOnline;

  return (
    <header className="chat-header-bar">
      <div className="chat-header-user">
        <div className="chat-header-avatar-container">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt={displayName}
              className="chat-header-avatar-img"
            />
          ) : (
            <div className="chat-header-avatar-placeholder">
              {conversation.type === 'community' ? <Users size={24} /> : <User size={24} />}
            </div>
          )}
          {isOnline && <span className="online-indicator"></span>}
        </div>

        <div className="chat-header-user-info">
          <h2 className="chat-header-username">
            {conversation.type === 'community' ? `r/${displayName}` : `u/${displayName}`}
          </h2>
          <span className="chat-header-status">
            {conversation.type === 'community' 
              ? `${conversation.participants.length} members`
              : 'Direct message'}
          </span>
        </div>
      </div>

      <div className="chat-header-actions">
        <button 
          className="chat-header-action-btn"
          title="Start video call"
          onClick={() => console.log('Video call not implemented')}
        >
          <Video size={20} />
        </button>
        
        <button 
          className="chat-header-action-btn"
          title="Chat settings"
          onClick={() => console.log('Settings not implemented')}
        >
          <Info size={20} />
        </button>

        <div className="chat-header-divider"></div>

        <button 
          className="chat-header-action-btn"
          title="Open in new window"
          onClick={onOpenNewWindow}
        >
          <ExternalLink size={20} />
        </button>

        <button 
          className="chat-header-action-btn"
          title="Minimize"
          onClick={onMinimize}
        >
          <ChevronDown size={20} />
        </button>

        <button 
          className="chat-header-action-btn"
          title="Close chat"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
