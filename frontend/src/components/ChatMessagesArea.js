import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { User } from 'lucide-react';
import './ChatMessagesArea.css';

const ChatMessagesArea = ({ messages, currentUserId, typingUsers = {} }) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);
  const typingNames = Object.values(typingUsers);

  return (
    <div className="chat-messages-area">
      {Object.entries(messageGroups).map(([dateLabel, msgs]) => (
        <div key={dateLabel} className="message-date-group">
          {/* Date divider */}
          <div className="date-divider">
            <span className="date-label">{dateLabel}</span>
          </div>

          {/* Messages for this date */}
          {msgs.map((msg, index) => {
            const isOwn = msg.sender?._id === currentUserId;
            const prevMsg = index > 0 ? msgs[index - 1] : null;
            const nextMsg = index < msgs.length - 1 ? msgs[index + 1] : null;

            // Determine if we should show avatar and sender name
            const showAvatar = !prevMsg || prevMsg.sender?._id !== msg.sender?._id;
            const showSender = showAvatar && !isOwn;

            // Check if next message is from same sender (for spacing)
            const isGrouped = nextMsg && nextMsg.sender?._id === msg.sender?._id;

            return (
              <ChatMessage
                key={msg._id}
                message={msg}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showSender={showSender}
                isGrouped={isGrouped}
              />
            );
          })}
        </div>
      ))}

      {/* Typing indicator */}
      {typingNames.length > 0 && (
        <div className="typing-indicator-wrapper">
          <div className="typing-indicator-avatar">
            <User size={24} />
          </div>
          <div className="typing-indicator-content">
            <div className="typing-dots-container">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesArea;
