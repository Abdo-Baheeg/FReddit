import React, { useState, useEffect } from 'react';
import { userApi } from '../api';
import './setting.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [isSavingDisplayName, setIsSavingDisplayName] = useState(false);
  
  // New state for About Description modal
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutDescriptionInput, setAboutDescriptionInput] = useState('');
  const [aboutDescriptionError, setAboutDescriptionError] = useState('');
  const [isSavingAboutDescription, setIsSavingAboutDescription] = useState(false);
  
  // NEW STATES FOR INLINE EDITING
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  
  const tabs = [
    'Account',
    'Profile',
    'Privacy',
    'Preferences',
    'Notifications',
    'Email'
  ];

  // Fetch user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const userData = await userApi.getCurrentUser();
      setUser(userData);
      setSelectedGender(userData.gender || '');
      setDisplayNameInput(userData.displayName || '');
      setAboutDescriptionInput(userData.bio || userData.description || '');
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle click on display name button - NEW VERSION
  const handleDisplayNameClick = () => {
    // Set the new username state with current display name or username
    setNewUsername(user?.displayName || user?.username || "");
    // Enable editing mode
    setIsEditing(true);
  };

  // Handle saving display name - CONNECTED TO API - NEW FUNCTION
  const handleSaveUsername = async () => {
    // Validate display name
    if (!newUsername.trim()) {
      setDisplayNameError('Display name cannot be empty');
      return;
    }

    if (newUsername.length > 90) {
      setDisplayNameError('Display name must be 90 characters or less');
      return;
    }

    setIsSavingDisplayName(true);

    try {
      // Call the API to update username
      // This is the key connection point - calling the API function you provided
      const updatedUser = await userApi.updateUsername(newUsername.trim());
      
      // Update the user in state
      setUser(updatedUser);
      
      // Exit editing mode
      setIsEditing(false);
      setDisplayNameError('');
      
      // Optional: Refresh user data from server to ensure consistency
      await fetchCurrentUser();
      
      console.log('Display name updated successfully via API');
      
    } catch (err) {
      console.error('Error updating display name:', err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setDisplayNameError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 409) {
        setDisplayNameError('This display name is already taken.');
      } else if (err.message === 'Network Error') {
        setDisplayNameError('Network error. Please check your internet connection.');
      } else {
        setDisplayNameError('Failed to update display name. Please try again.');
      }
    } finally {
      setIsSavingDisplayName(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername("");
    setDisplayNameError('');
  };

  // About Description Modal Functions
  const handleAboutDescriptionClick = () => {
    setAboutDescriptionInput(user?.bio || user?.description || '');
    setAboutDescriptionError('');
    setShowAboutModal(true);
  };

  const handleCancelAboutModal = () => {
    setShowAboutModal(false);
    setAboutDescriptionError('');
  };

  const handleSaveAboutDescription = async () => {
    // Validate about description
    if (aboutDescriptionInput.length > 200) {
      setAboutDescriptionError('About description must be 200 characters or less');
      return;
    }

    setIsSavingAboutDescription(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Update user bio/description via API
      // Since you don't have a specific endpoint for updating bio in your API,
      // I'll show you how to handle it once you add it
      // For now, we'll simulate it
      console.log('Simulating about description update:', aboutDescriptionInput.trim());
      
      // Update local state directly for testing
      setUser(prev => ({ 
        ...prev, 
        bio: aboutDescriptionInput.trim(),
        description: aboutDescriptionInput.trim(),
        // Simulate API response timestamp
        updatedAt: new Date().toISOString()
      }));
      
      // Close modal
      setShowAboutModal(false);
      setAboutDescriptionError('');
      
      // Show success message (optional)
      console.log('About description updated successfully');
      
    } catch (err) {
      console.error('Error updating about description:', err);
      
      // More specific error messages
      if (err.response?.status === 401) {
        setAboutDescriptionError('Your session has expired. Please log in again.');
      } else if (err.message === 'Network Error') {
        setAboutDescriptionError('Network error. Please check your internet connection.');
      } else {
        setAboutDescriptionError('Failed to update about description. Please try again.');
      }
    } finally {
      setIsSavingAboutDescription(false);
    }
  };

  const handleAboutDescriptionInputChange = (e) => {
    const value = e.target.value;
    setAboutDescriptionInput(value);
    
    // Clear error when user starts typing
    if (aboutDescriptionError && aboutDescriptionError !== 'About description must be 200 characters or less') {
      setAboutDescriptionError('');
    }
    
    // Validate length in real-time
    if (value.length > 200) {
      setAboutDescriptionError('About description must be 200 characters or less');
    }
  };

  // Display Name Modal Functions (for modal version - kept as backup)
  const handleModalDisplayNameClick = () => {
    setDisplayNameInput(user?.displayName || '');
    setDisplayNameError('');
    setShowDisplayNameModal(true);
  };

  const handleCancelDisplayNameModal = () => {
    setShowDisplayNameModal(false);
    setDisplayNameError('');
  };

  const handleSaveDisplayName = async () => {
    // Validate display name
    if (displayNameInput.length > 90) {
      setDisplayNameError('Display name must be 90 characters or less');
      return;
    }

    if (displayNameInput.trim() === '') {
      setDisplayNameError('Display name cannot be empty');
      return;
    }

    setIsSavingDisplayName(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // TEMPORARY: Simulate successful API call for testing
      // Remove this and uncomment the real API call when backend is ready
      console.log('Simulating display name update:', displayNameInput.trim());
      
      // Update local state directly for testing
      setUser(prev => ({ 
        ...prev, 
        displayName: displayNameInput.trim(),
        // Simulate API response timestamp
        updatedAt: new Date().toISOString()
      }));
      
      // Close modal
      setShowDisplayNameModal(false);
      setDisplayNameError('');
      
      // Show success message (optional)
      console.log('Display name updated successfully');
      
    } catch (err) {
      console.error('Error updating display name:', err);
      
      // More specific error messages
      if (err.response?.status === 401) {
        setDisplayNameError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 409) {
        setDisplayNameError('This display name is already taken.');
      } else if (err.message === 'Network Error') {
        setDisplayNameError('Network error. Please check your internet connection.');
      } else {
        setDisplayNameError('Failed to update display name. Please try again.');
      }
    } finally {
      setIsSavingDisplayName(false);
    }
  };

  const handleDisplayNameInputChange = (e) => {
    const value = e.target.value;
    setDisplayNameInput(value);
    
    // Clear error when user starts typing
    if (displayNameError && displayNameError !== 'Display name must be 90 characters or less') {
      setDisplayNameError('');
    }
    
    // Validate length in real-time
    if (value.length > 90) {
      setDisplayNameError('Display name must be 90 characters or less');
    }
  };

  const handleCancelEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleContinueEmailModal = () => {
    console.log("Continue to change email for:", user?.email);
    setShowEmailModal(false);
    setShowEmailConfirmationModal(true);
  };

  const handleCloseEmailConfirmationModal = () => {
    setShowEmailConfirmationModal(false);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    console.log("Selected gender:", gender);
  };

  const handleSaveGender = () => {
    console.log("Saving gender:", selectedGender);
    setShowGenderModal(false);
  };

  const handleCancelGenderModal = () => {
    setShowGenderModal(false);
  };

  const handleCancelDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
  };

  const handleContinueDeleteAccount = () => {
    console.log("Continue to delete account for:", user?.email);
    setShowDeleteAccountModal(false);
    setShowDeleteConfirmationModal(true);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  // Function to render the main content based on active tab
  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="settings-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="settings-main">
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchCurrentUser} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="settings-main">
          <div className="error-container">
            <p>User not found. Please log in again.</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Account':
        return renderAccountContent();
      case 'Profile':
        return renderProfileContent();
      case 'Privacy':
        return renderPrivacyContent();
      case 'Preferences':
        return renderPreferencesContent();
      case 'Notifications':
        return renderNotificationsContent();
      case 'Email':
        return renderEmailContent();
      default:
        return renderProfileContent();
    }
  };

  // Render Account tab content
  const renderAccountContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">General</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Email address</span>
            </div>
            <div className="setting-control">
              <button className="email-button" onClick={() => setShowEmailModal(true)}>
                <span className="account-email">
                  <p>{user.email || 'No email provided'}</p>
                </span>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Gender</span>
            </div>
            <div className="setting-control">
              <button className="gender-button" onClick={() => setShowGenderModal(true)}>
                <span className="account-gender">
                  {selectedGender || 'Not specified'} &gt;
                </span>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Location customization</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <span className="toggle-label">
                  Use approximate location (based on IP)
                </span>
                <label className="toggle-switch">
                  <input type="checkbox" id="location-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Account Information</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Username</span>
            </div>
            <div className="setting-control">
              <span className="account-username">
                <p> {user.username || 'No username'}</p>
              </span>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Account created</span>
            </div>
            <div className="setting-control">
              <span className="account-created">
                <p>
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown'}
                </p>
              </span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Account authorization</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Google</span>
              <span className="label-sub">
                Connect to log in to Reddit with your Google account
              </span>
            </div>
            <div className="setting-control">
              <button className="connect-button disconnect">
                Disconnect
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Apple</span>
              <span className="label-sub">
                Connect to log in to Reddit with your Apple account
              </span>
            </div>
            <div className="setting-control">
              <button className="connect-button">
                Connect
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Two-factor authentication</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Reddit Premium</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Get premium</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Advanced</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Delete account</span>
            </div>
            <div className="setting-control">
              <button className="deletebutton" onClick={() => setShowDeleteAccountModal(true)}>
                <span className="privacy-arrow">&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile tab content - UPDATED WITH INLINE EDITING
  const renderProfileContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">General</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Display name</span>
              <span className="label-sub">
                Changing your display name won't change your username
              </span>
            </div>
            <div className="setting-control">
              {!isEditing ? (
                // View mode - shows button with current display name
                <button className="displaybutton" onClick={handleDisplayNameClick}>
                  <span className="display-name">
                    {user.displayName || user.username || 'No display name set'}
                  </span>
                </button>
              ) : (
                // Edit mode - shows input field and action buttons
                <div className="display-name-edit-container">
                  <input
                    type="text"
                    className="display-name-input-inline"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter display name"
                    maxLength={90}
                    autoFocus
                  />
                  <div className="inline-buttons">
                    <button 
                      className="save-button-inline"
                      onClick={handleSaveUsername}
                      disabled={isSavingDisplayName || !newUsername.trim()}
                    >
                      {isSavingDisplayName ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      className="cancel-button-inline"
                      onClick={handleCancelEdit}
                      disabled={isSavingDisplayName}
                    >
                      Cancel
                    </button>
                  </div>
                  {displayNameError && (
                    <div className="inline-error">
                      {displayNameError}
                    </div>
                  )}
                  <div className="character-counter-inline">
                    {newUsername.length}/90
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">About description</span>
              <span className="label-sub">
                Give a brief description of yourself
              </span>
            </div>
            <div className="setting-control">
              <button className="bio-button" onClick={handleAboutDescriptionClick}>
                <span className="about-description">
                  {user.bio || user.description || 'No bio provided'}
                </span>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Avatar</span>
              <span className="label-sub">
                Edit your avatar or upload an image
              </span>
            </div>
            <div className="setting-control">
              <div className="avatar-preview">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Banner</span>
              <span className="label-sub">
                Upload a profile background image
              </span>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Social links</span>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Mark as mature (18+)</span>
              <span className="label-sub">
                Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="mature-toggle" defaultChecked={user.isMature || false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Privacy tab content
  const renderPrivacyContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">Social interactions</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Allow people to follow you</span>
              <span className="label-sub">
                Let people follow you to see your profile posts in their home feed
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="follow-toggle" defaultChecked={user.allowFollowing !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Who can send you chat requests</span>
            </div>
            <div className="setting-control">
              <div className="privacy-option">
                <span className="privacy-label">Everyone</span>
                <span className="privacy-arrow">&gt;</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Blocked accounts</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Discoverability</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">List your profile on old.reddit.com/users</span>
              <span className="label-sub">
                List your profile on old.reddit.com/users and allow posts to your profile to appear in r/all
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="old-reddit-toggle" defaultChecked={user.listOnOldReddit !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Show up in search results</span>
              <span className="label-sub">
                Allow search engines like Google to link to your profile in their search results
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="search-toggle" defaultChecked={user.showInSearch !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Ads personalization</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Personalize ads on Reddit</span>
              <span className="label-sub">
                Personalize ads on Reddit based on information and activity from our partners
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="ads-toggle" defaultChecked={user.personalizeAds !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Allow us to use information from our partners</span>
              <span className="label-sub">
                Allow us to use information from our partners to show you better ads on Reddit
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="partners-toggle" defaultChecked={user.allowPartnerData !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Advanced</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Third-party app authorizations</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Clear history</span>
              <span className="label-sub">
                Delete your post views history
              </span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Preferences tab content
  const renderPreferencesContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">Language</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Display language</span>
            </div>
            <div className="setting-control">
              <div className="privacy-option">
                <span className="privacy-label">English (US)</span>
                <span className="privacy-arrow">&gt;</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Content languages</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Content</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Show mature content (I'm over 18)</span>
              <span className="label-sub">
                See Not Safe for Work mature and adult content in your feeds and search results
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="mature-content-toggle" defaultChecked={user.showMatureContent !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Blur mature (18+) images and media</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="blur-mature-toggle" defaultChecked={user.blurMatureImages !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Show recommendations in home feed</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="recommendations-toggle" defaultChecked={user.showRecommendations !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Muted communities</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Accessibility</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Autoplay media</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="autoplay-toggle" defaultChecked={user.autoplayMedia !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Reduce Motion</span>
              <span className="label-sub">
                Sync with computer's motion settings
              </span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="reduce-motion-toggle" defaultChecked={user.reduceMotion === true} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Notifications tab content
  const renderNotificationsContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">General</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Community notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="community-notifications-toggle" defaultChecked={user.communityNotifications !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Web push notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="web-push-toggle" defaultChecked={user.webPushNotifications !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Messages</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat messages</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="chat-messages-toggle" defaultChecked={user.chatMessagesNotifications !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat requests</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="chat-requests-toggle" defaultChecked={user.chatRequestsNotifications !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Mark all as read</span>
              <span className="label-sub">
                Mark all chat conversations as read
              </span>
            </div>
            <div className="setting-control">
              <div className="privacy-option">
                <span className="privacy-arrow">&gt;</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Activity</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Mentions of u/username</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="mentions-toggle" defaultChecked={user.mentionsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments on your posts</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="comments-toggle" defaultChecked={user.commentsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your posts</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="upvotes-posts-toggle" defaultChecked={user.upvotesPostsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="upvotes-comments-toggle" defaultChecked={user.upvotesCommentsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Replies to your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="replies-toggle" defaultChecked={user.repliesNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Activity on your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="activity-comments-toggle" defaultChecked={user.activityCommentsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New followers</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="followers-toggle" defaultChecked={user.followersNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Awards you receive</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="awards-toggle" defaultChecked={user.awardsNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Posts you follow</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="posts-follow-toggle" defaultChecked={user.postsFollowNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments you follow</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="comments-follow-toggle" defaultChecked={user.commentsFollowNotifications !== false} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Mark as read</span>
            </div>
            <div className="setting-control">
              <div className="privacy-option">
                <span className="privacy-arrow">&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Email tab content
  const renderEmailContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">Messages</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Admin notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="admin-notifications-toggle" defaultChecked={user.adminEmailNotifications !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat requests</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-chat-requests-toggle" defaultChecked={user.emailChatRequests !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Activity</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New user welcome</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="new-user-welcome-toggle" defaultChecked={user.newUserWelcomeEmail !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments on your posts</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-comments-toggle" defaultChecked={user.emailCommentsOnPosts !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Replies to your comments</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-replies-toggle" defaultChecked={user.emailRepliesToComments !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your posts</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-upvotes-posts-toggle" defaultChecked={user.emailUpvotesOnPosts !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your comments</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-upvotes-comments-toggle" defaultChecked={user.emailUpvotesOnComments !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Username mentions</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-mentions-toggle" defaultChecked={user.emailUsernameMentions !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New followers</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-followers-toggle" defaultChecked={user.emailNewFollowers !== false} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Newsletters</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Daily Digest</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="daily-digest-toggle" defaultChecked={user.dailyDigestEmail === true} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Weekly Recap</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="weekly-recap-toggle" defaultChecked={user.weeklyRecapEmail === true} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Weekly Topic</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="weekly-topic-toggle" defaultChecked={user.weeklyTopicEmail === true} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Advanced</h2>
        
        <div className="settings-table">
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Unsubscribe from all emails</span>
            </div>
            <div className="setting-control">
              <div className="privacy-option">
                <span className="privacy-arrow">&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        
        <div className="settings-horizontal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`settings-horizontal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-content">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-main-content">
          {renderMainContent()}
        </div>
      </div>

      {/* About Description Modal */}
      {showAboutModal && (
        <div className="about-modal-overlay">
          <div className="about-modal">
            <h3>About description</h3>
            <p className="about-modal-subtitle">
              Give a brief description of yourself
            </p>
            
            <div className="about-input-container">
              <textarea
                className="about-input"
                value={aboutDescriptionInput}
                onChange={handleAboutDescriptionInputChange}
                placeholder="Tell us about yourself..."
                maxLength={200}
                rows={4}
              />
              <div className="character-counter">
                {aboutDescriptionInput.length}/200
              </div>
            </div>
            
            {aboutDescriptionError && (
              <div className="about-error">
                {aboutDescriptionError}
              </div>
            )}
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelAboutModal}>
                Cancel
              </button>
              <button 
                className={`save-button ${isSavingAboutDescription ? 'saving' : ''}`} 
                onClick={handleSaveAboutDescription}
                disabled={isSavingAboutDescription || !!aboutDescriptionError}
              >
                {isSavingAboutDescription ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Name Modal (kept as backup) */}
      {showDisplayNameModal && (
        <div className="display-name-modal-overlay">
          <div className="display-name-modal">
            <h3>Display name</h3>
            <p className="display-name-modal-subtitle">
              Changing your display name won't change your username
            </p>
            
            <div className="display-name-input-container">
              <input
                type="text"
                className="display-name-input"
                value={displayNameInput}
                onChange={handleDisplayNameInputChange}
                placeholder="Enter display name"
                maxLength={90}
              />
              <div className="character-counter">
                {displayNameInput.length}/90
              </div>
            </div>
            
            {displayNameError && (
              <div className="display-name-error">
                {displayNameError}
              </div>
            )}
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelDisplayNameModal}>
                Cancel
              </button>
              <button 
                className={`save-button ${isSavingDisplayName ? 'saving' : ''}`} 
                onClick={handleSaveDisplayName}
                disabled={isSavingDisplayName || !!displayNameError}
              >
                {isSavingDisplayName ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <h3>Change your email address</h3>
            <p>To change your email address, you need to create a Reddit password first. We'll walk you through it.</p>
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelEmailModal}>
                Cancel
              </button>
              <button className="continue-button" onClick={handleContinueEmailModal}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {showEmailConfirmationModal && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <h3>Check your email</h3>
            <p>We sent a message to {user?.email || 'your email'} with a link to create your password.</p>
            
            <div className="modal-buttons">
              <button className="continue-button" onClick={handleCloseEmailConfirmationModal}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gender Selection Modal */}
      {showGenderModal && (
        <div className="gender-modal-overlay">
          <div className="gender-modal">
            <h3>Gender</h3>
            <p className="gender-modal-subtitle">
              This information may be used to improve your recommendations and ads.
            </p>
            
            <div className="gender-options">
              <div 
                className={`gender-option ${selectedGender === 'Woman' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('Woman')}
              >
                Woman
              </div>
              <div 
                className={`gender-option ${selectedGender === 'Man' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('Man')}
              >
                Man
              </div>
              <div 
                className={`gender-option ${selectedGender === 'Non-binary' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('Non-binary')}
              >
                Non-binary
              </div>
              <div 
                className={`gender-option ${selectedGender === 'I prefer not to say' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('I prefer not to say')}
              >
                I prefer not to say
              </div>
              <div 
                className={`gender-option ${selectedGender === 'I refer to myself as...' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('I refer to myself as...')}
              >
                I refer to myself as...
              </div>
            </div>
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelGenderModal}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSaveGender}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete your account</h3>
            <p>To delete your account, you need to create a Reddit password first. We'll walk you through it.</p>
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelDeleteAccountModal}>
                Cancel
              </button>
              <button className="continue-button" onClick={handleContinueDeleteAccount}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <h3>Check your email</h3>
            <div className="email-confirmation-content">
              <div className="confirmation-text">
                <p>Check your email</p>
                <p>We sent a message to <strong>{user?.email || 'your email'}</strong> with a link to create your password.</p>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button className="continue-button" onClick={handleCloseDeleteConfirmationModal}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;