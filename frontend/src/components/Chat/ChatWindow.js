import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { chatApi } from '../../api';
import './ChatWindow.css';

const ChatWindow = ({ thread, currentUser, onSendMessage }) => {
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when thread changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!thread) return;
      
      try {
        setLoading(true);
        const data = await chatApi.getMessages(thread.id);
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [thread]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket || !thread) return;

    const handleNewMessage = (data) => {
      const { message: newMessage, conversationId } = data;
      
      if (conversationId === thread.id) {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    const handleMessageDeleted = (data) => {
      const { messageId, conversationId } = data;
      
      if (conversationId === thread.id) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === messageId 
              ? { ...msg, deleted: true, content: '[Message deleted]' }
              : msg
          )
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, thread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && !sending) {
      setSending(true);
      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message. Please try again.');
      } finally {
        setSending(false);
      }
    }
  };

  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="chat-window">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#7C7C7C'
        }}>
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-window-header-left">
          <div className="chat-window-avatar">
            {thread.avatar ? (
              <img src={thread.avatar} alt={thread.name} />
            ) : (
              <div className="chat-window-avatar-placeholder">
                {thread.type === 'group' ? (
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm6 0c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zM7 15c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4zm6 0c-.3 0-.7 0-1.1.1 1.3.9 2.1 2.1 2.1 3.9v2h8v-2c0-2.7-5.3-4-9-4z"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                )}
              </div>
            )}
          </div>
          <div className="chat-window-info">
            <h3 className="chat-window-name">{thread.name}</h3>
            <span className="chat-window-status">Active now</span>
          </div>
        </div>
        <div className="chat-window-header-actions">
          <button className="chat-header-button" title="Call">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
          <button className="chat-header-button" title="Video call">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button className="chat-header-button" title="Info">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-6h2v6zm0-8H9V5h2v2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((msg) => {
            const isOwn = msg.sender._id === currentUser?._id;
            const senderName = msg.sender.username;
            
            return (
              <div key={msg._id} className={`message ${isOwn ? 'own' : ''}`}>
                {!isOwn && thread.type === 'group' && (
                  <div className="message-sender-name">u/{senderName}</div>
                )}
                <div className="message-bubble">
                  <div className="message-content">{msg.content}</div>
                </div>
                <div className="message-timestamp">
                  {formatMessageTime(msg.createdAt)}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <button type="button" className="chat-input-attach" title="Attach file">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
            </svg>
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="button" className="chat-input-emoji" title="Add emoji">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5 5.67 9 6.5 9zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </button>
          <button 
            type="submit" 
            className="chat-input-send"
            disabled={!message.trim() || sending}
            title="Send message"
          >
            {sending ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.01 1L2 8l15 2-15 2 .01 7L22 10 2.01 1z"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
