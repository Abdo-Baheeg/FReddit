import React from 'react';
import './ChatLayout.css';

const ChatLayout = ({ children }) => {
  return (
    <div className="reddit-chat-container">
      <div className="reddit-chat-layout">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
