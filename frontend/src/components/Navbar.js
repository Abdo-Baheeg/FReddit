import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="navbar">
      <Link to="/">
        <h1>FReddit</h1>
      </Link>
      <nav>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/create-post">Create Post</Link>
            <button onClick={handleLogout} className="btn" style={{width: 'auto', padding: '8px 16px'}}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
