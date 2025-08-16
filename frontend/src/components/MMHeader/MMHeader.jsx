import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; 
import "./MMHeader.css";

// Define genre options for the dropdown
const genreOptions = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Animation", label: "Animation" },
  { value: "Comedy", label: "Comedy" },
  { value: "Crime", label: "Crime" },
  { value: "Drama", label: "Drama" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "History", label: "History" },
  { value: "Horror", label: "Horror" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Science Fiction" },
  { value: "Thriller", label: "Thriller" },
  { value: "War", label: "War" },
  { value: "Western", label: "Western" },
];

const MMHeader = () => {
  const { user } = useAuth(); // Get user from context to check for admin role
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFormData = {
    title: "",
    description: "",
    cast: "",
    director: "",
    releaseDate: "",
    duration: "",
    rating: "",
    imdbRating: "",
    trailerURL: "",
    moviePoster: "",
    moviePosterHomepage: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("http://localhost:5001/api/movies");
      setMovies(data);
    } catch (err) {
      setError("Failed to fetch movies from the server.");
      console.error("Fetch movies error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "admin") {
      setError("Authorization Error: Only admins can modify movie data.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const movieData = {
      ...formData,
      genres: selectedGenres.map((g) => g.value),
      cast:
        typeof formData.cast === "string"
          ? formData.cast.split(",").map((item) => item.trim())
          : [],
    };

    try {
      if (editingMovie) {
        // UPDATE existing movie
        await axios.put(
          `http://localhost:5001/api/movies/${editingMovie._id}`,
          movieData
        );
      } else {
        // CREATE new movie
        await api.post("http://localhost:5001/api/movies", movieData);
      }
      handleCloseModal();
      fetchMovies(); // Refresh the movie list
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!user || user.role !== "admin") {
      setError("Authorization Error: Only admins can delete movies.");
      return;
    }
    if (
      !window.confirm("Are you sure you want to permanently delete this movie?")
    )
      return;

    try {
      await axios.delete(`http://localhost:5001/api/movies/${movieId}`);
      fetchMovies(); // Refresh the list after deleting
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete movie.");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : "",
      director: movie.director || "",
      releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
      duration: movie.duration || "",
      rating: movie.rating || "",
      imdbRating: movie.imdbRating || "",
      trailerURL: movie.trailerURL || "",
      moviePoster: movie.moviePoster || "",
      moviePosterHomepage: movie.moviePosterHomepage || "",
    });
    const movieGenres = movie.genres
      ? movie.genres.map((g) => ({ value: g, label: g }))
      : [];
    setSelectedGenres(movieGenres);
    setShowForm(true);
    setError(null);
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setFormData(initialFormData);
    setSelectedGenres([]);
    setShowForm(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingMovie(null);
    setError(null);
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleGenreChange = (selectedOptions) =>
    setSelectedGenres(selectedOptions || []);

  const filteredMovies = movies.filter(
    (movie) =>
      (movie.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className='mm-loading-container'>Loading Movie Management...</div>
    );

  return (
    <div className='mm-container'>
      <div className='mm-header'>
        <h1>Movie Management</h1>
        <button className='mm-add-btn' onClick={handleAddMovie}>
          Add Movie
        </button>
      </div>

      {error && !showForm && (
        <div
          className='mm-error-message'
          style={{ textAlign: "center", margin: "20px" }}>
          {error}
        </div>
      )}

      {!showForm ? (
        <>
          <div className='mm-search-container'>
            <input
              type='text'
              placeholder='Search movies by title or director...'
              className='mm-search-input'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='mm-movies-section'>
            <h2>Movie Collection ({filteredMovies.length})</h2>
            {filteredMovies.length === 0 ? (
              <div className='mm-empty-state'>
                <h3>No Movies Found</h3>
              </div>
            ) : (
              <div className='mm-movies-grid'>
                {filteredMovies.map((movie) => (
                  <div key={movie._id} className='mm-movie-card'>
                    <img
                      src={
                        movie.moviePoster ||
                        "https://via.placeholder.com/240x360.png?text=No+Image"
                      }
                      alt={movie.title}
                      className='mm-movie-poster'
                    />
                    <div className='mm-movie-info'>
                      <h3>{movie.title}</h3>
                      <p>Dir: {movie.director}</p>
                      <div className='mm-movie-actions'>
                        <button
                          className='mm-edit-btn'
                          onClick={() => handleEditMovie(movie)}>
                          Edit
                        </button>
                        <button
                          className='mm-delete-btn'
                          onClick={() => handleDeleteMovie(movie._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='mm-modal-overlay'>
          <div className='mm-modal-content'>
            <h2>{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>
            <button className='mm-modal-close' onClick={handleCloseModal}>
              ×
            </button>
            {error && <div className='mm-error-message'>{error}</div>}
            <form onSubmit={handleSubmit} className='mm-form'>
              <input
                type='text'
                placeholder='Title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                placeholder='Description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <div className='mm-form-row'>
                <input
                  type='text'
                  placeholder='Cast (comma separated)'
                  name='cast'
                  value={formData.cast}
                  onChange={handleInputChange}
                />
                <input
                  type='text'
                  placeholder='Director'
                  name='director'
                  value={formData.director}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='mm-form-row'>
                <input
                  type='date'
                  name='releaseDate'
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type='text'
                  placeholder='Duration (e.g., 148 min)'
                  name='duration'
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='mm-form-row'>
                <input
                  type='text'
                  placeholder='Rating (e.g., PG-13)'
                  name='rating'
                  value={formData.rating}
                  onChange={handleInputChange}
                />
                <input
                  type='number'
                  step='0.1'
                  placeholder='IMDb Score (e.g., 8.8)'
                  name='imdbRating'
                  value={formData.imdbRating}
                  onChange={handleInputChange}
                />
              </div>
              <input
                type='text'
                placeholder='Poster URL (for cards)'
                name='moviePoster'
                value={formData.moviePoster}
                onChange={handleInputChange}
                required
              />
              <input
                type='text'
                placeholder='Homepage Poster URL (large)'
                name='moviePosterHomepage'
                value={formData.moviePosterHomepage}
                onChange={handleInputChange}
                required
              />
              <input
                type='text'
                placeholder='Trailer URL (YouTube)'
                name='trailerURL'
                value={formData.trailerURL}
                onChange={handleInputChange}
              />
              <Select
                isMulti
                options={genreOptions}
                value={selectedGenres}
                onChange={handleGenreChange}
                placeholder='Select genres...'
                className='mm-genre-select'
                classNamePrefix='react-select'
              />
              <div className='mm-form-actions'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  disabled={submitting}>
                  Cancel
                </button>
                <button type='submit' disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingMovie
                    ? "Update Movie"
                    : "Save Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MMHeader;
