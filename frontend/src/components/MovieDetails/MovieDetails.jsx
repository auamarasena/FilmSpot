import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./MovieDetails.css";

const MovieDetailsSkeleton = () => (
  <div className='md-movie-details-page'>
    <div className='md-movie-details'>
      <div className='md-movie-poster-container'>
        <div className='md-poster-skeleton' />
      </div>
      <div className='md-movie-info'>
        <div className='md-movie-header'>
          <div
            className='md-skeleton-line md-title'
            style={{ width: "70%", height: "40px", marginBottom: "1rem" }}
          />
        </div>
        <div className='md-movie-meta'>
          <div className='md-meta-item md-skeleton-box'></div>
          <div className='md-meta-item md-skeleton-box'></div>
          <div className='md-meta-item md-skeleton-box'></div>
        </div>
        <div className='md-movie-genre'>
          <div
            className='md-skeleton-line md-text'
            style={{ width: "100px", height: "24px" }}
          />
        </div>
        <div className='md-movie-description'>
          <h3>Plot Summary</h3>
          <div className='md-skeleton-line md-text' style={{ width: "90%" }} />
          <div className='md-skeleton-line md-text' style={{ width: "80%" }} />
          <div className='md-skeleton-line md-text md-short' style={{ width: "60%" }} />
        </div>
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
      if (!id) {
        setError("No movie ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data);
      } catch (err) {
        setError("Could not fetch movie details. It may not exist.");
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
      const isCurrentlyFavorite = favorites.some(
        (fav) => fav._id === movie._id
      );
      let updatedFavorites;
      if (isCurrentlyFavorite) {
        updatedFavorites = favorites.filter((fav) => fav._id !== movie._id);
      } else {
        updatedFavorites = [...favorites, movie];
      }
      localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
      setIsFavorite(!isCurrentlyFavorite);
    } catch (e) {
      console.error("Failed to update favorites in localStorage", e);
    }
  };

  //Formatting Helpers
  const formatReleaseDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const getRatingClass = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "md-rating-excellent";
    if (numRating >= 7) return "md-rating-good";
    return "md-rating-average";
  };
  const truncateText = (text, maxLength = 250) => {
    if (!text || text.length <= maxLength) return text;
    return isDescriptionExpanded ? text : `${text.substring(0, maxLength)}...`;
  };

  //Render Logic
  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className='md-movie-details-error'>
        <h2>{error || "Movie Not Found"}</h2>
        <p>We couldn't find the movie you were looking for.</p>
        <button className='md-action-btn md-book-now-btn' onClick={() => navigate("/movies")}>
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className='md-movie-details-page'>
      <div className='md-movie-details'>
        <div className='md-movie-poster-container'>
          <img
            src={movie.moviePosterHomepage}
            alt={movie.title}
            className='md-movie-poster'
          />
          <div className='md-poster-overlay'>
            <button
              className={`md-favorite-btn ${isFavorite ? "md-favorited" : ""}`}
              onClick={handleFavoriteToggle}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div className='md-movie-info'>
          <div className='md-movie-header'>
            <h1 className='md-movie-title'>{movie.title}</h1>
            <div className='md-movie-actions'>
              <Link
                to={`/booking/${movie._id}`}
                className='md-action-btn md-book-now-btn'>
                Book Tickets
              </Link>
            </div>
          </div>

          <div className='md-movie-meta'>
            <div className='md-meta-item'>
              <span className='md-meta-label'>Release Date</span>
              <span className='md-meta-value'>
                {formatReleaseDate(movie.releaseDate)}
              </span>
            </div>
            <div className='md-meta-item'>
              <span className='md-meta-label'>IMDb Rating</span>
              <span
                className={`md-meta-value md-rating ${getRatingClass(
                  movie.imdbRating
                )}`}>
                ⭐ {movie.imdbRating || "N/A"}
              </span>
            </div>
            <div className='md-meta-item'>
              <span className='md-meta-label'>Duration</span>
              <span className='md-meta-value'>{movie.duration}</span>
            </div>
          </div>

          <div className='md-movie-genre'>
            <span className='md-genre-label'>Genres</span>
            <div className='md-genre-tags'>
              {movie.genres?.map((genre, index) => (
                <span key={index} className='md-genre-tag'>
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className='md-movie-description'>
            <h3>Plot Summary</h3>
            <p className='md-description-text'>
              {truncateText(movie.description)}
            </p>
            {movie.description && movie.description.length > 250 && (
              <button
                className='md-expand-btn'
                onClick={() =>
                  setIsDescriptionExpanded(!isDescriptionExpanded)
                }>
                {isDescriptionExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <div className='md-movie-credits'>
            <div className='md-credit-item'>
              <span className='md-credit-label'>Director:</span>
              <span className='md-credit-value'>{movie.director}</span>
            </div>
            <div className='md-credit-item'>
              <span className='md-credit-label'>Cast:</span>
              <span className='md-credit-value'>{movie.cast?.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;