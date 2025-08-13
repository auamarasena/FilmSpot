import Movie from "../models/movieModel.js";

//GET /api/movies - Get all movies (Public)
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching movies" });
  }
};

//GET /api/movies/:id - Get a single movie by ID (Public)
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//POST /api/movies - Create a movie (Private/Admin)
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      description: req.body.description,
      releaseDate: req.body.releaseDate,
      duration: req.body.duration,
      genres: req.body.genres,
      director: req.body.director,
      cast: req.body.cast,
      moviePoster: req.body.moviePoster,
      moviePosterHomepage: req.body.moviePosterHomepage,
      trailerURL: req.body.trailerURL,
      imdbRating: req.body.imdbRating,
      rating: req.body.rating,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating movie", error: error.message });
  }
};

//
//PUT /api/movies/:id - Update a movie (Private/Admin)
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.title = req.body.title || movie.title;
      movie.description = req.body.description || movie.description;
      movie.cast = req.body.cast || movie.cast;
      movie.director = req.body.director || movie.director;
      movie.releaseDate = req.body.releaseDate || movie.releaseDate;
      movie.duration = req.body.duration || movie.duration;
      movie.rating = req.body.rating || movie.rating;
      movie.genres = req.body.genres || movie.genres;
      movie.imdbRating = req.body.imdbRating || movie.imdbRating;
      movie.trailerURL = req.body.trailerURL || movie.trailerURL;
      movie.moviePoster = req.body.moviePoster || movie.moviePoster;
      movie.moviePosterHomepage =
        req.body.moviePosterHomepage || movie.moviePosterHomepage;

      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating movie", error: error.message });
  }
};

//DELETE /api/movies/:id - Delete a movie (Private/Admin)
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      await movie.deleteOne();
      res.json({ message: "Movie removed" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: error.message });
  }
};
