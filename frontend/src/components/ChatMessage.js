import React, { useState } from 'react';
import { User, SmilePlus, Reply } from 'lucide-react';
import './ChatMessage.css';

const ChatMessage = ({ message, isOwn, showAvatar, showSender }) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleReaction = (emoji) => {
    console.log('Add reaction:', emoji);
    // TODO: Implement reaction functionality
  };

  const handleReply = () => {
    console.log('Reply to message:', message._id);
    // TODO: Implement reply functionality
  };

  return (
    <div 
      className={`chat-message-wrapper ${isOwn ? 'own' : 'other'} ${!showAvatar ? 'no-avatar' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar (only for other users and when showAvatar is true) */}
      {!isOwn && showAvatar && (
        <div className="message-avatar-container">
          {message.sender?.avatar_url ? (
            <img 
              src={message.sender.avatar_url} 
              alt={message.sender.username}
              className="message-avatar-img"
            />
          ) : (
            <div className="message-avatar-placeholder">
              <User size={24} />
            </div>
          )}
        </div>
      )}

      {/* Spacer for grouped messages without avatar */}
      {!isOwn && !showAvatar && <div className="message-avatar-spacer"></div>}

      {/* Message Content */}
      <div className="message-content-wrapper">
        {/* Sender name and timestamp (only show if showSender is true) */}
        {!isOwn && showSender && (
          <div className="message-header">
            <span className="message-sender-name">u/{message.sender?.username}</span>
            <span className="message-timestamp">{formatTime(message.createdAt)}</span>
          </div>
        )}

        {/* Message bubble */}
        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
          <p>{message.content}</p>

          {/* Reactions on message */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="message-reactions">
              {message.reactions.map((reaction, idx) => (
                <div key={idx} className="reaction-bubble">
                  <span>{reaction.emoji}</span>
                  <span className="reaction-count">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp for own messages or on hover */}
        {isOwn && (
          <div className={`message-footer ${showActions ? 'visible' : ''}`}>
            <span className="message-status">Delivered</span>
            <span className="message-timestamp">{formatTime(message.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Action buttons on hover */}
      <div className={`message-actions ${showActions ? 'visible' : ''} ${isOwn ? 'own' : 'other'}`}>
        <button 
          className="message-action-btn"
          onClick={() => handleReaction('👍')}
          title="Add reaction"
        >
          <SmilePlus size={16} />
        </button>
        <button 
          className="message-action-btn"
          onClick={handleReply}
          title="Reply"
        >
          <Reply size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
