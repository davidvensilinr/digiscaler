// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Explore from './pages/Explore/Explore';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Login from './pages/Login/Login';
import BrandSignup from './pages/BrandSignup/BrandSignup';
import CreatorSignup from './pages/CreatorSignup/CreatorSignup';
import Profile from './pages/Profile/Profile';
import ChatPage from './pages/Chat/ChatPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // No persistent local storage; simply mark loading false on mount
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogin = (userId, userData) => {
    setUser({ id: userId, ...userData });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/signup/brand" element={
              user ? <Navigate to="/" /> : <BrandSignup onSignup={handleLogin} />
            } />
            <Route path="/signup/creator" element={
              user ? <Navigate to="/" /> : <CreatorSignup onSignup={handleLogin} />
            } />

            {/* Protected routes */}
            <Route path="/" element={
              user ? <Explore user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/chat/:recipientId" element={
              user ? <ChatPage user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/profile" element={
              user ? <Profile user={user} /> : <Navigate to="/login" />
            } />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;