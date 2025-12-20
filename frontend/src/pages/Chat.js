import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { chatApi } from '../api';
import { userApi } from '../api';
import { MessageCircle } from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWelcome from '../components/ChatWelcome';
import NewChatModal from '../components/NewChatModal';
import ChatHeader from '../components/ChatHeader';
import ChatMessagesArea from '../components/ChatMessagesArea';
import ChatInput from '../components/ChatInput';
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
    setTyping,
    joinConversation
  } = useSocket();

  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
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
  
  // ================= Handlers =================
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    navigate(`/chat/${conv._id}`);
  };
  
  const handleStartNewChat = () => {
    setShowNewChatModal(true);
  };
  
  const handleChatCreated = (conversation) => {
    // Add new conversation to list if not already there
    const exists = conversations.find(c => c._id === conversation._id);
    if (!exists) {
      setConversations([conversation, ...conversations]);
    }
    // Select the new conversation
    setSelectedConversation(conversation);
    navigate(`/chat/${conversation._id}`);
    
    // Join the conversation via socket
    if (joinConversation) {
      joinConversation(conversation._id);
    }
  };
  
  const handleSendMessageFromInput = (content) => {
    if (selectedConversation && content.trim()) {
      sendMessage(selectedConversation._id, content);
      setTyping(selectedConversation._id, false);
    }
  };
  
  const [currentUserId, setCurrentUserId] = useState(null);
  const currentMessages = selectedConversation ? messages[selectedConversation._id] || [] : [];
  const typingInCurrent = selectedConversation ? typingUsers[selectedConversation._id] || {} : {};

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
    <div className="chat-container">
      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onChatCreated={handleChatCreated}
      />

      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onStartNewChat={handleStartNewChat}
        unreadCounts={unreadCounts}
      />

      {/* Main Chat Area */}
      <div className="chat-main">
        {!selectedConversation && conversations.length === 0 ? (
          <ChatWelcome onStartChat={handleStartNewChat} />
        ) : selectedConversation ? (
          <>
            <ChatHeader 
              conversation={selectedConversation}
              onClose={() => navigate('/')}
              onMinimize={() => console.log('Minimize')}
              onOpenNewWindow={() => console.log('Open in new window')}
            />

            <ChatMessagesArea
              messages={currentMessages}
              currentUserId={currentUserId}
              typingUsers={typingInCurrent}
            />

            <ChatInput
              onSendMessage={handleSendMessageFromInput}
              disabled={!connected}
              conversationId={selectedConversation._id}
            />
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-content">
              <MessageCircle size={64} strokeWidth={1.5} className="empty-icon" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Chat;
