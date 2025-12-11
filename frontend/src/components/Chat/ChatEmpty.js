import React from 'react';
import './ChatEmpty.css';

const ChatEmpty = ({ onNewChat }) => {
  return (
    <div className="chat-empty-state">
      <div className="chat-empty-content">
        {/* Illustration */}
        <div className="chat-empty-illustration">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            {/* Envelope illustration */}
            <rect x="20" y="40" width="120" height="80" rx="4" fill="#F6F7F8" stroke="#EDEFF1" strokeWidth="2"/>
            <path d="M20 44L80 84L140 44" stroke="#7C7C7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="110" cy="50" r="8" fill="#0079D3"/>
            <circle cx="110" cy="50" r="8" fill="#0079D3" opacity="0.3">
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        {/* Text Content */}
        <div className="chat-empty-text">
          <h2 className="chat-empty-title">Welcome to chat!</h2>
          <p className="chat-empty-description">
            Start a direct or group chat with other redditors.
          </p>
        </div>

        {/* Action Button */}
        <button className="chat-empty-button" onClick={onNewChat}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 2H2C.9 2 0 2.9 0 4v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-7 9H9v2H7v-2H5V9h2V7h2v2h2v2z"/>
          </svg>
          Start new chat
        </button>
      </div>
    </div>
  );
};

export default ChatEmpty;
