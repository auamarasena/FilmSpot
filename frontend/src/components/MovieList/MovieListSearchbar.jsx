import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import "./MovieListSearchbar.css";

const MovieListSearchBar = ({ onSearch, allMovies = [] }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const genres = useMemo(() => {
    const genreSet = new Set();
    allMovies.forEach((movie) => {
      movie.genres.forEach((g) => genreSet.add(g));
    });
    // Convert the Set to an array and sort it alphabetically
    return Array.from(genreSet).sort();
  }, [allMovies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApply = () => {
    onSearch(searchTitle, genre);
  };

  const handleClear = () => {
    setSearchTitle("");
    setGenre("");
    onSearch("", "");
  };

  // Allow searching by pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
    setIsDropdownOpen(false);
  };

  const handleClearSingleFilter = (filterType) => {
    if (filterType === "title") {
      setSearchTitle("");
      onSearch("", genre);
    }
    if (filterType === "genre") {
      setGenre("");
      onSearch(searchTitle, "");
    }
  };

  return (
    <div className='mlsb-container'>
      <div className='mlsb-search-bar'>
        <div className='mlsb-search-group'>
          <div className='mlsb-search-input-wrapper'>
            <Search className='mlsb-search-icon' size={20} />
            <input
              type='text'
              placeholder='Search movies by title...'
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className='mlsb-search-input'
            />
            {searchTitle && (
              <button
                className='mlsb-clear-btn'
                onClick={() => setSearchTitle("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className='mlsb-filter-group' ref={dropdownRef}>
          <div className='mlsb-dropdown-wrapper'>
            <button
              className={`mlsb-dropdown-btn ${genre ? "mlsb-has-value" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Filter size={16} />
              <span className='mlsb-dropdown-text'>
                {genre || "All Genres"}
              </span>
              <ChevronDown
                size={16}
                className={`mlsb-dropdown-arrow ${
                  isDropdownOpen ? "mlsb-open" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className='mlsb-dropdown-menu'>
                <div className='mlsb-dropdown-header'>
                  <span>Select Genre</span>
                  {genre && (
                    <button
                      className='mlsb-clear-genre'
                      onClick={() => handleGenreSelect("")}>
                      Clear
                    </button>
                  )}
                </div>
                <div className='mlsb-dropdown-content'>
                  <button
                    className={`mlsb-dropdown-item ${
                      !genre ? "mlsb-selected" : ""
                    }`}
                    onClick={() => handleGenreSelect("")}>
                    All Genres
                  </button>
                  {genres.map((g) => (
                    <button
                      key={g}
                      className={`mlsb-dropdown-item ${
                        genre === g ? "mlsb-selected" : ""
                      }`}
                      onClick={() => handleGenreSelect(g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mlsb-actions'>
          <button onClick={handleApply} className='mlsb-apply-btn'>
            <Search size={16} /> Search
          </button>
          {(searchTitle || genre) && (
            <button onClick={handleClear} className='mlsb-clear-all-btn'>
              <X size={16} /> Clear All
            </button>
          )}
        </div>
      </div>

      {(searchTitle || genre) && (
        <div className='mlsb-active-filters'>
          <span className='mlsb-filter-label'>Active filters:</span>
          {searchTitle && (
            <div className='mlsb-filter-tag'>
              <span>Title: "{searchTitle}"</span>
              <button onClick={() => handleClearSingleFilter("title")}>
                <X size={14} />
              </button>
            </div>
          )}
          {genre && (
            <div className='mlsb-filter-tag'>
              <span>Genre: {genre}</span>
              <button onClick={() => handleClearSingleFilter("genre")}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieListSearchBar;
