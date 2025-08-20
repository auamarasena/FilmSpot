import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import MovieListSearchBar from "./MovieListSearchbar";
import { Grid, List, Clock, Star, Calendar } from "lucide-react";
import "./movies.css";

const Movies = () => {
  const [filter, setFilter] = useState("Now Showing");
  const [allMovies, setAllMovies] = useState([]);
  const [displayMovies, setDisplayMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("releaseDate");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTitle) params.append("search", searchTitle);
        if (searchGenre) params.append("genre", searchGenre);
        if (filter) params.append("filter", filter);

        const { data } = await api.get(`/movies`, { params });

        let sortedData = [...data];
        switch (sortBy) {
          case "title":
            sortedData.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "rating":
            sortedData.sort(
              (a, b) => (b.imdbRating || 0) - (a.imdbRating || 0)
            );
            break;
          case "duration":
            sortedData.sort(
              (a, b) =>
                (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0)
            );
            break;
          case "releaseDate":
          default:
            break;
        }

        setDisplayMovies(sortedData);
      } catch (err) {
        setError("Failed to load movies. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [filter, searchTitle, searchGenre, sortBy]);

  useEffect(() => {
    api
      .get("/movies")
      .then((response) => {
        setAllMovies(response.data);
      })
      .catch((err) =>
        console.error("Failed to fetch all movies for genre list:", err)
      );
  }, []);

  const handleSearch = (title, genre) => {
    setSearchTitle(title);
    setSearchGenre(genre);
  };

  const handleMovieClick = (movieId) => navigate(`/movie/${movieId}`);
  const handleBooking = (e, movieId) => {
    e.stopPropagation();
    navigate(`/booking/${movieId}`);
  };

  if (loading)
    return <div className='ml-loading-container'>Loading Movies...</div>;
  if (error) return <div className='ml-error-container'>{error}</div>;

  return (
    <div className='ml-container'>
      <div className='ml-header'>
        <h1 className='ml-main-title'>Movies</h1>
        <div className='ml-filter-tabs'>
          <button
            className={`ml-filter-tab ${
              filter === "Now Showing" ? "ml-active" : ""
            }`}
            onClick={() => setFilter("Now Showing")}>
            Now Showing
          </button>
          <button
            className={`ml-filter-tab ${
              filter === "Coming Soon" ? "ml-active" : ""
            }`}
            onClick={() => setFilter("Coming Soon")}>
            Coming Soon
          </button>
        </div>
      </div>

      <MovieListSearchBar onSearch={handleSearch} allMovies={allMovies} />

      <div className='ml-controls'>
        <span>{displayMovies.length} movies found</span>
        <div className='ml-view-controls'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='ml-sort-select'>
            <option value='releaseDate'>Sort by Release Date</option>
            <option value='title'>Sort by Title</option>
            <option value='rating'>Sort by Rating</option>
          </select>
          <button
            className={`ml-view-btn ${viewMode === "grid" ? "ml-active" : ""}`}
            onClick={() => setViewMode("grid")}>
            <Grid size={18} />
          </button>
          <button
            className={`ml-view-btn ${viewMode === "list" ? "ml-active" : ""}`}
            onClick={() => setViewMode("list")}>
            <List size={18} />
          </button>
        </div>
      </div>

      {displayMovies.length === 0 ? (
        <div className='ml-no-results'>
          <h3>No movies found for this criteria.</h3>
        </div>
      ) : (
        <div
          className={`ml-movies-container ${
            viewMode === "list" ? "ml-list-view" : "ml-grid-view"
          }`}>
          {displayMovies.map((movie) => (
            <div
              key={movie._id}
              className='ml-movie-card'
              onClick={() => handleMovieClick(movie._id)}>
              <div className='ml-movie-poster'>
                <img
                  src={movie.moviePoster}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
                <div className='ml-movie-overlay'>
                  <button
                    className='ml-quick-book-btn'
                    onClick={(e) => handleBooking(e, movie._id)}>
                    Quick Book
                  </button>
                </div>
                {filter === "Coming Soon" && (
                  <div className='ml-coming-soon-badge'>Coming Soon</div>
                )}
              </div>
              <div className='ml-movie-info'>
                <h3 className='ml-movie-title'>{movie.title}</h3>
                <div className='ml-movie-meta'>
                  <span>
                    <Clock size={14} /> {movie.duration}
                  </span>
                  {movie.imdbRating && (
                    <span>
                      <Star size={14} /> {movie.imdbRating}
                    </span>
                  )}
                  {movie.releaseDate && (
                    <span>
                      <Calendar size={14} />{" "}
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>
                {movie.genres && (
                  <div className='ml-genre-tags'>
                    {movie.genres.slice(0, 2).map((g, i) => (
                      <span key={i}>{g.trim()}</span>
                    ))}
                  </div>
                )}
                <p className='ml-movie-description'>
                  {movie.description?.substring(0, 120)}...
                </p>
                <div className='ml-movie-actions'>
                  <button
                    className='ml-btn ml-btn-primary'
                    onClick={(e) => handleBooking(e, movie._id)}>
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
