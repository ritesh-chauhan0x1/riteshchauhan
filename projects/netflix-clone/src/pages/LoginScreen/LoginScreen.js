import React, { useState } from 'react';
import { createUserAccount, signInUser } from '../../services/firebase';
import './LoginScreen.css';

function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserAccount(email, password);
      } else {
        await signInUser(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-background">
        <div className="login-gradient"></div>
      </div>
      
      <div className="login-header">
        <div className="login-logo">NETFLIX</div>
      </div>
      
      <div className="login-body">
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
            
            <div className="form-footer">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="help-link">Need help?</a>
            </div>
            
            <div className="signup-link">
              {isSignUp ? 'Already have an account? ' : 'New to Netflix? '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign in now.' : 'Sign up now.'}
              </button>
            </div>
            
            <div className="recaptcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </div>
          </form>
        </div>
      </div>
      
      <div className="login-footer">
        <div className="footer-content">
          <p>Questions? Call 1-844-505-2993</p>
          <div className="footer-links">
            <div className="footer-column">
              <a href="#">FAQ</a>
              <a href="#">Investor Relations</a>
              <a href="#">Privacy</a>
              <a href="#">Speed Test</a>
            </div>
            <div className="footer-column">
              <a href="#">Help Center</a>
              <a href="#">Jobs</a>
              <a href="#">Cookie Preferences</a>
              <a href="#">Legal Notices</a>
            </div>
            <div className="footer-column">
              <a href="#">Account</a>
              <a href="#">Ways to Watch</a>
              <a href="#">Corporate Information</a>
              <a href="#">Only on Netflix</a>
            </div>
            <div className="footer-column">
              <a href="#">Media Center</a>
              <a href="#">Terms of Use</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
