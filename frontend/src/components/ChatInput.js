import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { ImagePlus, Smile, Send, PlusCircle, FileImage, Sticker } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled = false, conversationId }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { setTyping } = useSocket();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      // Stop typing indicator
      if (conversationId && setTyping) {
        setTyping(conversationId, false);
      }
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    if (conversationId && setTyping && e.target.value.trim()) {
      setTyping(conversationId, true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator after 1 second
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(conversationId, false);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = () => {
    console.log('Image upload not implemented');
    // TODO: Implement image upload
  };

  const handleEmojiPicker = () => {
    console.log('Emoji picker not implemented');
    // TODO: Implement emoji picker
  };

  const handleGifPicker = () => {
    console.log('GIF picker not implemented');
    // TODO: Implement GIF picker
  };

  const handleAttachment = () => {
    console.log('Attachment not implemented');
    // TODO: Implement attachment
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form-wrapper">
        {/* Main input area */}
        <div className="chat-input-main">
          <div className="chat-input-field">
            <textarea
              ref={textareaRef}
              className="chat-input-textarea"
              placeholder="Message"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              rows={1}
            />

            <div className="chat-input-actions">
              <button
                type="button"
                className="chat-input-icon-btn"
                onClick={handleImageUpload}
                title="Add photo"
                disabled={disabled}
              >
                <ImagePlus size={20} />
              </button>

              <button
                type="button"
                className="chat-input-icon-btn"
                onClick={handleEmojiPicker}
                title="Add emoji"
                disabled={disabled}
              >
                <Smile size={20} />
              </button>

              <button
                type="submit"
                className="chat-input-send-btn"
                disabled={!message.trim() || disabled}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Additional options */}
        <div className="chat-input-options">
          <div className="chat-input-options-left">
            <button
              type="button"
              className="chat-input-option-btn"
              onClick={handleAttachment}
              title="Add attachment"
              disabled={disabled}
            >
              <PlusCircle size={20} />
            </button>

            <button
              type="button"
              className="chat-input-option-btn"
              onClick={handleGifPicker}
              title="Add GIF"
              disabled={disabled}
            >
              <FileImage size={20} />
            </button>

            <button
              type="button"
              className="chat-input-option-btn"
              onClick={handleEmojiPicker}
              title="Add sticker"
              disabled={disabled}
            >
              <Sticker size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
