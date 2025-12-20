import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquarePlus, SlidersHorizontal, ChevronDown, Users, User, ArrowLeft, ChevronRight } from 'lucide-react';
import './ChatSidebar.css';

const ChatSidebar = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  onStartNewChat,
  onGoHome,
  unreadCounts 
}) => {
  const navigate = useNavigate();

  const getConversationName = (conv) => {
    const currentUserId = localStorage.getItem('userId');
    if (conv.type === 'community') return conv.community?.name || 'Community Chat';
    const otherUser = conv.participants.find(p => p._id !== currentUserId);
    return otherUser?.username || 'Direct Message';
  };

  const getConversationAvatar = (conv) => {
    const currentUserId = localStorage.getItem('userId');
    if (conv.type === 'community') {
      return (
        <div className="conversation-avatar-icon">
          <Users size={24} />
        </div>
      );
    }
    const otherUser = conv.participants.find(p => p._id !== currentUserId);
    if (otherUser?.avatar_url) {
      return <img src={otherUser.avatar_url} alt={otherUser.username} className="conversation-avatar-img" />;
    }
    return (
      <div className="conversation-avatar-icon">
        <User size={24} />
      </div>
    );
  };

  const formatLastMessageTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <aside className="chat-sidebar">
      {/* Header */}
      <div className="chat-sidebar-header">
        <div className="chat-sidebar-title">
          <MessageSquarePlus size={24} className="reddit-icon" />
          <h1>Chats</h1>
        </div>
        
        <div className="chat-sidebar-actions">
          <button 
            className="sidebar-action-btn" 
            onClick={handleGoHome}
            title="Go to home"
          >
            <Home size={20} />
          </button>
          <button 
            className="sidebar-action-btn" 
            onClick={onStartNewChat}
            title="Start new chat"
          >
            <MessageSquarePlus size={20} />
          </button>
          <button 
            className="sidebar-action-btn"
            title="Settings"
          >
            <SlidersHorizontal size={20} />
          </button>
          <button 
            className="sidebar-action-btn"
            title="More options"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>

      {/* Threads button */}
      <div className="chat-sidebar-section">
        <button className="threads-btn">
          <div className="threads-btn-content">
            <ArrowLeft size={20} />
            <span>Threads</span>
          </div>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Conversations list */}
      <div className="conversations-container">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
            <button className="start-chat-link" onClick={onStartNewChat}>
              Start a new chat
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            const unreadCount = unreadCounts[conv._id] || 0;
            const isSelected = selectedConversation?._id === conv._id;
            
            return (
              <div
                key={conv._id}
                className={`conversation-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="conversation-avatar">
                  {getConversationAvatar(conv)}
                </div>

                <div className="conversation-details">
                  <div className="conversation-header">
                    <span className="conversation-name">
                      {getConversationName(conv)}
                    </span>
                    {conv.lastMessage && (
                      <span className="conversation-time">
                        {formatLastMessageTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  <div className="conversation-preview">
                    {conv.lastMessage ? (
                      <>
                        <span className="preview-text">
                          {conv.lastMessage.sender?.username}: {conv.lastMessage.content}
                        </span>
                        {unreadCount > 0 && (
                          <span className="unread-badge">{unreadCount}</span>
                        )}
                      </>
                    ) : (
                      <span className="preview-text empty">No messages yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
