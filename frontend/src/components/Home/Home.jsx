import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import "./Home.css";

const featuredMovies = [
  {
    id: "feat-1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    moviePoster:
      "https://www.moviemars.com/cdn/shop/products/603285d4b4c3b25f5b6bd4f03fc51424.jpg?v=1700314591&width=493",
    duration: "148 min",
    rating: "8.8",
  },
  {
    id: "feat-2",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    moviePoster:
      "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    duration: "152 min",
    rating: "9.0",
  },
  {
    id: "feat-3",
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    moviePoster:
      "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    duration: "169 min",
    rating: "8.6",
  },
];

const nowShowingMovies = [
  {
    id: "now-1",
    title: "Joker",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    duration: "122 min",
    rating: "8.4",
  },
  {
    id: "now-2",
    title: "Parasite",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    duration: "132 min",
    rating: "8.6",
  },
  {
    id: "now-3",
    title: "Avengers: Endgame",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    duration: "181 min",
    rating: "8.4",
  },
  {
    id: "now-4",
    title: "Mad Max: Fury Road",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/hA26x2662R2r5w7L6gD2cI7T0X2.jpg",
    duration: "120 min",
    rating: "8.1",
  },
];

const comingSoonMovies = [
  {
    id: "soon-1",
    title: "Dune: Part Two",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8soXRmfuXb.jpg",
    genre: "Sci-Fi, Adventure",
  },
  {
    id: "soon-2",
    title: "The Batman",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onHQ.jpg",
    genre: "Action, Crime",
  },
  {
    id: "soon-3",
    title: "Spider-Man: Across the Spider-Verse",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    genre: "Animation, Action",
  },
  {
    id: "soon-4",
    title: "Oppenheimer",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    genre: "Drama, History",
  },
];

const stats = [
  { icon: <Users />, number: "500K+", label: "Happy Customers" },
  { icon: <Award />, number: "50+", label: "Partner Theaters" },
  { icon: <Ticket />, number: "1M+", label: "Tickets Booked" },
  { icon: <TrendingUp />, number: "24/7", label: "Customer Support" },
];

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const Home = () => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setActiveHeroSlide((prevSlide) =>
        prevSlide === featuredMovies.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(sliderInterval);
  }, []);

  return (
    <div className='hm-home-container'>
      {/* Hero Section */}
      <section className='hm-hero-section'>
        <div className='hm-hero-slider'>
          {featuredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`hm-hero-slide ${
                index === activeHeroSlide ? "hm-active" : ""
              }`}
              style={{ backgroundImage: `url(${movie.moviePoster})` }}>
              <div className='hm-hero-overlay'></div>
              <div className='hm-hero-content'>
                <div className='hm-hero-text'>
                  <div className='hm-hero-badge'>
                    <Star className='hm-star-icon' />
                    <span>Featured Movie</span>
                  </div>
                  <h1 className='hm-hero-title'>{movie.title}</h1>
                  <p className='hm-hero-description'>{movie.description}</p>
                  <div className='hm-movie-meta'>
                    <span className='hm-meta-item'>
                      <Clock size={16} />
                      {movie.duration}
                    </span>
                    <span className='hm-meta-item'>
                      <Star size={16} />
                      {movie.rating}
                    </span>
                  </div>
                  <div className='hm-hero-actions'>
                    <Link
                      to={`/booking/${createSlug(movie.title)}`}
                      className='hm-btn hm-btn-primary'>
                      <Ticket size={20} />
                      Book Now
                    </Link>
                    <Link
                      to={`/movie/${createSlug(movie.title)}`}
                      className='hm-btn hm-btn-secondary'>
                      <Play size={20} />
                      Watch Trailer
                    </Link>
                  </div>
                </div>
                <div className='hm-hero-poster'>
                  <img src={movie.moviePoster} alt={movie.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Navigation */}
        <div className='hm-hero-navigation'>
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`hm-hero-dot ${
                index === activeHeroSlide ? "hm-active" : ""
              }`}
              onClick={() => setActiveHeroSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className='hm-stats-section'>
        <div className='hm-container'>
          <div className='hm-stats-grid'>
            {stats.map((stat, index) => (
              <div key={index} className='hm-stat-card'>
                <div className='hm-stat-icon'>{stat.icon}</div>
                <div className='hm-stat-content'>
                  <h3 className='hm-stat-number'>{stat.number}</h3>
                  <p className='hm-stat-label'>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className='hm-movies-section'>
        <div className='hm-container'>
          <div className='hm-section-header'>
            <h2 className='hm-section-title'>Now Showing</h2>
            <p className='hm-section-subtitle'>
              Catch the latest blockbusters on the big screen
            </p>
            <Link to='/movies' className='hm-view-all-btn'>
              View All Movies
            </Link>
          </div>

          <div className='hm-movies-grid'>
            {nowShowingMovies.map((movie) => (
              <div key={movie.id} className='hm-movie-card'>
                <div className='hm-movie-poster'>
                  <img src={movie.moviePoster} alt={movie.title} />
                  <div className='hm-movie-overlay'>
                    <Link
                      to={`/booking/${createSlug(movie.title)}`}
                      className='hm-book-btn'>
                      <Ticket size={18} />
                      Book Now
                    </Link>
                  </div>
                </div>
                <div className='hm-movie-info'>
                  <h3 className='hm-movie-title'>{movie.title}</h3>
                  <div className='hm-movie-details'>
                    <span className='hm-duration'>
                      <Clock size={14} />
                      {movie.duration}
                    </span>
                    <span className='hm-rating'>
                      <Star size={14} />
                      {movie.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className='hm-coming-soon-section'>
        <div className='hm-container'>
          <div className='hm-section-header'>
            <h2 className='hm-section-title'>Coming Soon</h2>
            <p className='hm-section-subtitle'>
              Get ready for upcoming blockbusters
            </p>
          </div>

          <div className='hm-coming-soon-grid'>
            {comingSoonMovies.map((movie) => (
              <div key={movie.id} className='hm-coming-soon-card'>
                <div className='hm-coming-soon-image'>
                  <img src={movie.moviePoster} alt={movie.title} />
                  <div className='hm-coming-soon-badge'>
                    <Calendar size={16} />
                    Coming Soon
                  </div>
                </div>
                <div className='hm-coming-soon-info'>
                  <h4>{movie.title}</h4>
                  <p>{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='hm-cta-section'>
        <div className='hm-container'>
          <div className='hm-cta-content'>
            <h2 className='hm-cta-title'>
              Ready for Your Next Movie Adventure?
            </h2>
            <p className='hm-cta-description'>
              Join millions of movie lovers and book your tickets today.
              Experience cinema like never before with FilmSpot.
            </p>
            <div className='hm-cta-actions'>
              <Link to='/movies' className='hm-btn hm-btn-primary hm-btn-large'>
                Explore Movies
              </Link>
              <Link to='/offers' className='hm-btn hm-btn-outline hm-btn-large'>
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
