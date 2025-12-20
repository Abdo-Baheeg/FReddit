import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { chatApi } from '../api';
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
    setTyping,
    joinConversation
  } = useSocket();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

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

  // Select conversation automatically
  useEffect(() => {
    if (conversations.length > 0) {
      if (conversationId) {
        const conv = conversations.find(c => c._id === conversationId);
        if (conv) setSelectedConversation(conv);
      } else {
        setSelectedConversation(conversations[0]);
        navigate(`/chat/${conversations[0]._id}`);
      }
    }
  }, [conversations, conversationId, navigate]);

  // Load messages for selected convo
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const msgs = await chatApi.getMessages(selectedConversation._id);
          setMessages(prev => ({ ...prev, [selectedConversation._id]: msgs }));
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

  const currentUserId = localStorage.getItem('userId');
  const currentMessages = selectedConversation ? messages[selectedConversation._id] || [] : [];
  const typingInCurrent = selectedConversation ? typingUsers[selectedConversation._id] || {} : {};

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

      {/* Main chat area */}
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
