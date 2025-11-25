import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5050', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        newSocket.emit('join_conversations');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('conversations_joined', (data) => {
        console.log(`Joined ${data.count} conversations`);
      });

      newSocket.on('new_message', (data) => {
        const { message, conversationId } = data;
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), message]
        }));
      });

      newSocket.on('unread_update', (data) => {
        const { conversationId, unreadCount } = data;
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: unreadCount
        }));
      });

      newSocket.on('user_typing', (data) => {
        const { userId, username, isTyping, conversationId } = data;
        setTypingUsers(prev => {
          const convTyping = prev[conversationId] || {};
          if (isTyping) {
            return {
              ...prev,
              [conversationId]: { ...convTyping, [userId]: username }
            };
          } else {
            const { [userId]: _, ...rest } = convTyping;
            return {
              ...prev,
              [conversationId]: rest
            };
          }
        });
      });

      newSocket.on('message_deleted', (data) => {
        const { messageId, conversationId } = data;
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(msg =>
            msg._id === messageId ? { ...msg, deleted: true, content: '[Message deleted]' } : msg
          )
        }));
      });

      newSocket.on('error', (data) => {
        console.error('Socket error:', data.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const sendMessage = useCallback((conversationId, content) => {
    if (socket && connected) {
      socket.emit('send_message', { conversationId, content });
    }
  }, [socket, connected]);

  const markAsRead = useCallback((conversationId) => {
    if (socket && connected) {
      socket.emit('mark_read', { conversationId });
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
    }
  }, [socket, connected]);

  const setTyping = useCallback((conversationId, isTyping) => {
    if (socket && connected) {
      socket.emit('typing', { conversationId, isTyping });
    }
  }, [socket, connected]);

  const joinConversation = useCallback((conversationId) => {
    if (socket && connected) {
      socket.emit('join_conversation', { conversationId });
    }
  }, [socket, connected]);

  const value = {
    socket,
    connected,
    conversations,
    setConversations,
    messages,
    setMessages,
    unreadCounts,
    setUnreadCounts,
    typingUsers,
    sendMessage,
    markAsRead,
    setTyping,
    joinConversation
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
