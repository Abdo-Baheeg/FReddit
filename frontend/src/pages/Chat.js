import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { chatApi } from '../api';
import './Chat.css';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { 
    connected, 
    conversations, 
    setConversations,
    messages, 
    setMessages,
    unreadCounts,
    typingUsers,
    sendMessage, 
    markAsRead, 
    setTyping 
  } = useSocket();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await chatApi.getConversations();
        setConversations(convs);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        setLoading(false);
      }
    };

    loadConversations();
  }, [setConversations]);

  // Select conversation from URL or first one
  useEffect(() => {
    if (conversations.length > 0) {
      if (conversationId) {
        const conv = conversations.find(c => c._id === conversationId);
        if (conv) {
          setSelectedConversation(conv);
        }
      } else {
        setSelectedConversation(conversations[0]);
        navigate(`/chat/${conversations[0]._id}`);
      }
    }
  }, [conversations, conversationId, navigate]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const msgs = await chatApi.getMessages(selectedConversation._id);
          setMessages(prev => ({
            ...prev,
            [selectedConversation._id]: msgs
          }));
          markAsRead(selectedConversation._id);
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      }
    };

    if (selectedConversation && !messages[selectedConversation._id]) {
      loadMessages();
    } else if (selectedConversation) {
      markAsRead(selectedConversation._id);
    }
  }, [selectedConversation, messages, setMessages, markAsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    navigate(`/chat/${conv._id}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedConversation) {
      sendMessage(selectedConversation._id, messageInput);
      setMessageInput('');
      setTyping(selectedConversation._id, false);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    if (selectedConversation) {
      setTyping(selectedConversation._id, true);
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        setTyping(selectedConversation._id, false);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const getConversationName = (conv) => {
    if (conv.type === 'community') {
      return conv.community?.name || 'Community Chat';
    } else {
      const currentUserId = localStorage.getItem('userId');
      const otherUser = conv.participants.find(p => p._id !== currentUserId);
      return otherUser?.username || 'Direct Message';
    }
  };

  const getConversationAvatar = (conv) => {
    if (conv.type === 'community') {
      return '👥';
    } else {
      const currentUserId = localStorage.getItem('userId');
      const otherUser = conv.participants.find(p => p._id !== currentUserId);
      return otherUser?.avatar_url || '👤';
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const currentUserId = localStorage.getItem('userId');
  const currentMessages = selectedConversation ? messages[selectedConversation._id] || [] : [];
  const typingInCurrent = selectedConversation ? typingUsers[selectedConversation._id] || {} : {};
  const typingNames = Object.values(typingInCurrent);

  if (loading) {
    return <div className="chat-container"><p>Loading conversations...</p></div>;
  }

  if (!connected) {
    return (
      <div className="chat-container">
        <p className="chat-disconnected">⚠️ Disconnected from chat server. Reconnecting...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv._id}
                className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="conversation-avatar">
                  {getConversationAvatar(conv)}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">
                    {getConversationName(conv)}
                    {unreadCounts[conv._id] > 0 && (
                      <span className="unread-badge">{unreadCounts[conv._id]}</span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <div className="conversation-preview">
                      {conv.lastMessage.sender?.username}: {conv.lastMessage.content.substring(0, 30)}...
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{getConversationName(selectedConversation)}</h3>
              {selectedConversation.type === 'community' && (
                <p className="chat-header-subtitle">
                  {selectedConversation.participants.length} members
                </p>
              )}
            </div>

            <div className="chat-messages">
              {currentMessages.map((msg, index) => {
                const isOwn = msg.sender._id === currentUserId;
                const showAvatar = index === 0 || currentMessages[index - 1].sender._id !== msg.sender._id;

                return (
                  <div
                    key={msg._id}
                    className={`message ${isOwn ? 'message-own' : 'message-other'}`}
                  >
                    {!isOwn && showAvatar && (
                      <div className="message-avatar">
                        {msg.sender.avatar_url || '👤'}
                      </div>
                    )}
                    <div className="message-content">
                      {!isOwn && showAvatar && (
                        <div className="message-sender">{msg.sender.username}</div>
                      )}
                      <div className="message-bubble">
                        <p>{msg.content}</p>
                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {typingNames.length > 0 && (
                <div className="typing-indicator">
                  {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={messageInput}
                onChange={handleInputChange}
                disabled={!connected}
              />
              <button type="submit" className="chat-send-btn" disabled={!messageInput.trim() || !connected}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
