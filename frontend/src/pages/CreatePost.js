import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDays, setPollDays] = useState(3);
  const [tags, setTags] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [communities, setCommunities] = useState([
    'reactjs',
    'webdev',
    'programming',
    'javascript',
    'css',
    'frontend'
  ]);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

  const tabs = [
    { id: 'text', label: 'Text' },
    { id: 'images', label: 'Images & Video' },
    { id: 'link', label: 'Link' },
    { id: 'poll', label: 'Poll' }
  ];

  const toolbarButtons = [
    { icon: 'B', tooltip: 'Bold' },
    { icon: 'i', tooltip: 'Italic' },
    { icon: 'S', tooltip: 'Strikethrough' },
    { icon: 'X²', tooltip: 'Superscript' },
    { icon: 'T', tooltip: 'Heading' },
    { icon: 'D', tooltip: 'Divider' },
    { icon: 'Q', tooltip: 'Quote' },
    { icon: 'D', tooltip: 'Code Block' },
    { icon: 'i', tooltip: 'Inline Code' },
    { icon: 'j', tooltip: 'List' },
    { icon: 'L', tooltip: 'Numbered List' },
    { icon: 'G', tooltip: 'Table' },
    { icon: 'H', tooltip: 'Spoiler' },
    { icon: 'I', tooltip: 'Markdown Mode' },
    { icon: 'J', tooltip: 'Help' }
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle post submission logic here
    console.log({
      title,
      body,
      linkUrl,
      pollOptions,
      pollDays,
      tags,
      selectedCommunity,
      type: selectedTab
    });
    navigate('/');
  };

  const charactersLeft = 300 - tags.length;

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>Create post</h1>
      </div>

      <div className="community-selector">
        <div className="community-dropdown">
          <button 
            className="community-dropdown-toggle"
            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
          >
            <span className="community-placeholder">
              {selectedCommunity ? `r/${selectedCommunity}` : 'Select a community'}
            </span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {showCommunityDropdown && (
            <div className="community-dropdown-menu">
              {communities.map(community => (
                <div 
                  key={community}
                  className="community-option"
                  onClick={() => {
                    setSelectedCommunity(community);
                    setShowCommunityDropdown(false);
                  }}
                >
                  r/{community}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="post-type-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
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
            <div className="editor-toolbar">
              {toolbarButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  className="toolbar-button"
                  title={button.tooltip}
                >
                  {button.icon}
                </button>
              ))}
            </div>
            <textarea
              className="body-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body text (optional)"
              rows={10}
            />
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
          <button type="button" className="save-draft-button">
            Save Draft
          </button>
          <button 
            type="submit" 
            className="submit-post-button"
            disabled={!title || !selectedCommunity}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;