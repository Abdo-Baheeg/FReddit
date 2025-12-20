import React from 'react';
import { ExternalLink, ChevronDown, X, MessageSquarePlus } from 'lucide-react';
import './ChatWelcome.css';

const ChatWelcome = ({ onStartChat }) => {
  return (
    <div className="chat-welcome-container">
      {/* Top right controls */}
      <div className="chat-welcome-controls">
        <button className="chat-control-btn" title="Open in new window">
          <ExternalLink size={20} />
        </button>
        <button className="chat-control-btn" title="More options">
          <ChevronDown size={20} />
        </button>
        <button className="chat-control-btn" title="Close">
          <X size={20} />
        </button>
      </div>

      {/* Centered welcome content */}
      <div className="chat-welcome-content">
        <div className="chat-welcome-image">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAygwdqmkvBtLwL2NMNB7Je_fx7YRKi8W5MQ_oxlGnMkENqX2r8VVMXv89XcP_rSLSK3GuZEESJNW3Cz2mEVr-GUo5ugDpelSvkctR2cu9LaWUatRUHBr6RHEDzt678O6Qx8orvf9W_BstPEZfa2AUj2tvdbRqqBComKKdnTizOjkkT2V3LKBZCj_jr6rIrv8pS3IdzCjk3oqfX8o-ewUIrfhQaDWSGuUzDPqT1QFws8tk8ufyEhqnI29Bd22BtyrAClu3hreynhkA"
            alt="Reddit Snoo chat illustration"
            className="chat-welcome-img"
          />
        </div>
        
        <h2 className="chat-welcome-title">Welcome to chat!</h2>
        
        <p className="chat-welcome-description">
          Start a direct or group chat with other redditors.
        </p>
        
        <button 
          className="chat-welcome-btn"
          onClick={onStartChat}
        >
          <MessageSquarePlus size={20} />
          <span>Start new chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWelcome;
