import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./MovieDetails.css";

const MovieDetailsSkeleton = () => (
  <div className='movie-details'>
    <div className='movie-poster-container'>
      <div className='poster-skeleton' />
    </div>
    <div className='movie-info'>
      <div className='movie-header'>
        <div
          className='skeleton-line title'
          style={{ width: "70%", height: "40px", marginBottom: "1rem" }}
        />
      </div>
      <div className='movie-meta'>
        <div className='meta-item skeleton-box'></div>
        <div className='meta-item skeleton-box'></div>
        <div className='meta-item skeleton-box'></div>
      </div>
      <div className='movie-genre'>
        <div
          className='skeleton-line text'
          style={{ width: "100px", height: "24px" }}
        />
      </div>
      <div className='movie-description'>
        <h3>Plot Summary</h3>
        <div className='skeleton-line text' style={{ width: "90%" }} />
        <div className='skeleton-line text' style={{ width: "80%" }} />
        <div className='skeleton-line text short' style={{ width: "60%" }} />
      </div>
    </div>
  </div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data);
      } catch (err) {
        setError("Could not fetch movie details. Please try again later.");
        console.error("Fetch Movie Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    try {
      const favorites = JSON.parse(
        localStorage.getItem("favoriteMovies") || "[]"
      );
      setIsFavorite(favorites.some((fav) => fav._id === movie._id));
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
    }
  }, [movie]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    try {
      const favorites = JSON.parse(
        localStorage.getItem("favoriteMovies") || "[]"
      );
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favorites.filter((fav) => fav._id !== movie._id);
      } else {
        updatedFavorites = [...favorites, movie];
      }
      localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Failed to update favorites in localStorage", e);
    }
  };

  const formatReleaseDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const getRatingClass = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "rating-excellent";
    if (numRating >= 7) return "rating-good";
    return "rating-average";
  };
  const truncateText = (text, maxLength = 250) => {
    if (!text || text.length <= maxLength) return text;
    return isDescriptionExpanded ? text : `${text.substring(0, maxLength)}...`;
  };

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className='movie-details-error'>
        <h2>{error || "Movie Not Found"}</h2>
        <p>We couldn't find the movie you were looking for.</p>
        <button className='btn btn-primary' onClick={() => navigate("/movies")}>
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className='movie-details-page'>
      <div className='movie-details'>
        <div className='movie-poster-container'>
          <img
            src={movie.moviePosterHomepage}
            alt={movie.title}
            className='movie-poster'
          />
          <div className='poster-overlay'>
            <button
              className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
              onClick={handleFavoriteToggle}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div className='movie-info'>
          <div className='movie-header'>
            <h1 className='movie-title'>{movie.title}</h1>
            <div className='movie-actions'>
              <Link
                to={`/booking/${movie._id}`}
                className='action-btn book-now-btn'>
                Book Tickets
              </Link>
            </div>
          </div>

          <div className='movie-meta'>
            <div className='meta-item'>
              <span className='meta-label'>Release Date</span>
              <span className='meta-value'>
                {formatReleaseDate(movie.releaseDate)}
              </span>
            </div>
            <div className='meta-item'>
              <span className='meta-label'>IMDb Rating</span>
              <span
                className={`meta-value rating ${getRatingClass(
                  movie.imdbRating
                )}`}>
                ⭐ {movie.imdbRating || "N/A"}
              </span>
            </div>
            <div className='meta-item'>
              <span className='meta-label'>Duration</span>
              <span className='meta-value'>{movie.duration}</span>
            </div>
          </div>

          <div className='movie-genre'>
            <span className='genre-label'>Genres</span>
            <div className='genre-tags'>
              {movie.genres?.map((genre, index) => (
                <span key={index} className='genre-tag'>
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className='movie-description'>
            <h3>Plot Summary</h3>
            <p className='description-text'>
              {truncateText(movie.description)}
            </p>
            {movie.description && movie.description.length > 250 && (
              <button
                className='expand-btn'
                onClick={() =>
                  setIsDescriptionExpanded(!isDescriptionExpanded)
                }>
                {isDescriptionExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <div className='movie-credits'>
            <div className='credit-item'>
              <span className='credit-label'>Director:</span>
              <span className='credit-value'>{movie.director}</span>
            </div>
            <div className='credit-item'>
              <span className='credit-label'>Cast:</span>
              <span className='credit-value'>{movie.cast?.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
