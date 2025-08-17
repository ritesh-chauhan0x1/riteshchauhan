import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    // Simulate login delay
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        avatar: formData.username.slice(0, 2).toUpperCase(),
        status: 'online',
        joinedAt: new Date()
      };

      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (username) => {
    const userData = {
      id: Date.now(),
      username: username,
      email: `${username.toLowerCase().replace(' ', '')}@example.com`,
      avatar: username.slice(0, 2).toUpperCase(),
      status: 'online',
      joinedAt: new Date()
    };

    onLogin(userData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1 className="login-title">Welcome to Discord Clone</h1>
          <p className="login-subtitle">We're so excited to see you again!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-text">Quick Login (Demo):</p>
          <div className="quick-login-buttons">
            <button 
              className="quick-login-btn"
              onClick={() => handleQuickLogin('John Doe')}
            >
              John Doe
            </button>
            <button 
              className="quick-login-btn"
              onClick={() => handleQuickLogin('Jane Smith')}
            >
              Jane Smith
            </button>
            <button 
              className="quick-login-btn"
              onClick={() => handleQuickLogin('Mike Johnson')}
            >
              Mike Johnson
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Need an account? <span className="register-link">Register</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
