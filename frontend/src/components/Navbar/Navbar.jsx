import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className='nb-navbar'>
      <div className='nb-navbar-container'>
        <div className='nb-navbar-content'>
          <div className='nb-logo'>
            <Link to='/' className='nb-logo-link'>
              <span className='nb-logo-text'>FilmSpot</span>
              <span className='nb-logo-subtitle'>Cinema</span>
            </Link>
          </div>

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
                      <div className='nb-dropdown-avatar'>K</div>
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
                        <svg
                          width='16'
                          height='16'
                          fill='currentColor'
                          viewBox='0 0 20 20'>
                          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        My Bookings
                      </Link>
                      <Link
                        to='/ChangePasswordForm'
                        className='nb-dropdown-link'>
                        <svg
                          width='16'
                          height='16'
                          fill='currentColor'
                          viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-2a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Change Password
                      </Link>
                      <div className='nb-dropdown-divider'></div>
                      <button
                        onClick={handleLogout}
                        className='nb-dropdown-link nb-logout'>
                        <svg
                          width='16'
                          height='16'
                          fill='currentColor'
                          viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                            clipRule='evenodd'
                          />
                        </svg>
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
              href='/Moviepage'
              onClick={() => setIsMobileMenuOpen(false)}>
              Movies
            </MobileNavLink>
            <MobileNavLink
              href='/OffersPromotions'
              onClick={() => setIsMobileMenuOpen(false)}>
              Offers
            </MobileNavLink>
            <MobileNavLink
              href='/AboutUs'
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
