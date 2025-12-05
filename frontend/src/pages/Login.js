import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({
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
      console.log('Attempting login with:', formData.email);
      const response = await userApi.login(formData.email, formData.password);
      console.log('Login response:', response);
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="post-list">
      <div className="form-container" style={{ maxWidth: '400px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, textAlign: 'center' }}>Log In</h2>
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
              style={{ fontSize: '14px' }}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn" style={{ width: '100%', padding: 'var(--spacing-md)' }}>
            Log In
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-lg)',
          fontSize: '14px',
          color: 'var(--reddit-text-secondary)'
        }}>
          New to FReddit? <a href="/register" style={{ color: 'var(--reddit-blue)', fontWeight: 500 }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
