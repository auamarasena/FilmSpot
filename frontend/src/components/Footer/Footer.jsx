import "./Footer.css";
const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-main'>
          <div className='footer-brand'>
            <h2 className='footer-logo'>FilmSpot</h2>
            <p className='footer-tagline'>
              Your Premier Movie Booking Experience
            </p>
          </div>

          <div className='footer-links-section'>
            <div className='footer-column'>
              <h4>Quick Links</h4>
              <div className='footer-links'>
                <a href='/'>Home</a>
                <a href='/Moviepage'>Movies</a>
                <a href='/about'>About Us</a>
                <a href='/OffersPromotions'>Offers</a>
              </div>
            </div>

            <div className='footer-column'>
              <h4>Support</h4>
              <div className='footer-links'>
                <a href='/faq'>FAQ</a>
                <a href='/terms'>Terms of Service</a>
                <a href='/privacy'>Privacy Policy</a>
                <a href='/contact'>Contact Us</a>
              </div>
            </div>

            <div className='footer-column'>
              <h4>Follow Us</h4>
              <div className='social-icons'>
                <a href='#' className='social-icon' aria-label='Facebook'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 16 16'></svg>
                </a>

                <a href='#' className='social-icon' aria-label='Instagram'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 16 16'></svg>
                </a>

                <a href='#' className='social-icon' aria-label='Twitter'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 16 16'></svg>
                </a>

                <a href='#' className='social-icon' aria-label='TikTok'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 16 16'></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <div className='footer-bottom-content'>
          <p>© 2025 FilmSpot. All Rights Reserved.</p>
          <p>Making movie nights unforgettable across Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
