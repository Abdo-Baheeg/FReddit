import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting registration with:', formData.username, formData.email);
      const response = await userApi.register(
        formData.username,
        formData.email,
        formData.password
      );
      console.log('Registration response:', response);
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="post-list">
      <div className="form-container" style={{ maxWidth: '400px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, textAlign: 'center' }}>Sign Up</h2>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: 'var(--reddit-text-meta)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              minLength="6"
              style={{ fontSize: '14px' }}
            />
            <small style={{ 
              fontSize: '12px', 
              color: 'var(--reddit-text-meta)',
              marginTop: 'var(--spacing-xs)',
              display: 'block'
            }}>
              Must be at least 6 characters
            </small>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn" style={{ width: '100%', padding: 'var(--spacing-md)' }}>
            Sign Up
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-lg)',
          fontSize: '14px',
          color: 'var(--reddit-text-secondary)'
        }}>
          Already a redditor? <a href="/login" style={{ color: 'var(--reddit-blue)', fontWeight: 500 }}>Log In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
