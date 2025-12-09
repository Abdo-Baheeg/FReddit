import React, { useState } from 'react';
import './setting.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  
  const tabs = [
    'Account',
    'Profile',
    'Privacy',
    'Preferences',
    'Notifications',
    'Email'
  ];

  // Function to render the main content based on active tab
  const renderMainContent = () => {
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

  // Render Account tab content (updated to match the new image)
  const renderAccountContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">General</h2>
        
        <div className="settings-table">
          {/* Email Address Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Email address</span>
            </div>
            <div className="setting-control">
              <span className="account-email">basmala.hanyy.m@gmail.com</span>
            </div>
          </div>

          {/* Gender Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Gender</span>
            </div>
            <div className="setting-control">
              <span className="account-gender">&gt;</span>
            </div>
          </div>

          {/* Location Customization Row */}
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

        <h2 className="section-title" style={{marginTop: '40px'}}>Account authorization</h2>
        
        <div className="settings-table">
          {/* Google */}
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

          {/* Apple */}
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

          {/* Two-factor authentication */}
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
          {/* Get premium */}
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
          {/* Delete account */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Delete account</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile tab content (existing content)
  const renderProfileContent = () => (
    <div className="settings-main">
      <div className="general-section">
        <h2 className="section-title">General</h2>
        
        <div className="settings-table">
          {/* Display Name Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Display name</span>
              <span className="label-sub">
                Changing your display name won't change your username
              </span>
            </div>
          </div>

          {/* About Description Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">About description</span>
            </div>
          </div>

          {/* Avatar Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Avatar</span>
              <span className="label-sub">
                Edit your avatar or upload an image
              </span>
            </div>
          </div>

          {/* Banner Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Banner</span>
              <span className="label-sub">
                Upload a profile background image
              </span>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Social links</span>
            </div>
          </div>

          {/* Mark as Mature Row */}
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
                  <input type="checkbox" id="mature-toggle" />
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
          {/* Allow people to follow you */}
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
                  <input type="checkbox" id="follow-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Who can send you chat requests */}
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

          {/* Blocked accounts section */}
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
          {/* List your profile on old.reddit.com/users */}
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
                  <input type="checkbox" id="old-reddit-toggle" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Show up in search results */}
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
                  <input type="checkbox" id="search-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Ads personalization</h2>
        
        <div className="settings-table">
          {/* Personalize ads on Reddit */}
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
                  <input type="checkbox" id="ads-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Allow us to use information from our partners */}
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
                  <input type="checkbox" id="partners-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Advanced</h2>
        
        <div className="settings-table">
          {/* Third-party app authorizations */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Third-party app authorizations</span>
            </div>
            <div className="setting-control">
              <span className="privacy-arrow">&gt;</span>
            </div>
          </div>

          {/* Clear history */}
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
          {/* Display language */}
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

          {/* Content languages */}
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
          {/* Show mature content (I'm over 18) */}
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
                  <input type="checkbox" id="mature-content-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Blur mature (18+) images and media */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Blur mature (18+) images and media</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="blur-mature-toggle" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Show recommendations in home feed */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Show recommendations in home feed</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="recommendations-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Muted communities */}
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
          {/* Autoplay media */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Autoplay media</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="autoplay-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Reduce Motion */}
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
                  <input type="checkbox" id="reduce-motion-toggle" />
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
          {/* Community notifications */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Community notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="community-notifications-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Web push notifications */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Web push notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="web-push-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Messages</h2>
        
        <div className="settings-table">
          {/* Chat messages */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat messages</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="chat-messages-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Chat requests */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat requests</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="chat-requests-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Mark all as read */}
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
          {/* Mentions of u/username */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Mentions of u/username</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="mentions-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Comments on your posts */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments on your posts</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="comments-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Upvotes on your posts */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your posts</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="upvotes-posts-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Upvotes on your comments */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="upvotes-comments-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Replies to your comments */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Replies to your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="replies-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Activity on your comments */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Activity on your comments</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="activity-comments-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* New followers */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New followers</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="followers-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Awards you receive */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Awards you receive</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="awards-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Posts you follow */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Posts you follow</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="posts-follow-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Comments you follow */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments you follow</span>
            </div>
            <div className="setting-control">
              <div className="notifications-toggle-group">
                <div className="toggle-control">
                  <label className="toggle-switch">
                    <input type="checkbox" id="comments-follow-toggle" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <span className="notifications-status">All on</span>
              </div>
            </div>
          </div>

          {/* Mark as read (at the bottom) */}
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
          {/* Admin notifications */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Admin notifications</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="admin-notifications-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Chat requests */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Chat requests</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-chat-requests-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Activity</h2>
        
        <div className="settings-table">
          {/* New user welcome */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New user welcome</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="new-user-welcome-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Comments on your posts */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Comments on your posts</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-comments-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Replies to your comments */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Replies to your comments</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-replies-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Upvotes on your posts */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your posts</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-upvotes-posts-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Upvotes on your comments */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Upvotes on your comments</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-upvotes-comments-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Username mentions */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Username mentions</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-mentions-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* New followers */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">New followers</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="email-followers-toggle" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Newsletters</h2>
        
        <div className="settings-table">
          {/* Daily Digest */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Daily Digest</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="daily-digest-toggle" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Weekly Recap */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Weekly Recap</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="weekly-recap-toggle" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Weekly Topic */}
          <div className="settings-row">
            <div className="setting-label">
              <span className="label-main">Weekly Topic</span>
            </div>
            <div className="setting-control">
              <div className="toggle-control">
                <label className="toggle-switch">
                  <input type="checkbox" id="weekly-topic-toggle" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '40px'}}>Advanced</h2>
        
        <div className="settings-table">
          {/* Unsubscribe from all emails */}
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
        {/* Horizontal tabs added here */}
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
    </div>
  );
};

export default Settings;