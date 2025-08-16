import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import api from "../../api/axios";
import "./Home.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatCard = ({ stat }) => {
  return (
    <motion.div className='hm-stat-card' variants={itemVariants}>
      <div className='hm-stat-icon'>{stat.icon}</div>
      <div className='hm-stat-content'>
        <h3 className='hm-stat-number'>
          <span>{stat.number}</span>
          {stat.unit}
        </h3>
        <p className='hm-stat-label'>{stat.label}</p>
      </div>
    </motion.div>
  );
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/booking/${movie._id}`);
  };
  return (
    <motion.div
      className='hm-movie-card'
      variants={itemVariants}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/movie/${movie._id}`)}>
      <div className='hm-movie-poster'>
        <motion.img src={movie.moviePoster} alt={movie.title} />
        <div className='hm-movie-overlay'>
          <button onClick={handleBookNow} className='hm-btn hm-book-btn'>
            <Ticket size={18} /> Book Now
          </button>
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
            {movie.imdbRating || "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSlider = ({ featuredMovies }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) =>
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!featuredMovies || featuredMovies.length === 0) {
    return <section className='hm-hero-section'></section>;
  }

  const currentMovie = featuredMovies[activeSlide];

  return (
    <section className='hm-hero-section'>
      <div className='hm-aurora-background'>
        <motion.div
          className='aurora-shape-1'
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className='aurora-shape-2'
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <AnimatePresence>
        <motion.div
          key={currentMovie._id}
          className='hm-hero-slide'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}>
          <div
            className='hm-hero-slide-background'
            style={{
              backgroundImage: `url(${currentMovie.moviePosterHomepage})`,
            }}
          />
          <div className='hm-hero-overlay' />
          <div className='hm-hero-content hm-container'>
            <motion.div
              className='hm-hero-text'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div variants={itemVariants} className='hm-hero-badge'>
                <Star />
                <span>Featured Movie</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className='hm-hero-title'>
                {currentMovie.title}
              </motion.h1>
              <motion.p variants={itemVariants} className='hm-hero-description'>
                {currentMovie.description}
              </motion.p>
              <motion.div variants={itemVariants} className='hm-movie-meta'>
                <span className='hm-meta-item'>
                  <Clock size={16} />
                  {currentMovie.duration}
                </span>
                <span className='hm-meta-item'>
                  <Star size={16} />
                  {currentMovie.imdbRating || "N/A"}
                </span>
              </motion.div>
              <motion.div variants={itemVariants} className='hm-hero-actions'>
                <button
                  onClick={() => navigate(`/booking/${currentMovie._id}`)}
                  className='hm-btn hm-btn-primary'>
                  <Ticket size={20} />
                  Book Now
                </button>
                <Link
                  to={`/movie/${currentMovie._id}`}
                  className='hm-btn hm-btn-secondary'>
                  <Play size={20} />
                  View Details
                </Link>
              </motion.div>
            </motion.div>
            <motion.div className='hm-hero-poster'>
              <img src={currentMovie.moviePoster} alt={currentMovie.title} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className='hm-hero-navigation'>
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`hm-hero-dot ${
              index === activeSlide ? "hm-active" : ""
            }`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

//Main Home Component
const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stats = [
    { icon: <Users />, number: "500K+", unit: "", label: "Happy Customers" },
    { icon: <Award />, number: "50+", unit: "", label: "Partner Theaters" },
    { icon: <Ticket />, number: "1M+", unit: "", label: "Tickets Booked" },
    {
      icon: <TrendingUp />,
      number: "24/7",
      unit: "",
      label: "Customer Support",
    },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: allMovies } = await api.get("/movies");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const showing = allMovies.filter(
          (movie) => new Date(movie.releaseDate) <= today
        );
        setNowShowingMovies(showing.slice(0, 4));

        const featured = [...showing]
          .sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
          .slice(0, 3);

        // Fallback in case there are less than 3 movies or no ratings
        setFeaturedMovies(featured.length > 0 ? featured : showing.slice(0, 3));
      } catch (err) {
        setError("Could not load movies for the homepage.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}>
        Loading FilmSpot...
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
        }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className='hm-home-container'>
      <HeroSlider featuredMovies={featuredMovies} />

      <motion.section
        className='hm-stats-section'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}>
        <div className='hm-container'>
          <div className='hm-stats-grid'>
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className='hm-movies-section'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.1 }}>
        <div className='hm-container'>
          <motion.div className='hm-section-header' variants={itemVariants}>
            <h2 className='hm-section-title'>Now Showing</h2>
            <p className='hm-section-subtitle'>
              Catch the latest blockbusters on the big screen.
            </p>
          </motion.div>
          <div className='hm-movies-grid'>
            {nowShowingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className='hm-cta-section'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}>
        <div className='hm-container'>
          <div className='hm-cta-content'>
            <h2 className='hm-cta-title'>Ready For Your Next Movie Night?</h2>
            <p className='hm-cta-description'>
              Book tickets, explore genres, and enjoy the magic of cinema with
              us.
            </p>
            <Link to='/movies' className='hm-btn hm-btn-primary'>
              Explore All Movies
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
