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



  return (
    
    <div className="settings-container"> 
    <div className='empty'>

    </div>
        <h1>ettings</h1>
      </div>
  );
};


export default SettingsPage;