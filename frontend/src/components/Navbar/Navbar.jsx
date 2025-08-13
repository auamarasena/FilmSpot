import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

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

          {/* User / Auth */}
          <div className='nb-user-section'>
            {isLoggedIn ? (
              <div className='nb-profile-section' ref={dropdownRef}>
                <div className='nb-profile-wrapper' onClick={toggleDropdown}>
                  <div className='nb-profile-circle'>
                    <span className='nb-profile-initial'>A</span>
                  </div>
                  <div className='nb-profile-info'>
                    <span className='nb-profile-name'>Anuda</span>
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
                      <div className='nb-dropdown-avatar'>A</div>
                      <div className='nb-dropdown-user-info'>
                        <span className='nb-dropdown-name'>
                          Anuda Amarasena
                        </span>
                        <span className='nb-dropdown-email'>
                          Anuda@example.com
                        </span>
                      </div>
                    </div>
                    <div className='nb-dropdown-divider'></div>
                    <div className='nb-dropdown-links'>
                      <Link to='/Bookinghistory' className='nb-dropdown-link'>
                        My Bookings
                      </Link>
                      <Link
                        to='/ChangePasswordForm'
                        className='nb-dropdown-link'>
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
            <MobileNavLink href='/' onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink
              href='/movies'
              onClick={() => setIsMobileMenuOpen(false)}>
              Movies
            </MobileNavLink>
            <MobileNavLink
              href='/offer'
              onClick={() => setIsMobileMenuOpen(false)}>
              Offers
            </MobileNavLink>
            <MobileNavLink
              href='/about'
              onClick={() => setIsMobileMenuOpen(false)}>
              About Us
            </MobileNavLink>
          </div>

          {!isLoggedIn && (
            <div className='nb-mobile-auth'>
              <Link to='/sign-in' onClick={() => setIsMobileMenuOpen(false)}>
                <button className='nb-mobile-login-btn'>Sign In</button>
              </Link>
              <Link to='/reg-form' onClick={() => setIsMobileMenuOpen(false)}>
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

const MobileNavLink = ({ href, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      className={`nb-mobile-nav-link ${isActive ? "nb-active" : ""}`}
      onClick={onClick}>
      {children}
    </Link>
  );
};

export default Navbar;
