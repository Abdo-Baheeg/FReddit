import React, { useState, useEffect } from 'react';
import { MessageCircle, Home, Mail, Filter, ChevronDown, Plus, Reply, ChevronRight, Check } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { chatApi, userApi } from '../api';
import ChatWindow from '../components/Chat/ChatWindow';
import NewChatModal from '../components/Chat/NewChatModal';
import './ChatUI.css';

const RedditChatUI = () => {
  const { socket, connected } = useSocket();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    groupChats: true,
    directChats: true,
    modMail: true,
    unread: false
  });
  const [selectedThread, setSelectedThread] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await userApi.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Failed to load user data');
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatApi.getConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const { message, conversationId } = data;
      
      // Update conversation list
      setConversations(prev => 
        prev.map(conv => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: message,
              updatedAt: new Date()
            };
          }
          return conv;
        })
      );

      // Sort by most recent
      setConversations(prev => 
        [...prev].sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    };

    const handleUnreadUpdate = (data) => {
      const { conversationId, unreadCount } = data;
      setConversations(prev =>
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount } 
            : conv
        )
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('unread_update', handleUnreadUpdate);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('unread_update', handleUnreadUpdate);
    };
  }, [socket]);

  const formatConversationToThread = (conv) => {
    const isGroup = conv.type === 'community';
    let name = '';
    let avatar = null;

    if (isGroup) {
      name = conv.community?.name || 'Unknown Community';
      avatar = conv.community?.avatarUrl || null;
    } else {
      const otherParticipant = conv.participants?.find(
        p => p._id !== currentUser?._id
      );
      name = otherParticipant?.username ? `u/${otherParticipant.username}` : 'Unknown User';
      avatar = otherParticipant?.avatar_url || null;
    }

    return {
      id: conv._id,
      type: isGroup ? 'group' : 'direct',
      name,
      lastMessage: conv.lastMessage?.content || 'No messages yet',
      timestamp: formatTimestamp(conv.updatedAt),
      unread: conv.unreadCount || 0,
      avatar,
      conversationData: conv
    };
  };

  // Format conversations to thread format
  const threads = conversations.map(conv => formatConversationToThread(conv));

  // Filter threads based on filter settings
  const filteredThreads = threads.filter(thread => {
    if (filters.unread && thread.unread === 0) return false;
    if (!filters.groupChats && thread.type === 'group') return false;
    if (!filters.directChats && thread.type === 'direct') return false;
    // modMail filter can be added when modmail is implemented
    return true;
  });

  const handleThreadSelect = (threadId) => {
    const thread = threads.find(t => t.id === threadId);
    setSelectedThread(thread);
    
    // Join conversation room via socket
    if (socket && connected && thread) {
      socket.emit('join_conversation', { conversationId: thread.id });
    }
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleCreateChat = async (type, targetId) => {
    try {
      let conversation;
      if (type === 'user') {
        conversation = await chatApi.createDirectConversation(targetId);
      } else {
        conversation = await chatApi.createCommunityConversation(targetId);
      }
      
      // Add to conversations if not already there
      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      
      // Select the new conversation
      const thread = formatConversationToThread(conversation);
      setSelectedThread(thread);
      
      // Join via socket
      if (socket && connected) {
        socket.emit('join_conversation', { conversationId: conversation._id });
      }
      
      setShowNewChatModal(false);
    } catch (err) {
      console.error('Error creating conversation:', err);
      alert('Failed to create conversation. Please try again.');
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedThread) return;

    try {
      await chatApi.sendMessage(selectedThread.id, content);
      // Message will be added via socket event
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="chat-container">
      {/* Left Sidebar - Chat List */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <a href="https://www.reddit.com" target="_blank" rel="noopener noreferrer" className="logo-link">
              <Home size={20} />
            </a>
          </div>
          <span className="sidebar-title">Chats</span>
          <div className="header-actions">
            <button className="icon-btn" title="Mark all messages as read">
              <Mail size={16} />
            </button>
            <button className="icon-btn" title="Create new chat" onClick={handleNewChat}>
              <Plus size={16} />
            </button>
            <div className="filter-dropdown">
              <button 
                className="icon-btn filter-btn" 
                onClick={() => setFilterOpen(!filterOpen)}
                title="Filter chat inbox"
              >
                <Filter size={16} />
                <ChevronDown size={16} className="chevron" />
              </button>
              
              {filterOpen && (
                <div className="dropdown-menu">
                  <div className="filter-item" onClick={() => toggleFilter('groupChats')}>
                    <span>Group chats</span>
                    <div className={`checkbox ${filters.groupChats ? 'checked' : ''}`}>
                      {filters.groupChats && <Check size={12} />}
                    </div>
                  </div>
                  <div className="filter-item" onClick={() => toggleFilter('directChats')}>
                    <span>Direct chats</span>
                    <div className={`checkbox ${filters.directChats ? 'checked' : ''}`}>
                      {filters.directChats && <Check size={12} />}
                    </div>
                  </div>
                  <div className="filter-item" onClick={() => toggleFilter('modMail')}>
                    <span>Mod mail</span>
                    <div className={`checkbox ${filters.modMail ? 'checked' : ''}`}>
                      {filters.modMail && <Check size={12} />}
                    </div>
                  </div>
                  <div className="filter-item" onClick={() => toggleFilter('unread')}>
                    <span>Unread</span>
                    <div className={`toggle ${filters.unread ? 'active' : ''}`}>
                      <div className="toggle-knob"></div>
                    </div>
                  </div>
                  <div className="filter-actions">
                    <button className="apply-btn" onClick={() => setFilterOpen(false)}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Threads Item */}
        <div className="nav-item threads-item">
          <Reply size={20} />
          <div className="nav-item-content">
            <span className="nav-item-title">Threads</span>
          </div>
          <ChevronRight size={20} className="chevron-right" />
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {loading && (
            <div className="chat-list-loading">Loading conversations...</div>
          )}
          
          {!loading && error && (
            <div className="chat-list-error">{error}</div>
          )}
          
          {!loading && !error && filteredThreads.length === 0 && (
            <div className="chat-list-empty">
              <p>No conversations found</p>
            </div>
          )}
          
          {!loading && !error && filteredThreads.map(thread => (
            <div
              key={thread.id}
              className={`chat-item ${selectedThread?.id === thread.id ? 'active' : ''}`}
              onClick={() => handleThreadSelect(thread.id)}
            >
              <div className="chat-avatar">
                {thread.avatar ? (
                  <img src={thread.avatar} alt={thread.name} />
                ) : (
                  <div className="chat-avatar-placeholder">
                    {thread.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="chat-info">
                <div className="chat-header-row">
                  <span className="chat-name">{thread.name}</span>
                  <span className="chat-time">{thread.timestamp}</span>
                </div>
                <div className="chat-message-row">
                  <span className="chat-last-message">{thread.lastMessage}</span>
                  {thread.unread > 0 && (
                    <span className="chat-unread-badge">{thread.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedThread ? (
          <ChatWindow 
            thread={selectedThread} 
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="welcome-screen">
            <img 
              src="https://www.redditstatic.com/chat-web/images/welcome-6AUNLRD4.png" 
              alt="Welcome to chat!"
              className="welcome-image"
            />
            <h2 className="welcome-title">Welcome to chat!</h2>
            <p className="welcome-text">Start a direct or group chat with other redditors.</p>
            <button className="start-chat-btn" onClick={handleNewChat}>
              <MessageCircle size={20} />
              Start new chat
            </button>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <NewChatModal 
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleCreateChat}
        />
      )}

      <style jsx>{`
        .chat-container {
          display: flex;
          height: 100vh;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .sidebar {
          width: 320px;
          border-right: 1px solid #e5e5e5;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 8px;
          border-bottom: 1px solid #e5e5e5;
        }

        .logo-container {
          height: 32px;
          margin-right: 8px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #ff4500;
          text-decoration: none;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: #1c1c1c;
          user-select: none;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border: none;
          background: transparent;
          color: #1c1c1c;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: #f6f7f8;
        }

        .filter-btn {
          gap: 4px;
        }

        .filter-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 8px;
          z-index: 100;
        }

        .filter-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .filter-item:hover {
          background: #f6f7f8;
        }

        .filter-item span {
          font-size: 14px;
          color: #1c1c1c;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #878a8c;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .checkbox.checked {
          background: #ff4500;
          border-color: #ff4500;
          color: white;
        }

        .toggle {
          width: 40px;
          height: 20px;
          background: #878a8c;
          border-radius: 10px;
          position: relative;
          transition: background 0.2s;
        }

        .toggle.active {
          background: #ff4500;
        }

        .toggle-knob {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.2s;
        }

        .toggle.active .toggle-knob {
          transform: translateX(20px);
        }

        .filter-actions {
          padding: 8px 4px 0;
          display: flex;
          justify-content: flex-end;
        }

        .apply-btn {
          padding: 6px 16px;
          background: #ff4500;
          color: white;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-btn:hover {
          background: #e63e00;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          color: #1c1c1c;
        }

        .nav-item:hover {
          background: #f6f7f8;
        }

        .threads-item {
          border-bottom: 1px solid #e5e5e5;
        }

        .nav-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item-title {
          font-size: 16px;
          font-weight: 500;
        }

        .chevron-right {
          color: #878a8c;
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
        }

        .chat-list-loading,
        .chat-list-error,
        .chat-list-empty {
          padding: 20px;
          text-align: center;
          color: #7c7c7c;
          font-size: 14px;
        }

        .chat-list-error {
          color: #ea0027;
        }

        .chat-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border-left: 3px solid transparent;
        }

        .chat-item:hover {
          background: #f6f7f8;
        }

        .chat-item.active {
          background: #f6f7f8;
          border-left-color: #ff4500;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .chat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .chat-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #ff4500;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }

        .chat-info {
          flex: 1;
          min-width: 0;
        }

        .chat-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .chat-name {
          font-size: 14px;
          font-weight: 600;
          color: #1c1c1c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chat-time {
          font-size: 12px;
          color: #7c7c7c;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .chat-message-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-last-message {
          font-size: 13px;
          color: #7c7c7c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .chat-unread-badge {
          background: #ff4500;
          color: white;
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 700;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .main-content {
          flex: 1;
          display: flex;
          background: #ffffff;
        }

        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 400px;
          padding: 40px;
          margin: auto;
        }

        .welcome-image {
          width: 200px;
          height: auto;
          margin-bottom: 24px;
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1c1c1c;
          margin: 0 0 12px 0;
        }

        .welcome-text {
          font-size: 14px;
          color: #7c7c7c;
          margin: 0 0 24px 0;
        }

        .start-chat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #ff4500;
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .start-chat-btn:hover {
          background: #e63e00;
        }

        .chevron {
          color: #878a8c;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

// Helper function to format timestamps
function formatTimestamp(date) {
  if (!date) return '';
  
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return messageDate.toLocaleDateString();
}

export default RedditChatUI;