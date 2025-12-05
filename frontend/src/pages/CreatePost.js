import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api';

const CreatePost = () => {
  const [postType, setPostType] = useState('text'); // text, image, link
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subreddit: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await postApi.createPost(
        formData.title,
        formData.content,
        formData.subreddit
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="post-list">
      <div className="form-container">
        <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: 'var(--spacing-lg)' }}>
          Create a post
        </h2>
        
        {/* Post Type Tabs */}
        <div className="feed-tabs" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button 
            type="button"
            onClick={() => setPostType('text')}
            className={`feed-tab ${postType === 'text' ? 'active' : ''}`}
          >
            <span>📝</span>
            <span>Post</span>
          </button>
          <button 
            type="button"
            onClick={() => setPostType('image')}
            className={`feed-tab ${postType === 'image' ? 'active' : ''}`}
          >
            <span>🖼️</span>
            <span>Image</span>
          </button>
          <button 
            type="button"
            onClick={() => setPostType('link')}
            className={`feed-tab ${postType === 'link' ? 'active' : ''}`}
          >
            <span>🔗</span>
            <span>Link</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Choose a community</label>
            <input
              type="text"
              name="subreddit"
              value={formData.subreddit}
              onChange={handleChange}
              placeholder="r/community"
              required
              style={{ fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="An interesting title"
              required
              maxLength="300"
              style={{ fontSize: '14px' }}
            />
            <small style={{ 
              fontSize: '12px', 
              color: 'var(--reddit-text-meta)',
              marginTop: 'var(--spacing-xs)',
              display: 'block'
            }}>
              {formData.title.length}/300
            </small>
          </div>
          
          <div className="form-group">
            <label>Text (optional)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Text (optional)"
              style={{ 
                minHeight: '150px',
                fontSize: '14px'
              }}
            />
          </div>

          {error && <div className="error">{error}</div>}
          
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/')}
              style={{ padding: 'var(--spacing-sm) var(--spacing-xl)' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn"
              style={{ padding: 'var(--spacing-sm) var(--spacing-xl)' }}
            >
              Post
            </button>
          </div>
        </form>
      </div>
      
      {/* Posting Rules Sidebar */}
      <div className="sidebar-widget" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Posting to FReddit</h3>
        <ol style={{ 
          listStyle: 'decimal',
          paddingLeft: 'var(--spacing-lg)',
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'var(--reddit-text-primary)'
        }}>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>Remember the human</li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>Behave like you would in real life</li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>Look for the original source of content</li>
          <li style={{ marginBottom: 'var(--spacing-sm)' }}>Search for duplicates before posting</li>
          <li>Read the community's rules</li>
        </ol>
      </div>
    </div>
  );
};

export default CreatePost;
