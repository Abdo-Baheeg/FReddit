import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { chatApi, userApi } from '../api';
import './Chat.css';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { 
    connected, 
    conversations, 
    setConversations,
    messages, 
    setMessages,
    typingUsers,
    sendMessage, 
    markAsRead, 
    setTyping 
  } = useSocket();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const messagesEndRef = useRef(null);

  const getOtherUser = (conv) => {
  if (!conv || conv.type === 'community') return null;
  return conv.participants.find(
    p => String(p._id) !== String(currentUserId)
  );
};


  // ================= Load current user =================
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await userApi.getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(String(user.id));
        }
      } catch (err) {
        console.error('Failed to load current user:', err);
      }
    };
    loadCurrentUser();
  }, []);

  // ================= Load conversations =================
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await chatApi.getConversations();
        setConversations(convs);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadConversations();
  }, [setConversations]);

  // ================= Auto select conversation =================
  useEffect(() => {
    if (!conversations.length) return;

    if (conversationId) {
      const conv = conversations.find(c => c._id === conversationId);
      if (conv) setSelectedConversation(conv);
    } else {
      setSelectedConversation(conversations[0]);
      navigate(`/chat/${conversations[0]._id}`);
    }
  }, [conversations, conversationId, navigate]);

  // ================= Load messages =================
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        const msgs = await chatApi.getMessages(selectedConversation._id);
        setMessages(prev => ({
          ...prev,
          [selectedConversation._id]: msgs
        }));
        markAsRead(selectedConversation._id);
      } catch (err) {
        console.error(err);
      }
    };

    if (selectedConversation && !messages[selectedConversation._id]) {
      loadMessages();
    } else if (selectedConversation) {
      markAsRead(selectedConversation._id);
    }
  }, [selectedConversation, messages, setMessages, markAsRead]);

  // ================= Auto scroll =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // ================= Handlers =================
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    navigate(`/chat/${conv._id}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    sendMessage(selectedConversation._id, messageInput);
    setMessageInput('');
    setTyping(selectedConversation._id, false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!selectedConversation) return;

    setTyping(selectedConversation._id, true);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setTyping(selectedConversation._id, false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  // ================= Helpers =================
  const getConversationName = (conv) => {
    if (conv.type === 'community') return conv.community?.name || 'Community Chat';
    const other = conv.participants.find(p => String(p._id) !== String(currentUserId));
    return other?.username || 'Direct Message';
  };

  const getConversationAvatar = (conv) => {
    if (conv.type === 'community') return '👥';
    const other = conv.participants.find(p => String(p._id) !== String(currentUserId));
    return other?.avatar_url || '👤';
  };

  const currentMessages = selectedConversation
    ? messages[selectedConversation._id] || []
    : [];

  // ================= States =================
  if (loading) {
    return <div className="chat-container">Loading...</div>;
  }

  if (!connected) {
    return (
      <div className="chat-container">
        <p className="chat-disconnected">Disconnected… reconnecting</p>
      </div>
    );
  }

  // ================= Render =================
  // ... inside Chat.js ...

  return (
    <div className={`chat-container ${isDarkMode ? 'chat-dark-mode' : ''}`}>
      
      {/* Sidebar (Keep your existing sidebar code here) */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header"><h2>Chats</h2></div>
        <div className="conversation-list">
          {conversations.map(conv => (
            <div
              key={conv._id}
              className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="conversation-avatar">{getConversationAvatar(conv)}</div>
              <div className="conversation-info">
                <div className="conversation-name">{getConversationName(conv)}</div>
                <div className="conversation-preview">
                    {/* Prefix 'You:' if it's your last message */}
                    {String(conv.lastMessage?.sender?._id) === String(currentUserId) ? 'You: ' : ''}
                    {conv.lastMessage?.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
  {selectedConversation?.type === 'community' ? (
    <h3>{getConversationName(selectedConversation)}</h3>
  ) : (
    <h3
      className="chat-header-username"
      onClick={() => {
        const otherUser = getOtherUser(selectedConversation);
        if (otherUser?._id) {
          navigate(`/profile/${otherUser._id}`);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {getConversationName(selectedConversation)}
    </h3>
  )}
</div>


            <div className="chat-messages">
              {currentMessages.map((msg, index) => {
                // Get sender ID - handle both populated and non-populated cases
                const senderId = msg.sender?._id || msg.sender;
                const msgSenderId = senderId ? String(senderId) : null;
                const userId = currentUserId ? String(currentUserId) : null;
                
                // Determine if this is the current user's message
                const isOwn = msgSenderId && userId && msgSenderId === userId;
                
                // Check if this message starts a new group from a different user
                const prevSenderId = currentMessages[index - 1]?.sender?._id || currentMessages[index - 1]?.sender;
                const isNewGroup = index === 0 || 
                  String(prevSenderId) !== String(msgSenderId);

                return (
                  <div 
                    key={msg._id} 
                    className={`message ${isOwn ? "message-own" : "message-other"}`}
                  >
                    {/* Avatar only for receiver messages (left side) */}
                    {!isOwn && (
                      <div className="message-avatar" style={{visibility: isNewGroup ? 'visible' : 'hidden'}}>
                        {msg.sender?.avatar_url || "👤"}
                      </div>
                    )}

                    <div className="message-content">
                      {/* Username only for receiver messages (left side), and only once per group */}
                      {!isOwn && isNewGroup && (
                        <div className="message-sender">{msg.sender?.username || 'User'}</div>
                      )}
                      
                      <div className="message-bubble">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Message"
                value={messageInput}
                onChange={handleInputChange}
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </form>
          </>
        ) : (
          <div className="chat-empty">Select a conversation</div>
        )}
      </div>
    </div>
  );
};
export default Chat;
