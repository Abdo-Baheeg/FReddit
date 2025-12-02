// api methods using environment variable for base URL
import axios from 'axios';
const API_URL = 'https://freddit-production.up.railway.app';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// User API endpoints
export const userApi = {
  // Register new user
  register: async (username, email, password) => {
    const response = await axios.post(`${API_URL}/api/users/register`, {
      username,
      email,
      password
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// Post API endpoints
export const postApi = {
  // Get all posts
  getAllPosts: async () => {
    const response = await axios.get(`${API_URL}/api/posts`);
    return response.data;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await axios.get(`${API_URL}/api/posts/${postId}`);
    return response.data;
  },

  // Create new post
  createPost: async (title, content, subreddit) => {
    const response = await axios.post(
      `${API_URL}/api/posts/create`,
      { title, content, subreddit },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Vote on post
  voteOnPost: async (postId, voteType) => {
    const response = await axios.put(
      `${API_URL}/api/posts/${postId}/vote`,
      { voteType },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Generate post summary (AI)
  generateSummary: async (postId) => {
    const response = await axios.put(
      `${API_URL}/api/posts/${postId}/summary`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await axios.delete(
      `${API_URL}/api/posts/${postId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// Comment API endpoints
export const commentApi = {
  // Get comments for a post
  getCommentsForPost: async (postId) => {
    const response = await axios.get(`${API_URL}/api/comments/post/${postId}`);
    return response.data;
  },

  // Create comment
  createComment: async (content, postId, parentCommentId = null) => {
    const response = await axios.post(
      `${API_URL}/api/comments`,
      { content, postId, parentCommentId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Vote on comment
  voteOnComment: async (commentId, voteType) => {
    const response = await axios.put(
      `${API_URL}/api/comments/${commentId}/vote`,
      { voteType },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await axios.delete(
      `${API_URL}/api/comments/${commentId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// Community API endpoints
export const communityApi = {
  // Get all communities
  getAllCommunities: async () => {
    const response = await axios.get(`${API_URL}/api/communities/communities`);
    return response.data;
  },

  // Get community by ID
  getCommunityById: async (communityId) => {
    const response = await axios.get(`${API_URL}/api/communities/${communityId}`);
    return response.data;
  },

  // Create community
  createCommunity: async (name, description) => {
    const response = await axios.post(
      `${API_URL}/api/communities/create`,
      { name, description },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Join community
  joinCommunity: async (communityId) => {
    const response = await axios.post(
      `${API_URL}/api/communities/${communityId}/join`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Leave community
  leaveCommunity: async (communityId) => {
    const response = await axios.post(
      `${API_URL}/api/communities/${communityId}/leave`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// Chat API endpoints
export const chatApi = {
  // Get all conversations
  getConversations: async () => {
    const response = await axios.get(`${API_URL}/api/chat/conversations`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId, limit = 50, before = null) => {
    const params = { limit };
    if (before) params.before = before;
    
    const response = await axios.get(
      `${API_URL}/api/chat/conversations/${conversationId}/messages`,
      {
        headers: getAuthHeaders(),
        params
      }
    );
    return response.data;
  },

  // Create or get direct conversation
  createDirectConversation: async (userId) => {
    const response = await axios.post(
      `${API_URL}/api/chat/conversations/direct`,
      { userId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Create or get community conversation
  createCommunityConversation: async (communityId) => {
    const response = await axios.post(
      `${API_URL}/api/chat/conversations/community`,
      { communityId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Send message (HTTP fallback)
  sendMessage: async (conversationId, content) => {
    const response = await axios.post(
      `${API_URL}/api/chat/messages`,
      { conversationId, content },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await axios.delete(
      `${API_URL}/api/chat/messages/${messageId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// Health check endpoint
export const healthApi = {
  // Check API health
  checkHealth: async () => {
    const response = await axios.get(`${API_URL}/api/health`);
    return response.data;
  }
};

export default API_URL;

