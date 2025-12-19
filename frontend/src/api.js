// api methods using environment variable for base URL
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL configured as:', API_URL);

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
  },

  // Resend email verification
  resendVerification: async () => {
    const response = await axios.post(
      `${API_URL}/api/users/resend-verification`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await axios.get(`${API_URL}/api/users/verify-email/${token}`);
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/api/users/forgot-password`, {
      email
    });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await axios.post(`${API_URL}/api/users/reset-password/${token}`, {
      password
    });
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId, page = 1, limit = 20, sort = 'new') => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/posts`, {
      params: { page, limit, sort }
    });
    return response.data;
  },

  // Get user comments
  getUserComments: async (userId, page = 1, limit = 20, sort = 'new') => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/comments`, {
      params: { page, limit, sort }
    });
    return response.data;
  },

  // Get user upvoted items
  getUserUpvoted: async (userId, page = 1, limit = 20, type = 'all') => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/upvoted`, {
      params: { page, limit, type }
    });
    return response.data;
  },

  // Get user downvoted items
  getUserDownvoted: async (userId, page = 1, limit = 20, type = 'all') => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/downvoted`, {
      params: { page, limit, type }
    });
    return response.data;
  },

  // Get user overview (posts and comments combined)
  getUserOverview: async (userId, page = 1, limit = 20, sort = 'new') => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/overview`, {
      params: { page, limit, sort }
    });
    return response.data;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await axios.get(`${API_URL}/api/users/${userId}/stats`);
    return response.data;
  },

  // Update entire user profile
  updateProfile: async (updateData) => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      updateData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Update username only
  updateUsername: async (username) => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      { username },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Update email only
  updateEmail: async (email) => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      { email },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Update bio only
  updateBio: async (bio) => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      { bio },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Update avatar URL only
  updateAvatar: async (avatar_url) => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      { avatar_url },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  //update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await axios.put(
      `${API_URL}/api/users/me/password`,
      { currentPassword, newPassword },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Delete user account (requires password confirmation)
  deleteAccount: async (password) => {
    const response = await axios.delete(
      `${API_URL}/api/users/me`,
      {
        headers: getAuthHeaders(),
        data: { password }
      }
    );
    return response.data;
  },

  // Search for users by username
  searchUsers: async (query, limit = 10) => {
    const response = await axios.get(`${API_URL}/api/users/search`, {
      params: { q: query, limit },
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

  // get posts by user ID (with pagination)
  getPostsByUserId: async (userId, page = 1, limit = 20, sort = 'new') => {
    const response = await axios.get(`${API_URL}/api/posts/user/${userId}`, {
      params: { page, limit, sort }
    });
    return response.data;
  },

  /**
   * Creates a new post. Handles both JSON data and file uploads (multipart/form-data).
   * * @param {string} title - The title of the post.
   * @param {string} content - The text content, link, or caption.
   * @param {string} subreddit - The target subreddit name.
   * @param {File | null} file - The optional image or video file to upload.
   * @param {string} postType - The type of post ('text', 'image', 'link', 'poll').
   */
  createPost: async (title, content, subreddit, file = null, postType = 'text') => {
    
    let data;
    let headers = getAuthHeaders();
    
    if (file) {
      // 1. If a file is present, use FormData (multipart/form-data)
      data = new FormData();
      data.append('title', title);
      data.append('subreddit', subreddit);
      data.append('postType', postType); // Send postType for backend routing
      data.append('content', content);   // Used as a caption for the file
      data.append('file', file);         // The actual file object

      // Important: Do NOT manually set Content-Type: multipart/form-data
      // When using FormData, axios/browser sets the correct Content-Type 
      // including the necessary boundary string.
      // We only need the authorization header.

    } else {
      // 2. If no file, use standard JSON (application/json)
      data = { title, content, subreddit, postType };
      headers['Content-Type'] = 'application/json'; // Explicitly set if not using a utility function for headers
    }

    const response = await axios.post(
      `${API_URL}/api/posts/create`,
      data,
      { 
        headers: headers 
      }
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
    const response = await axios.get(`${API_URL}/api/communities`);
    return response.data;
  },

  // Search communities
  searchCommunities: async (query, page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/communities/search`, {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get community by ID
  getCommunityById: async (communityId) => {
    const response = await axios.get(`${API_URL}/api/communities/${communityId}`);
    return response.data;
  },

  // Create community
  createCommunity: async (communityData) => {
    const response = await axios.post(
      `${API_URL}/api/communities/`,
      communityData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get community posts
  getCommunityPosts: async (communityId, page = 1, limit = 20, sort = 'new') => {
    const response = await axios.get(
      `${API_URL}/api/communities/${communityId}/posts`,
      {
        params: { page, limit, sort },
        headers: getAuthHeaders()
      }
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
  },

  // Get communities where user is a moderator
  getModeratedCommunities: async () => {
    const response = await axios.get(
      `${API_URL}/api/communities/moderated/list`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  // Note: communityData should include:
  // {
  //   name: string (required),
  //   description: string,
  //   rules: array of strings,
  //   isPublic: boolean,
  //   ageVerified: boolean,
  //   bannerUrl: string,
  //   avatarUrl: string
  // }
};

// Vote API endpoints (NEW - unified voting system)
export const voteApi = {
  // Vote on post or comment
  vote: async (targetId, targetType, voteType) => {
    const response = await axios.post(
      `${API_URL}/api/votes`,
      { targetId, targetType, voteType },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get user's vote on a target
  getUserVote: async (targetId, targetType) => {
    const response = await axios.get(
      `${API_URL}/api/votes/user/${targetId}/${targetType}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get all votes for a target
  getVotes: async (targetId, targetType) => {
    const response = await axios.get(
      `${API_URL}/api/votes/${targetId}/${targetType}`
    );
    return response.data;
  }
};

// Membership API endpoints (NEW - community membership management)
export const membershipApi = {
  // Join a community
  join: async (communityId) => {
    const response = await axios.post(
      `${API_URL}/api/memberships`,
      { communityId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Leave a community
  leave: async (communityId) => {
    const response = await axios.delete(
      `${API_URL}/api/memberships/${communityId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get user's memberships
  getUserMemberships: async () => {
    const response = await axios.get(
      `${API_URL}/api/memberships/user`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get community members
  getCommunityMembers: async (communityId, page = 1, limit = 50) => {
    const response = await axios.get(
      `${API_URL}/api/memberships/community/${communityId}`,
      {
        headers: getAuthHeaders(),
        params: { page, limit }
      }
    );
    return response.data;
  },

  // Update member role
  updateRole: async (communityId, userId, role) => {
    const response = await axios.put(
      `${API_URL}/api/memberships/${communityId}/role`,
      { userId, role },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Check if user is member
  checkMembership: async (communityId) => {
    const response = await axios.get(
      `${API_URL}/api/memberships/check/${communityId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

// Feed API endpoints (NEW - personalized feeds with caching)
export const feedApi = {
  // Get trending posts
  getTrending: async (page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/feed/trending`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get personalized home feed
  getHomeFeed: async (page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/feed/home`, {
      headers: getAuthHeaders(),
      params: { page, limit }
    });
    return response.data;
  },

  // Get suggested feed (discovery)
  getSuggestedFeed: async (page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/feed/suggested`, {
      headers: getAuthHeaders(),
      params: { page, limit }
    });
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

// Saved API endpoints
export const savedApi = {
  // Save or unsave a post/comment
  toggleSave: async (targetId, targetType) => {
    const response = await axios.post(
      `${API_URL}/api/saved`,
      { targetId, targetType },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Get all saved items
  getSavedItems: async (type = null, page = 1, limit = 20) => {
    const params = { page, limit };
    if (type) params.type = type;
    
    const response = await axios.get(`${API_URL}/api/saved`, {
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get saved posts only
  getSavedPosts: async (page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/saved/posts`, {
      params: { page, limit },
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Get saved comments only
  getSavedComments: async (page = 1, limit = 20) => {
    const response = await axios.get(`${API_URL}/api/saved/comments`, {
      params: { page, limit },
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Check if item is saved
  checkSaved: async (targetId, targetType) => {
    const response = await axios.get(
      `${API_URL}/api/saved/check/${targetId}/${targetType}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Unsave an item
  unsave: async (targetId, targetType) => {
    const response = await axios.delete(
      `${API_URL}/api/saved/${targetId}/${targetType}`,
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

