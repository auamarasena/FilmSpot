import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When the user navigates to a new page, close the mobile menu
  const location = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  return (
    <nav className='nb-navbar'>
      <div className='nb-navbar-container'>
        <div className='nb-navbar-content'>
          {/* Logo */}
          <div className='nb-logo'>
            <Link to='/' className='nb-logo-link'>
              <span className='nb-logo-text'>FilmSpot</span>
              <span className='nb-logo-subtitle'>Cinema</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className='nb-nav-links'>
            <NavLink href='/'>Home</NavLink>
            <NavLink href='/movies'>Movies</NavLink>
            <NavLink href='/offer'>Offers</NavLink>
            <NavLink href='/about'>About Us</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='nb-mobile-menu-btn'
            onClick={toggleMobileMenu}
            aria-label='Toggle mobile menu'>
            <span
              className={`nb-hamburger ${isMobileMenuOpen ? "nb-active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className='nb-user-section'>
            {isAuthenticated ? (
              <div className='nb-profile-section' ref={dropdownRef}>
                <div className='nb-profile-wrapper' onClick={toggleDropdown}>
                  <div className='nb-profile-circle'>
                    <span className='nb-profile-initial'>
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className='nb-profile-info'>
                    <span className='nb-profile-name'>{user?.firstName}</span>
                    <span className='nb-profile-status'>Online</span>
                  </div>
                  <svg
                    className={`nb-dropdown-arrow ${
                      showDropdown ? "nb-rotated" : ""
                    }`}
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>

                {showDropdown && (
                  <div className='nb-dropdown-menu'>
                    <div className='nb-dropdown-header'>
                      <div className='nb-dropdown-avatar'>
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <div className='nb-dropdown-user-info'>
                        <span className='nb-dropdown-name'>
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className='nb-dropdown-email'>{user?.email}</span>
                      </div>
                    </div>
                    <div className='nb-dropdown-divider'></div>
                    <div className='nb-dropdown-links'>
                      <Link to='/booking-history' className='nb-dropdown-link'>
                        My Bookings
                      </Link>
                      <Link to='/change-pw' className='nb-dropdown-link'>
                        Change Password
                      </Link>
                      <div className='nb-dropdown-divider'></div>
                      <button
                        onClick={handleLogout}
                        className='nb-dropdown-link nb-logout'>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='nb-auth-buttons'>
                <Link to='/sign-in'>
                  <button className='nb-login-button'>Sign In</button>
                </Link>
                <Link to='/reg-form'>
                  <button className='nb-signup-button'>Get Started</button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`nb-mobile-menu ${isMobileMenuOpen ? "nb-open" : ""}`}>
          <div className='nb-mobile-nav-links'>
            <MobileNavLink href='/'>Home</MobileNavLink>
            <MobileNavLink href='/movies'>Movies</MobileNavLink>
            <MobileNavLink href='/offer'>Offers</MobileNavLink>
            <MobileNavLink href='/about'>About Us</MobileNavLink>
          </div>

          {!isAuthenticated && (
            <div className='nb-mobile-auth'>
              <Link to='/sign-in'>
                <button className='nb-mobile-login-btn'>Sign In</button>
              </Link>
              <Link to='/reg-form'>
                <button className='nb-mobile-signup-btn'>Get Started</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link to={href} className={`nb-nav-link ${isActive ? "nb-active" : ""}`}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, children }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      className={`nb-mobile-nav-link ${isActive ? "nb-active" : ""}`}>
      {children}
    </Link>
  );
};

export default Navbar;
