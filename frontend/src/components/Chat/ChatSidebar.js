import React from 'react';
import './ChatSidebar.css';

const ChatSidebar = ({ 
  threads, 
  selectedThreadId, 
  onThreadSelect,
  onNewChat,
  isCollapsed, 
  onToggleCollapse 
}) => {

  return (
    <div className={`chat-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="chat-sidebar-header">
        <h1 className="chat-sidebar-title">Chats</h1>
        <div className="chat-sidebar-actions">
          <button className="chat-icon-button" title="Settings">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.502 10c0 .34-.03.66-.07.98l2.11 1.65c.19.15.24.42.12.64l-2 3.46c-.12.22-.39.31-.61.22l-2.49-1c-.52.39-1.08.73-1.69.98l-.38 2.65c-.03.24-.24.42-.49.42h-4c-.25 0-.46-.18-.49-.42l-.38-2.65c-.61-.25-1.17-.58-1.69-.98l-2.49 1c-.22.08-.49 0-.61-.22l-2-3.46c-.12-.22-.07-.49.12-.64l2.11-1.65c-.04-.32-.07-.65-.07-.98 0-.33.03-.66.07-.98L.462 7.37c-.19-.15-.24-.42-.12-.64l2-3.46c.12-.22.39-.31.61-.22l2.49 1c.52-.39 1.08-.73 1.69-.98l.38-2.65c.03-.24.24-.42.49-.42h4c.25 0 .46.18.49.42l.38 2.65c.61.25 1.17.59 1.69.98l2.49-1c.22-.09.49 0 .61.22l2 3.46c.12.22.07.49-.12.64l-2.11 1.65c.04.32.07.64.07.98zm-7.5 3c1.93 0 3.5-1.57 3.5-3.5S11.932 6 10.002 6 6.5 7.57 6.5 9.5 8.07 13 10.002 13z"/>
            </svg>
          </button>
          <button className="chat-icon-button" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2c-1.7 0-3 1.3-3 3v.3C5.2 6.1 4 7.8 4 10v3l-2 2v1h16v-1l-2-2v-3c0-2.2-1.2-3.9-3-4.7V5c0-1.7-1.3-3-3-3zm0 16c1.1 0 2-.9 2-2H8c0 1.1.9 2 2 2z"/>
            </svg>
          </button>
          <button className="chat-icon-button" title="New chat" onClick={onNewChat}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 2H2C.9 2 0 2.9 0 4v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-7 9H9v2H7v-2H5V9h2V7h2v2h2v2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="chat-sidebar-content">
        <div className="conversations-section">
          {threads.length === 0 ? (
            <div className="empty-conversations">
              <p>No conversations yet</p>
              <button className="start-chat-btn" onClick={onNewChat}>
                Start a new chat
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {threads.map(thread => (
                <div
                  key={thread.id}
                  className={`thread-item ${selectedThreadId === thread.id ? 'selected' : ''}`}
                  onClick={() => onThreadSelect(thread.id)}
                >
                  <div className="thread-avatar">
                    {thread.avatar ? (
                      <img src={thread.avatar} alt={thread.name} />
                    ) : (
                      <div className="thread-avatar-placeholder">
                        {thread.type === 'group' ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm6 0c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zM7 15c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4zm6 0c-.3 0-.7 0-1.1.1 1.3.9 2.1 2.1 2.1 3.9v2h8v-2c0-2.7-5.3-4-9-4z"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="thread-content">
                    <div className="thread-header-row">
                      <span className="thread-name">{thread.name}</span>
                      <span className="thread-timestamp">{thread.timestamp}</span>
                    </div>
                    <div className="thread-message-row">
                      <span className="thread-last-message">{thread.lastMessage}</span>
                      {thread.unread > 0 && (
                        <span className="thread-unread-badge">{thread.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        )}
        </div>
        </div>
    </div>
    );
};
export default ChatSidebar;
