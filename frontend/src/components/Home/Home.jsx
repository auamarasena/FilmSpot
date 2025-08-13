import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Calendar,
  Users,
  Award,
  TrendingUp,
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
const stats = [
  { icon: <Users />, number: 500, unit: "K+", label: "Happy Customers" },
  { icon: <Award />, number: 50, unit: "+", label: "Partner Theaters" },
  { icon: <Ticket />, number: 1, unit: "M+", label: "Tickets Booked" },
  { icon: <TrendingUp />, number: 24, unit: "/7", label: "Customer Support" },
];
const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

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
  const [ref, animate] = useAnimate();
  useEffect(() => {
    const controls = animate(
      ref.current,
      { innerHTML: stat.number },
      { duration: 2 }
    );
    return () => controls.stop();
  }, [stat.number, animate, ref]);
  return (
    <motion.div className='hm-stat-card' variants={itemVariants}>
      <div className='hm-stat-icon'>{stat.icon}</div>
      <div className='hm-stat-content'>
        <h3 className='hm-stat-number'>
          <span ref={ref}>0</span>
          {stat.unit}
        </h3>
        <p className='hm-stat-label'>{stat.label}</p>
      </div>
    </motion.div>
  );
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  //Booking logic
  const handleBookNow = () => {
    const mockBookingId = `bk_${Date.now()}`;

    navigate(`/booking-confirmation?bookingId=${mockBookingId}`);
  };

  return (
    <motion.div
      className='hm-movie-card'
      variants={itemVariants}
      whileHover='hover'>
      <div className='hm-movie-poster'>
        <motion.img src={movie.moviePoster} alt={movie.title} />
        <div className='hm-movie-overlay'>
          <button onClick={handleBookNow} className='hm-book-btn hm-btn'>
            <Ticket size={18} />
            Book Now
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
            {movie.rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) =>
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroBookNow = () => {
    const mockBookingId = `bk_hero_${Date.now()}`;
    navigate(`/booking-confirmation?bookingId=${mockBookingId}`);
  };

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
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeSlide}
          className='hm-hero-slide'
          style={{ backgroundImage: `url(${currentMovie.moviePoster})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}>
          <div className='hm-hero-overlay'></div>
        </motion.div>
      </AnimatePresence>
      <div className='hm-hero-content hm-container'>
        <motion.div
          key={activeSlide}
          className='hm-hero-text'
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div className='hm-hero-badge' variants={itemVariants}>
            <Star className='hm-star-icon' /> <span>Featured Movie</span>
          </motion.div>
          <motion.h1 className='hm-hero-title' variants={itemVariants}>
            {currentMovie.title}
          </motion.h1>
          <motion.p className='hm-hero-description' variants={itemVariants}>
            {currentMovie.description}
          </motion.p>
          <motion.div className='hm-movie-meta' variants={itemVariants}>
            <span className='hm-meta-item'>
              <Clock size={16} />
              {currentMovie.duration}
            </span>
            <span className='hm-meta-item'>
              <Star size={16} />
              {currentMovie.rating}
            </span>
          </motion.div>
          <motion.div className='hm-hero-actions' variants={itemVariants}>
            <button
              onClick={handleHeroBookNow}
              className='hm-btn hm-btn-primary'>
              <Ticket size={20} />
              Book Now
            </button>
            <Link
              to={`/movie/${createSlug(currentMovie.title)}`}
              className='hm-btn hm-btn-secondary'>
              <Play size={20} />
              Watch Trailer
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          key={activeSlide}
          className='hm-hero-poster'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}>
          <img src={currentMovie.moviePoster} alt={currentMovie.title} />
        </motion.div>
      </div>
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

const Home = () => {
  return (
    <div className='hm-home-container'>
      <HeroSlider />
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
              <MovieCard key={movie.id} movie={movie} />
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
