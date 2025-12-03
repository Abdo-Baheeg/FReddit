// SettingsPage.jsx
import React, { useState } from 'react';
import './setting.css';

const SettingsPage = () => 
    {
  const [activeTab, setActiveTab] = useState('Profile');
  const [displayName, setDisplayName] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [isMature, setIsMature] = useState(false);

  const tabs = ['Account', 'Profile', 'Privacy', 'Preferences', 'Notifications', 'Email'];

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Settings</h1>
      </header>

      
      </div>
  );
};

export default SettingsPage;