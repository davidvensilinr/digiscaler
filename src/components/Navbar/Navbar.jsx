import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          DigiScaler
        </Link>

        {/* Desktop & Mobile Links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Explore
          </Link>
          <Link to="/how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <button type="button" className="nav-link nav-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup/brand" className="nav-link nav-button" onClick={() => setIsMenuOpen(false)}>
                Join as Brand
              </Link>
              <Link to="/signup/creator" className="nav-link nav-button" onClick={() => setIsMenuOpen(false)}>
                Join as Creator
              </Link>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;