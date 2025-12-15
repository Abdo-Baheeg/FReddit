import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api';
import './CreatePost.css'; // Import the new CSS file

const CreatePost = () => {
  const [postType, setPostType] = useState('text'); // text, image, link, poll
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subreddit: '',
    tags: ''
  });
  const [file, setFile] = useState(null); // New state for file
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handler for file selection
  const handleFileChange = (e) => {
    // Reset file if no files selected, otherwise take the first file
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // --- START OF MODIFIED LOGIC ---
    // The placeholder logic has been removed, and the new call structure is implemented.
    // The backend API (postApi.createPost) is now responsible for handling the file/content combination.

    // Validation for image post type
    if (postType === 'image' && !file) {
      setError('Please select an image or video file.');
      return;
    }

    try {
      await postApi.createPost(
        formData.title,
        formData.content, // This will be the caption/link content
        formData.subreddit,
        file,             // Pass the file state (null for non-image posts, or File object)
        postType          // Pass the current postType
      );
      navigate('/');
    } catch (err) {
      // Check for a specific error message from the response
      setError(err.response?.data?.message || 'Failed to create post');
    }
    // --- END OF MODIFIED LOGIC ---
  };

  // Formatting toolbar buttons
  const formattingButtons = [
    { icon: 'B', tooltip: 'Bold' },
    { icon: 'i', tooltip: 'Italic' },
    { icon: 'S', tooltip: 'Strikethrough' },
    { icon: 'X²', tooltip: 'Superscript' },
    { icon: 'T', tooltip: 'Spoiler' },
    { icon: 'D', tooltip: 'Heading' },
    { icon: 'E', tooltip: 'Code block' },
    { icon: 'O', tooltip: 'Quote block' },
    { icon: 'iE', tooltip: 'Ordered list' },
    { icon: 'jE', tooltip: 'Bulleted list' },
    { icon: 'Q', tooltip: 'Table' },
    { icon: '6G', tooltip: 'Link' },
    { icon: 'vD', tooltip: 'Insert' },
    { icon: 'wD', tooltip: 'More' },
  ];

  return (
    <div className="post-list">
      <div className="form-container">
        <h2 className="create-post-header">
          Create post
        </h2>
        
        {/* Community Selector */}
        <div className="form-group community-selector">
          <div className="select-community-placeholder">
            <span className="placeholder-text">Select a community</span>
          </div>
        </div>

        {/* Post Type Tabs */}
        <div className="feed-tabs">
          <button 
            type="button"
            onClick={() => setPostType('text')}
            className={`feed-tab ${postType === 'text' ? 'active' : ''}`}
          >
            <span>📝</span>
            <span>Text</span>
          </button>
          <button 
            type="button"
            onClick={() => setPostType('image')}
            className={`feed-tab ${postType === 'image' ? 'active' : ''}`}
          >
            <span>🖼️</span>
            <span>Images & Video</span>
          </button>
          <button 
            type="button"
            onClick={() => setPostType('link')}
            className={`feed-tab ${postType === 'link' ? 'active' : ''}`}
          >
            <span>🔗</span>
            <span>Link</span>
          </button>
          <button 
            type="button"
            onClick={() => setPostType('poll')}
            className={`feed-tab ${postType === 'poll' ? 'active' : ''}`}
          >
            <span>📊</span>
            <span>Poll</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="title-input">
              Title*
            </label>
            <input
              id="title-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=""
              required
              className="form-input"
            />
            <div className="title-char-count">
              {formData.title.length}/300
            </div>
          </div>
          
          {/* Media File Upload (Visible for 'image' postType) */}
          {postType === 'image' && (
            <div className="form-group file-upload-group">
              <label className="form-label" htmlFor="file-upload">
                Select Image or Video
              </label>
              <input
                id="file-upload"
                type="file"
                name="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="file-input"
              />
              {file && <p className="file-name-display">Selected file: **{file.name}**</p>}
            </div>
          )}

          {/* Tags Input - Simplified to a placeholder as before */}
          <div className="form-group tags-input-group">
            <div className="add-tags-placeholder">
              <span className="placeholder-text">Add tags</span>
            </div>
          </div>
          
          {/* Content Area (Visible for 'text', 'link', and 'image' posts for optional caption) */}
          {(postType === 'text' || postType === 'link' || postType === 'image') && (
            <>
              {/* Formatting Toolbar */}
              <div className="formatting-toolbar">
                {formattingButtons.map((btn, index) => (
                  <button
                    key={index}
                    type="button"
                    className="formatting-button"
                    title={btn.tooltip}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
              
              {/* Body Text Area */}
              <div className="form-group">
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={postType === 'text' ? "Body text (optional)" : "Caption (optional)"}
                  className="content-textarea"
                />
              </div>
            </>
          )}

          {/* Poll Options would go here for postType === 'poll' */}

          {error && <div className="error">{error}</div>}
          
          {/* Action Buttons */}
          <div className="action-buttons-container">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Save Draft
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              // Disable if title is empty OR if postType is 'image' and no file is selected
              disabled={!formData.title.trim() || (postType === 'image' && !file)}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;