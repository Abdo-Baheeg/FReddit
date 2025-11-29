import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const { unreadCounts } = useSocket();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="navbar">
      <Link to="/">
        <h1>FReddit</h1>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/create-post">Create Post</Link>

            <Link to="/chat" style={{ position: 'relative' }}>
              Messages
              {totalUnread > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#ff4500',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {totalUnread}
                </span>
              )}
            </Link>

            <Link to="/viewprofile" className="profile-icon" style={{ marginLeft: '8px' }}>
              ⚽
            </Link>

            <button 
              onClick={handleLogout} 
              className="btn" 
              style={{ width: 'auto', padding: '8px 16px', marginLeft: '8px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
              Register
            </Link>

            <Link to="/viewprofile" className="profile-icon" style={{ marginLeft: '8px' }}>
              ⚽
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
