import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ShowtimeSelector from "../Showtimes/ShowtimeSelector.jsx";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Users,
  Play,
  Heart,
  Share2,
  MapPin,
  Info,
  Ticket,
  Camera,
  Award,
  TrendingUp,
  Eye,
  ThumbsUp,
  Download,
  Bookmark,
  Volume2,
  Shield,
  Loader,
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronRight,
  Film,
} from "lucide-react";

function createSlug(title) {
  if (!title) {
    return "";
  }
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const MovieBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("showtimes");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.movies.getAll();
        const data = response.data;
        const foundMovie = data.find((movie) => createSlug(movie.title) === id);

        if (!foundMovie) {
          setError("Movie not found");
          return;
        }
        setMovie(foundMovie);
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          "Failed to fetch movie details"
        );
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleLike = () => setIsLiked(!isLiked);
  const handleBookmark = () => setIsBookmarked(!isBookmarked);
  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} - Book tickets now!`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className='new-mb-loading-screen'>
        <div className='new-mb-loading-content'>
          <div className='new-mb-spinner'>
            <Camera className='new-mb-spinner-icon' size={48} />
            <div className='new-mb-spinner-ring'></div>
          </div>
          <h2>Loading Cinema Experience</h2>
          <p>Preparing your movie booking journey...</p>
          <div className='new-mb-loading-bar'>
            <div className='new-mb-loading-progress'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='new-mb-error-screen'>
        <div className='new-mb-error-content'>
          <AlertTriangle className='new-mb-error-icon' size={64} />
          <h2>Oops! Something Went Wrong</h2>
          <p>{error}</p>
          <div className='new-mb-error-actions'>
            <button
              onClick={() => window.location.reload()}
              className='new-mb-retry-btn'>
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => navigate("/moviepage")}
              className='new-mb-home-btn'>
              <Home size={18} />
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='new-mb-container'>
      {/* Cinema Header */}
      <div className='new-mb-cinema-header'>
        <div className='new-mb-header-content'>
          <nav className='new-mb-breadcrumb'>
            <Link to='/' className='new-mb-breadcrumb-item'>
              <Home size={16} />
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to='/moviepage' className='new-mb-breadcrumb-item'>
              <Film size={16} />
              Movies
            </Link>
            <ChevronRight size={14} />
            <span className='new-mb-breadcrumb-current'>Book Tickets</span>
          </nav>

          <button
            onClick={() => navigate("/moviepage")}
            className='new-mb-back-btn'>
            <ArrowLeft size={18} />
            Back to Movies
          </button>
        </div>
      </div>

      {movie && (
        <>
          {/* Hero Section */}
          <div
            className='new-mb-hero'
            style={{
              backgroundImage: `url(${movie.moviePosterHomepage})`,
            }}>
            <div className='new-mb-hero-overlay'>
              <div className='new-mb-hero-content'>
                <div className='new-mb-movie-poster'>
                  <img src={movie.moviePosterHomepage} alt={movie.title} />
                  <button
                    className='new-mb-play-btn'
                    onClick={() => setShowTrailer(true)}>
                    <Play size={24} />
                  </button>
                </div>

                <div className='new-mb-movie-info'>
                  <div className='new-mb-movie-badges'>
                    <span className='new-mb-badge new-mb-badge-premium'>
                      PREMIUM
                    </span>
                    <span className='new-mb-badge new-mb-badge-new'>
                      NOW SHOWING
                    </span>
                  </div>

                  <h1 className='new-mb-movie-title'>{movie.title}</h1>

                  <div className='new-mb-movie-meta'>
                    <div className='new-mb-meta-item'>
                      <Star className='new-mb-meta-icon' size={16} />
                      <span>{movie.rating}</span>
                    </div>
                    <div className='new-mb-meta-item'>
                      <Clock className='new-mb-meta-icon' size={16} />
                      <span>{movie.duration}</span>
                    </div>
                    <div className='new-mb-meta-item'>
                      <Calendar className='new-mb-meta-icon' size={16} />
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  </div>

                  <div className='new-mb-genre-tags'>
                    {movie.genres &&
                      movie.genres.split(",").map((genre, index) => (
                        <span key={index} className='new-mb-genre-tag'>
                          {genre.trim()}
                        </span>
                      ))}
                  </div>

                  <div className='new-mb-movie-actions'>
                    <button
                      className={`new-mb-action-btn ${isLiked ? "active" : ""}`}
                      onClick={handleLike}>
                      <Heart size={18} />
                      {isLiked ? "Liked" : "Like"}
                    </button>
                    <button
                      className={`new-mb-action-btn ${
                        isBookmarked ? "active" : ""
                      }`}
                      onClick={handleBookmark}>
                      <Bookmark size={18} />
                      Save
                    </button>
                    <button className='new-mb-action-btn' onClick={handleShare}>
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className='new-mb-content'>
            <div className='new-mb-tabs'>
              <button
                className={`new-mb-tab ${
                  activeTab === "showtimes" ? "active" : ""
                }`}
                onClick={() => setActiveTab("showtimes")}>
                <Ticket size={18} />
                Book Tickets
              </button>
              <button
                className={`new-mb-tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}>
                <Info size={18} />
                Movie Info
              </button>
              <button
                className={`new-mb-tab ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}>
                <ThumbsUp size={18} />
                Reviews
              </button>
            </div>

            <div className='new-mb-tab-content'>
              {activeTab === "showtimes" && (
                <div className='new-mb-showtimes-panel'>
                  <div className='new-mb-panel-header'>
                    <h2>
                      <Ticket size={24} />
                      Select Your Showtime
                    </h2>
                    <p>Choose your preferred date, time, and theater</p>
                  </div>
                  <div className='new-mb-showtimes-wrapper'>
                    <ShowtimeSelector />
                  </div>
                </div>
              )}

              {activeTab === "info" && (
                <div className='new-mb-info-panel'>
                  <div className='new-mb-info-grid'>
                    <div className='new-mb-info-card'>
                      <h3>
                        <Film size={20} />
                        Movie Details
                      </h3>
                      <div className='new-mb-info-list'>
                        <div className='new-mb-info-item'>
                          <span className='new-mb-info-label'>Genre:</span>
                          <span className='new-mb-info-value'>
                            {movie.genres}
                          </span>
                        </div>
                        <div className='new-mb-info-item'>
                          <span className='new-mb-info-label'>Duration:</span>
                          <span className='new-mb-info-value'>
                            {movie.duration}
                          </span>
                        </div>
                        <div className='new-mb-info-item'>
                          <span className='new-mb-info-label'>Rating:</span>
                          <span className='new-mb-info-value'>
                            {movie.rating}
                          </span>
                        </div>
                        <div className='new-mb-info-item'>
                          <span className='new-mb-info-label'>
                            Release Date:
                          </span>
                          <span className='new-mb-info-value'>
                            {new Date(movie.releaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='new-mb-info-card'>
                      <h3>
                        <Award size={20} />
                        Cinema Features
                      </h3>
                      <div className='new-mb-features'>
                        <div className='new-mb-feature'>
                          <Eye size={16} />
                          <span>4K Ultra HD</span>
                        </div>
                        <div className='new-mb-feature'>
                          <Volume2 size={16} />
                          <span>Dolby Atmos</span>
                        </div>
                        <div className='new-mb-feature'>
                          <Shield size={16} />
                          <span>Premium Seating</span>
                        </div>
                        <div className='new-mb-feature'>
                          <Users size={16} />
                          <span>VIP Experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className='new-mb-reviews-panel'>
                  <div className='new-mb-reviews-summary'>
                    <div className='new-mb-rating-circle'>
                      <span className='new-mb-rating-score'>
                        {movie.rating}
                      </span>
                      <span className='new-mb-rating-label'>Rating</span>
                    </div>
                    <div className='new-mb-rating-stats'>
                      <div className='new-mb-stat'>
                        <TrendingUp size={16} />
                        <span>Trending</span>
                      </div>
                      <div className='new-mb-stat'>
                        <Users size={16} />
                        <span>Popular Choice</span>
                      </div>
                    </div>
                  </div>

                  <div className='new-mb-reviews-placeholder'>
                    <p>Customer reviews coming soon...</p>
                    <p>Be the first to rate this movie after watching!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Booking Summary */}
          <div className='new-mb-floating-summary'>
            <div className='new-mb-summary-content'>
              <div className='new-mb-summary-movie'>
                <img src={movie.moviePosterHomepage} alt={movie.title} />
                <div>
                  <h4>{movie.title}</h4>
                  <p>
                    {movie.rating} • {movie.duration}
                  </p>
                </div>
              </div>
              <div className='new-mb-summary-help'>
                <Users size={16} />
                <span>Need help? Call (555) 123-CINEMA</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieBooking;
