import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MMHeader.css";

const mockInitialMovies = [
  {
    _id: "movie-1",
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
    director: "Denis Villeneuve",
    releaseDate: "2024-03-01",
    duration: "2h 46m",
    rating: "PG-13",
    genres: "sci-fi,action",
    imdbRating: "4.8",
    trailerURL: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8soXRmfuXb.jpg",
    moviePosterHomepage:
      "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8soXRmfuXb.jpg",
  },
  {
    _id: "movie-2",
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    cast: "Cillian Murphy, Emily Blunt, Matt Damon",
    director: "Christopher Nolan",
    releaseDate: "2023-07-21",
    duration: "3h 0m",
    rating: "R",
    genres: "drama,thriller",
    imdbRating: "4.5",
    trailerURL: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    moviePosterHomepage:
      "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
];

const MMHeader = () => {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cast: "",
    director: "",
    releaseDate: "",
    duration: "",
    rating: "",
    genres: "",
    imdbRating: "",
    trailerURL: "",
    moviePoster: "",
    moviePosterHomepage: "",
  });
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMovies(mockInitialMovies);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      if (editingMovie) {
        const updatedMovie = { ...editingMovie, ...formData };
        setMovies((prev) =>
          prev.map((m) => (m._id === editingMovie._id ? updatedMovie : m))
        );
      } else {
        const newMovie = { ...formData, _id: `movie-${Date.now()}` };
        setMovies((prev) => [...prev, newMovie]);
      }
      handleCloseModal();
      setSubmitting(false);
    }, 1000);
  };

  const handleDeleteMovie = (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setDeleting(movieId);
    setTimeout(() => {
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
      setDeleting(null);
    }, 1000);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      cast: movie.cast || "",
      director: movie.director || "",
      releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
      duration: movie.duration || "",
      rating: movie.rating || "",
      genres: movie.genres || "",
      imdbRating: movie.imdbRating || "",
      trailerURL: movie.trailerURL || "",
      moviePoster: movie.moviePoster || "",
      moviePosterHomepage: movie.moviePosterHomepage || "",
    });
    const movieGenres = movie.genres
      ? movie.genres
          .split(",")
          .map(
            (g) =>
              genreOptions.find((opt) => opt.value === g.trim()) || {
                value: g.trim(),
                label: g.trim(),
              }
          )
      : [];
    setSelectedGenres(movieGenres);
    setShowForm(true);
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      description: "",
      cast: "",
      director: "",
      releaseDate: "",
      duration: "",
      rating: "",
      genres: "",
      imdbRating: "",
      trailerURL: "",
      moviePoster: "",
      moviePosterHomepage: "",
    });
    setSelectedGenres([]);
    setShowForm(true);
  };

  const handleCloseModal = () => setShowForm(false);
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions || []);
    setFormData({
      ...formData,
      genres: selectedOptions
        ? selectedOptions.map((o) => o.value).join(",")
        : "",
    });
  };

  const filteredMovies = movies.filter(
    (movie) =>
      (movie.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const genreOptions = [
    { value: "action", label: "Action" },
    { value: "animation", label: "Animation" },
    { value: "comedy", label: "Comedy" },
    { value: "crime", label: "Crime" },
    { value: "drama", label: "Drama" },
    { value: "fantasy", label: "Fantasy" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "thriller", label: "Thriller" },
  ];

  const customSelectStyles = {
    /* Style object from previous answer */
  };

  if (loading)
    return <div className='mm-loading-container'>Loading Movies...</div>;

  return (
    <div className='mm-container'>
      <div className='mm-header'>
        <h1>Movie Management</h1>
        <button className='mm-add-btn' onClick={handleAddMovie}>
          Add Movie
        </button>
      </div>
      {!showForm ? (
        <>
          <div className='mm-search-container'>
            <input
              type='text'
              placeholder='Search movies...'
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
                    {/* UPDATED: Image is now displayed from movie data */}
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
                          onClick={() => handleDeleteMovie(movie._id)}
                          disabled={deleting === movie._id}>
                          {deleting === movie._id ? "Deleting..." : "Delete"}
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
              {/* --- FORM FIELDS --- */}
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
                />
              </div>
              <div className='mm-form-row'>
                <input
                  type='date'
                  name='releaseDate'
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                />
                <input
                  type='text'
                  placeholder='Duration (e.g., 2h 30m)'
                  name='duration'
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
              {/* --- NEW: IMAGE URL INPUTS --- */}
              <input
                type='text'
                placeholder='Poster URL (for cards)'
                name='moviePoster'
                value={formData.moviePoster}
                onChange={handleInputChange}
              />
              <input
                type='text'
                placeholder='Homepage Poster URL (large)'
                name='moviePosterHomepage'
                value={formData.moviePosterHomepage}
                onChange={handleInputChange}
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
                styles={customSelectStyles}
                placeholder='Select genres...'
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
