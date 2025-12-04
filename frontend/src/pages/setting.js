import React from 'react';
import './setting.css'; // Assuming your CSS file is named settings.css

const Settings = () => {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
    
      
      {/* Your settings content here */}
      <div className="settings-content">
        <div className="settings-section">
          <h2>Account Settings</h2>
          <p>Your settings content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;