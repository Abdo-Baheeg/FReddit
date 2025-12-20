import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { communityApi, postApi } from '../api';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [selectedTab, setSelectedTab] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDays, setPollDays] = useState(3);
  const [tags, setTags] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // Get community from navigation state and referrer
  const communityFromState = location.state?.community;
  const referrer = location.state?.referrer || '/'; // Default to home

  // Debug logging
  console.log('Location state:', location.state);
  console.log('Community from state:', communityFromState);
  console.log('Referrer:', referrer);

  // HTML stripping helper function
  const stripHtml = (html) => {
    if (!html) return '';
    
    // Remove all HTML tags and decode HTML entities
    return html
      .replace(/<[^>]*>/g, ' ') // Replace tags with spaces
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with spaces
      .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
      .trim();
  };

  const tabs = [
    { id: 'text', label: 'Text' },
    { id: 'images', label: 'Images & Video' },
    { id: 'link', label: 'Link' },
    { id: 'poll', label: 'Poll' }
  ];

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  // ReactQuill formats
  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'header', 'list', 'bullet', 'indent',
    'script', 'direction', 'size',
    'color', 'background', 'font', 'align',
    'link', 'image', 'video', 'clean'
  ];

  // Fetch user's communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const data = await communityApi.getAllCommunities();
        setCommunities(data);
        
        // If coming from community page, pre-select that community
        if (communityFromState) {
          const matchedCommunity = data.find(c => 
            c._id === communityFromState._id || 
            c.name === communityFromState.name
          );
          if (matchedCommunity) {
            setSelectedCommunity(matchedCommunity);
            console.log('Pre-selected community:', matchedCommunity);
          } else {
            // If community not found in list, still set it from state
            setSelectedCommunity(communityFromState);
          }
        }
      } catch (err) {
        console.error('Failed to fetch communities:', err);
        setError('Failed to load communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [communityFromState]);

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCommunity) {
      setError('Please select a community');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Validate based on post type
    if (selectedTab === 'link' && !linkUrl.trim()) {
      setError('URL is required for link posts');
      return;
    }

    if (selectedTab === 'poll') {
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        setError('Poll needs at least 2 options');
        return;
      }
    }

    if (selectedTab === 'images' && !selectedFile) {
      setError('Please select an image or video');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Debug: Log what we're sending
      console.log('Creating post with:', {
        title: title.trim(),
        communityId: selectedCommunity._id,
        communityName: selectedCommunity.name,
        postType: selectedTab,
        body: body
      });

      // Prepare content based on post type
      let content = '';
      let fileToUpload = null;

      switch(selectedTab) {
        case 'text':
          // Strip HTML tags from ReactQuill content
          content = stripHtml(body) || '';
          break;
        case 'link':
          content = linkUrl.trim();
          break;
        case 'poll':
          content = JSON.stringify({
            options: pollOptions.filter(opt => opt.trim()),
            duration: pollDays
          });
          break;
        case 'images':
          // Strip HTML tags from caption
          content = stripHtml(body) || '';
          fileToUpload = selectedFile;
          break;
        default:
          content = stripHtml(body) || '';
      }

      // Debug: Show what content we're sending
      console.log('Original body:', body);
      console.log('Stripped content:', content);

      // Try community ID first, then name as fallback
      const communityIdentifier = selectedCommunity._id || selectedCommunity.name;
      
      console.log('Calling postApi.createPost with:', {
        title: title.trim(),
        content: content,
        subreddit: communityIdentifier,
        file: fileToUpload,
        postType: selectedTab
      });

      // Call the API
      const result = await postApi.createPost(
        title.trim(),
        content,
        communityIdentifier,
        fileToUpload,
        selectedTab
      );
      
      console.log('Post created successfully:', result);
      
      // Navigate back to the page that called it
      // If it was a community page, go back to that community
      if (selectedCommunity._id && referrer.includes('/community/')) {
        navigate(`/community/${selectedCommunity._id}`);
      } else {
        // Otherwise, go back to the referrer or home
        navigate(referrer);
      }
      
    } catch (err) {
      console.error('Failed to create post:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the page that called it
    navigate(referrer);
  };

  const charactersLeft = 300 - tags.length;

  if (loading) {
    return (
      <div className="create-post-container">
        <div className="loading">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>Create post</h1>
      </div>

      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#fee', 
          color: '#c00', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div className="community-selector">
        <div className="community-dropdown">
          <button 
            type="button"
            className="community-dropdown-toggle"
            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
          >
            <span className="community-placeholder">
              {selectedCommunity ? `r/${selectedCommunity.name || selectedCommunity.title || 'Unknown'}` : 'Select a community'}
            </span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {showCommunityDropdown && (
            <div className="community-dropdown-menu">
              {communities.length === 0 ? (
                <div className="community-option" style={{ color: '#878a8c' }}>
                  No communities available
                </div>
              ) : (
                communities.map(community => (
                  <div 
                    key={community._id}
                    className="community-option"
                    onClick={() => {
                      setSelectedCommunity(community);
                      setShowCommunityDropdown(false);
                    }}
                  >
                    <div className="community-option-content">
                      <div className="community-avatar" style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: '#0079d3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginRight: '10px'
                      }}>
                        {(community.name || community.title || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="community-name">r/{community.name || community.title || 'Unknown'}</div>
                        <div className="community-members" style={{ 
                          fontSize: '12px', 
                          color: '#878a8c' 
                        }}>
                          {community.memberCount || 0} members
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="post-type-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            maxLength={300}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Add tags</label>
          <div className="tags-input-container">
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags (separated by commas)"
              maxLength={300}
            />
            <span className="char-counter">{charactersLeft}/300</span>
          </div>
        </div>

        {selectedTab === 'text' && (
          <div className="text-editor-container">
            <ReactQuill 
              theme="snow"
              value={body}
              onChange={setBody}
              placeholder="Body text (optional)"
              modules={quillModules}
              formats={quillFormats}
              className="react-quill-editor"
            />
          </div>
        )}

        {selectedTab === 'images' && (
          <div className="file-upload-container">
            <div className="file-upload-area" onClick={() => fileInputRef.current.click()}>
              {selectedFile ? (
                <div className="file-selected">
                  <div>Selected: {fileName}</div>
                  <button 
                    type="button" 
                    className="change-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="file-placeholder">
                  <div>📁 Click to upload image or video</div>
                  <div className="file-hint">Supported: JPG, PNG, GIF, MP4</div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="text-editor-container">
              <ReactQuill 
                theme="snow"
                value={body}
                onChange={setBody}
                placeholder="Add a caption (optional)"
                modules={quillModules}
                formats={quillFormats}
                className="react-quill-editor"
              />
            </div>
          </div>
        )}

        {selectedTab === 'link' && (
          <div className="form-group">
            <label htmlFor="link">URL</label>
            <input
              type="url"
              id="link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://"
              required
            />
          </div>
        )}

        {selectedTab === 'poll' && (
          <div className="poll-container">
            {pollOptions.map((option, index) => (
              <div key={index} className="poll-option">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handlePollOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required={index < 2}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    className="remove-option"
                    onClick={() => handleRemovePollOption(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            {pollOptions.length < 6 && (
              <button
                type="button"
                className="add-option-button"
                onClick={handleAddPollOption}
              >
                Add option
              </button>
            )}

            <div className="poll-duration">
              <label>Poll length</label>
              <select
                value={pollDays}
                onChange={(e) => setPollDays(Number(e.target.value))}
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={6}>6 days</option>
                <option value={7}>7 days</option>
              </select>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            className="save-draft-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-post-button"
            disabled={!title || !selectedCommunity || submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;