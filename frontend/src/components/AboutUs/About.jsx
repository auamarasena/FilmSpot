import React from "react";
import "./Aboutus.css";

const Aboutus = () => {
  return (
    <div className='abs-about-us-container'>
      {/* Hero Section */}
      <section className='abs-hero-section'>
        <div className='abs-hero-content'>
          <h1 className='abs-main-title'>About FilmSpot</h1>
          <p className='abs-hero-subtitle'>
            Sri Lanka's Premier Movie Booking Experience
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='abs-story-section'>
        <div className='abs-content-wrapper'>
          <h2 className='abs-section-title'>Our Story</h2>
          <p className='abs-story-text'>
            Welcome to FilmSpot, Sri Lanka's most trusted and innovative movie
            booking platform! Since our inception, we've been revolutionizing
            how movie enthusiasts discover, book, and enjoy their favorite films
            across the island.
          </p>
          <p className='abs-story-text'>
            Born from a passion for cinema and technology, FilmSpot bridges the
            gap between moviegoers and theaters, offering a seamless digital
            experience that makes booking your next movie adventure effortless
            and enjoyable.
          </p>
        </div>
      </section>

      {/* Mission & Vision*/}
      <section className='abs-mission-vision'>
        <div className='abs-content-wrapper'>
          <div className='abs-mission-vision-grid'>
            <div className='abs-mission-card'>
              <div className='abs-card-icon'>🎯</div>
              <h3>Our Mission</h3>
              <p>
                To democratize movie entertainment by providing an accessible,
                user-friendly platform that connects movie lovers with the best
                cinematic experiences across Sri Lanka.
              </p>
            </div>
            <div className='abs-vision-card'>
              <div className='abs-card-icon'>🚀</div>
              <h3>Our Vision</h3>
              <p>
                To become the leading entertainment technology company in South
                Asia, setting new standards for digital movie booking and
                customer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='abs-values-section'>
        <div className='abs-content-wrapper'>
          <h2 className='abs-section-title'>Our Core Values</h2>
          <div className='abs-values-grid'>
            <div className='abs-value-item'>
              <div className='abs-value-icon'>⭐</div>
              <h4>Excellence</h4>
              <p>
                We strive for perfection in every interaction and continuously
                improve our platform.
              </p>
            </div>
            <div className='abs-value-item'>
              <div className='abs-value-icon'>🤝</div>
              <h4>Trust</h4>
              <p>
                Building lasting relationships through transparent and reliable
                services.
              </p>
            </div>
            <div className='abs-value-item'>
              <div className='abs-value-icon'>💡</div>
              <h4>Innovation</h4>
              <p>
                Embracing cutting-edge technology to enhance the movie-going
                experience.
              </p>
            </div>
            <div className='abs-value-item'>
              <div className='abs-value-icon'>❤️</div>
              <h4>Passion</h4>
              <p>Our love for cinema drives everything we do at FilmSpot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team*/}
      <section className='abs-team-section'>
        <div className='abs-content-wrapper'>
          <h2 className='abs-section-title'>Meet Our Leadership Team</h2>
          <div className='abs-team-grid'>
            <div className='abs-team-member'>
              <div className='abs-member-avatar'>
                <img
                  src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
                  alt='CEO'
                  className='abs-team-image'
                />
              </div>
              <div className='abs-member-info'>
                <h3>Anuda Amarasena</h3>
                <p className='abs-member-role'>Chief Executive Officer</p>
                <p className='abs-member-bio'>
                  With over 15 years in the entertainment industry, Dilshan
                  leads FilmSpot with a vision to transform how Sri Lankans
                  experience cinema.
                </p>
              </div>
            </div>

            <div className='abs-team-member'>
              <div className='abs-member-avatar'>
                <img
                  src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
                  alt='CTO'
                  className='abs-team-image'
                />
              </div>
              <div className='abs-member-info'>
                <h3>Nilmini Ratnayake</h3>
                <p className='abs-member-role'>Chief Technology Officer</p>
                <p className='abs-member-bio'>
                  Nilmini's technical expertise and innovative approach ensure
                  FilmSpot remains at the forefront of entertainment technology.
                </p>
              </div>
            </div>

            <div className='abs-team-member'>
              <div className='abs-member-avatar'>
                <img
                  src='https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
                  alt='HOM'
                  className='abs-team-image'
                />
              </div>
              <div className='abs-member-info'>
                <h3>Chaminda Rathnayake</h3>
                <p className='abs-member-role'>Head of Marketing</p>
                <p className='abs-member-bio'>
                  Chaminda's creative strategies and deep understanding of
                  consumer behavior help FilmSpot connect with movie enthusiasts
                  nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section*/}
      <section className='abs-stats-section'>
        <div className='abs-content-wrapper'>
          <div className='abs-stats-grid'>
            <div className='abs-stat-item'>
              <h3 className='abs-stat-number'>500K+</h3>
              <p className='abs-stat-label'>Happy Customers</p>
            </div>
            <div className='abs-stat-item'>
              <h3 className='abs-stat-number'>50+</h3>
              <p className='abs-stat-label'>Partner Theaters</p>
            </div>
            <div className='abs-stat-item'>
              <h3 className='abs-stat-number'>1M+</h3>
              <p className='abs-stat-label'>Tickets Booked</p>
            </div>
            <div className='abs-stat-item'>
              <h3 className='abs-stat-number'>24/7</h3>
              <p className='abs-stat-label'>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className='abs-cta-section'>
        <div className='abs-content-wrapper'>
          <div className='abs-cta-content'>
            <h2>Ready to Book Your Next Movie?</h2>
            <p>
              Join thousands of movie lovers who trust FilmSpot for their
              entertainment needs.
            </p>
            <button className='abs-cta-button'>Explore Movies</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;
