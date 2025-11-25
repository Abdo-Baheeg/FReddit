// api methods using environment variable for base URL
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

// Chat API endpoints
export const chatApi = {
  // Get all conversations
  getConversations: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId, limit = 50, before = null) => {
    const token = localStorage.getItem('token');
    const params = { limit };
    if (before) params.before = before;
    
    const response = await axios.get(
      `${API_URL}/api/chat/conversations/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params
      }
    );
    return response.data;
  },

  // Create or get direct conversation
  createDirectConversation: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/chat/conversations/direct`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Create or get community conversation
  createCommunityConversation: async (communityId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/chat/conversations/community`,
      { communityId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Send message (HTTP fallback)
  sendMessage: async (conversationId, content) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/chat/messages`,
      { conversationId, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/api/chat/messages/${messageId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default API_URL;

