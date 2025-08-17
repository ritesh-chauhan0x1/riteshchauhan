import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Components
import LoginScreen from './pages/LoginScreen/LoginScreen';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import ProfileScreen from './pages/ProfileScreen/ProfileScreen';
import BrowseScreen from './pages/BrowseScreen/BrowseScreen';

// Styles
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser({
          uid: userAuth.uid,
          email: userAuth.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="netflix-logo">NETFLIX</div>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Router>
        <Routes>
          {!user ? (
            <Route path="*" element={<LoginScreen />} />
          ) : (
            <>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/browse" element={<BrowseScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
