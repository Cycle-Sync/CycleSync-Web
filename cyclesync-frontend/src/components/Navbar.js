import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api'; // Import logout from api.js
import { getRefreshToken, clearAuthToken } from '../auth'; // Import getRefreshToken and clearAuthToken from auth.js

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(getRefreshToken());
      clearAuthToken();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav>
      <Link to="/dashboard">CycleSyNC 🫧</Link>
      <div>
        <Link to="/dashboard">Home</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/daily-log">Daily Log</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;