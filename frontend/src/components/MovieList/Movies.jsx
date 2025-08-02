import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MovieListSearchBar from "./MovieListSearchbar";
import "./Movies.css";
import {
  Play,
  Ticket,
  Clock,
  Star,
  Calendar,
  Filter,
  Grid,
  List,
} from "lucide-react";

const mockNowShowingMovies = [
  {
    _id: "ns1",
    title: "Inception",
    moviePoster:
      "https://www.moviemars.com/cdn/shop/products/603285d4b4c3b25f5b6bd4f03fc51424.jpg?v=1700314591&width=493",
    duration: "148",
    rating: 8.8,
    releaseDate: "2010-07-16",
    genre: "Sci-Fi, Action, Thriller",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    _id: "ns2",
    title: "The Dark Knight",
    moviePoster:
      "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    duration: "152",
    rating: 9.0,
    releaseDate: "2008-07-18",
    genre: "Action, Crime, Drama",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    _id: "ns3",
    title: "Joker",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    duration: "122",
    rating: 8.4,
    releaseDate: "2019-10-04",
    genre: "Crime, Drama, Thriller",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.",
  },
  {
    _id: "ns4",
    title: "Parasite",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    duration: "132",
    rating: 8.6,
    releaseDate: "2019-05-30",
    genre: "Comedy, Drama, Thriller",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  },
];

const mockComingSoonMovies = [
  {
    _id: "cs1",
    title: "Dune: Part Three",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8soXRmfuXb.jpg",
    duration: "160",
    rating: null,
    releaseDate: "2026-10-23",
    genre: "Sci-Fi, Adventure",
    description:
      "The next chapter in the epic saga of Paul Atreides as he navigates the political and religious turmoil of the galaxy.",
  },
  {
    _id: "cs2",
    title: "The Batman Part II",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onHQ.jpg",
    duration: "170",
    rating: null,
    releaseDate: "2025-10-03",
    genre: "Action, Crime, Drama",
    description:
      "The Batman is forced to balance his life as a hero and his life as Bruce Wayne as a new threat emerges in Gotham.",
  },
  {
    _id: "cs3",
    title: "Avatar 3",
    moviePoster:
      "https://image.tmdb.org/t/p/w500/gC3tW9a45RGOzzSh6wv91uQ21x2.jpg",
    duration: "190",
    rating: null,
    releaseDate: "2025-12-19",
    genre: "Sci-Fi, Action, Adventure",
    description:
      "Jake Sully and Ney'tiri form a family and are forced to leave their home and explore the different regions of Pandora when an ancient threat resurfaces.",
  },
];

function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const Movies = () => {
  const [filter, setFilter] = useState("Now Showing");
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const navigate = useNavigate();

  const fetchMovies = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        let sourceMovies =
          filter === "Now Showing"
            ? mockNowShowingMovies
            : mockComingSoonMovies;

        //Search filters
        let result = sourceMovies.filter((movie) => {
          const titleMatch = searchTitle
            ? movie.title.toLowerCase().includes(searchTitle.toLowerCase())
            : true;
          const genreMatch = searchGenre
            ? movie.genre.toLowerCase().includes(searchGenre.toLowerCase())
            : true;
          return titleMatch && genreMatch;
        });

        setMovies(result);
      } catch (err) {
        setError("Failed to load mock movies.");
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, [filter, searchTitle, searchGenre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    let sorted = [...movies];
    switch (sortBy) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "duration":
        sorted.sort(
          (a, b) => (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0)
        );
        break;
      case "releaseDate":
        sorted.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        break;
      default:
        break;
    }
    setFilteredMovies(sorted);
  }, [movies, sortBy]);

  const handleSearch = (title, genre) => {
    setSearchTitle(title);
    setSearchGenre(genre);
  };

  const handleMovieClick = (movieTitle) =>
    navigate(`/movie/${createSlug(movieTitle)}`);
  const handleBooking = (e, movieTitle) => {
    e.stopPropagation();
    navigate(`/booking/${createSlug(movieTitle)}`);
  };

  if (loading) {
    return <div className='ml-loading-container'>...</div>;
  }
  if (error) {
    return (
      <div className='ml-error-container'>
        <button onClick={fetchMovies}>Try Again</button>
      </div>
    );
  }

  return (
    <div className='ml-container'>
      {/* Header Section */}
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
      {/* Search Bar */}
      <MovieListSearchBar onSearch={handleSearch} />
      {/* Controls Section */}
      <div className='ml-controls'>
        <span>{filteredMovies.length} movies found</span>
        <div className='ml-view-controls'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='ml-sort-select'>
            <option value='title'>Sort by Title</option>
            <option value='rating'>Sort by Rating</option>
            <option value='duration'>Sort by Duration</option>
            <option value='releaseDate'>Sort by Release Date</option>
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
      {/* Movies*/}
      {filteredMovies.length === 0 ? (
        <div className='ml-no-results'>
          <h3>No movies found</h3>
        </div>
      ) : (
        <div
          className={`ml-movies-container ${
            viewMode === "list" ? "ml-list-view" : "ml-grid-view"
          }`}>
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className='ml-movie-card'
              onClick={() => handleMovieClick(movie.title)}>
              <div className='ml-movie-poster'>
                <img
                  src={movie.moviePoster}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x450";
                  }}
                />
                <div className='ml-movie-overlay'>
                  <button
                    className='ml-quick-book-btn'
                    onClick={(e) => handleBooking(e, movie.title)}>
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
                    <Clock size={14} /> {movie.duration} min
                  </span>
                  {movie.rating && (
                    <span>
                      <Star size={14} /> {movie.rating}
                    </span>
                  )}
                  {movie.releaseDate && (
                    <span>
                      <Calendar size={14} />{" "}
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>
                {movie.genre && (
                  <div className='ml-genre-tags'>
                    {movie.genre
                      .split(",")
                      .slice(0, 2)
                      .map((g, i) => (
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
                    onClick={(e) => handleBooking(e, movie.title)}>
                    Book Tickets
                  </button>
                  <button
                    className='ml-btn ml-btn-secondary'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieClick(movie.title);
                    }}>
                    Details
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
