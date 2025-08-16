import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import ShowtimeSelector from "../Showtimes/ShowtimeSelector.jsx";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Info,
  Ticket,
  Home,
  ChevronRight,
  Film,
  Heart, 
} from "lucide-react";
import "./MovieBooking.css";

const MovieBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("showtimes");
  const [isLiked, setIsLiked] = useState(false); 

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError("Movie ID is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
        console.error("Fetch Movie Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <div className='new-mb-loading-screen'>
        <h2>Loading Cinema Experience...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className='new-mb-error-screen'>
        <h2>Oops! Something Went Wrong</h2>
        <p>{error || "Movie not found."}</p>
        <button onClick={() => navigate("/movies")} className='btn btn-primary'>
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className='new-mb-container'>
      <div className='new-mb-cinema-header'>
        <div className='new-mb-header-content'>
          <nav className='new-mb-breadcrumb'>
            <Link to='/' className='new-mb-breadcrumb-item'><Home size={16} />Home</Link>
            <ChevronRight size={14} />
            <Link to='/movies' className='new-mb-breadcrumb-item'><Film size={16} />Movies</Link>
            <ChevronRight size={14} />
            <span className='new-mb-breadcrumb-current'>Book Tickets</span>
          </nav>
          <button onClick={() => navigate("/movies")} className='new-mb-back-btn'>
            <ArrowLeft size={18} /> Back to Movies
          </button>
        </div>
      </div>

      <div className='new-mb-hero' style={{ backgroundImage: `url(${movie.moviePosterHomepage})` }}>
        <div className='new-mb-hero-overlay'>
          <div className='new-mb-hero-content'>
            <div className='new-mb-movie-poster'>
              <img src={movie.moviePoster} alt={movie.title} />
            </div>
            <div className='new-mb-movie-info'>
              <h1 className='new-mb-movie-title'>{movie.title}</h1>
              <div className='new-mb-movie-meta'>
                <div className='new-mb-meta-item'><Star size={16} /><span>{movie.imdbRating || "N/A"}</span></div>
                <div className='new-mb-meta-item'><Clock size={16} /><span>{movie.duration}</span></div>
                <div className='new-mb-meta-item'><Calendar size={16} /><span>{new Date(movie.releaseDate).getFullYear()}</span></div>
              </div>
              <div className='new-mb-genre-tags'>
                {movie.genres?.map((genre, index) => (
                  <span key={index} className='new-mb-genre-tag'>{genre.trim()}</span>
                ))}
              </div>
              <div className='new-mb-movie-actions'>
                <button
                  className={`new-mb-action-btn ${isLiked ? "active" : ""}`}
                  onClick={handleLike}>
                  <Heart size={18} /> {isLiked ? "Liked" : "Like"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='new-mb-content'>
        <div className='new-mb-tabs'>
          <button
            className={`new-mb-tab ${activeTab === "showtimes" ? "active" : ""}`}
            onClick={() => setActiveTab("showtimes")}
          >
            <Ticket size={18} />Book Tickets
          </button>
          <button
            className={`new-mb-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <Info size={18} />Movie Info
          </button>
        </div>
        <div className='new-mb-tab-content'>
          {activeTab === "showtimes" && (
            <div className='new-mb-showtimes-panel'>
              <div className='new-mb-panel-header'>
                <h2><Ticket size={24} />Select Your Showtime</h2>
                <p>Choose your preferred date, time, and theater</p>
              </div>
              <div className='new-mb-showtimes-wrapper'>
                <ShowtimeSelector movieId={movie._id} />
              </div>
            </div>
          )}
          {activeTab === "info" && (
            <div className='new-mb-info-panel'>
              <h3>Plot Summary</h3>
              <p>{movie.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieBooking;