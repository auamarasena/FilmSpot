import Movie from "../models/movieModel.js";
import { broadcastMessage } from "../websocket.js";

//Get all movies
export const getMovies = async (req, res) => {
  try {
    const { search, genre, filter } = req.query;

    // Start with an empty query object
    const query = {};

    // If a search term is provided, add a case-insensitive regex search on the title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // If a genre is provided, add it to the query
    if (genre) {
      query.genres = genre;
    }

    //'Now Showing' vs 'Coming Soon' filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (filter === "Now Showing") {
      query.releaseDate = { $lte: today };
    } else if (filter === "Coming Soon") {
      query.releaseDate = { $gt: today };
    }

    // Execute the query on the database
    const movies = await Movie.find(query).sort({ releaseDate: -1 });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching movies" });
  }
};

//Get a single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching movie by ID" });
  }
};

//Create a movie
export const createMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      cast:
        typeof req.body.cast === "string"
          ? req.body.cast.split(",").map((item) => item.trim())
          : req.body.cast,
    };
    const movie = new Movie(movieData);
    const createdMovie = await movie.save();
    broadcastMessage({ type: "MOVIE_COUNT_UPDATE" });
    res.status(201).json(createdMovie);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating movie", error: error.message });
  }
};

//Update a movie by ID
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.title = req.body.title || movie.title;
      movie.description = req.body.description || movie.description;
      movie.releaseDate = req.body.releaseDate || movie.releaseDate;
      movie.duration = req.body.duration || movie.duration;
      movie.genres = req.body.genres || movie.genres;
      movie.director = req.body.director || movie.director;
      if (req.body.cast) {
        movie.cast =
          typeof req.body.cast === "string"
            ? req.body.cast.split(",").map((item) => item.trim())
            : req.body.cast;
      }
      movie.moviePoster = req.body.moviePoster || movie.moviePoster;
      movie.moviePosterHomepage =
        req.body.moviePosterHomepage || movie.moviePosterHomepage;
      movie.trailerURL = req.body.trailerURL || movie.trailerURL;
      movie.imdbRating = req.body.imdbRating || movie.imdbRating;
      movie.rating = req.body.rating || movie.rating;

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

//Delete a movie by ID
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      await movie.deleteOne();
      broadcastMessage({ type: "MOVIE_COUNT_UPDATE" });
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

//Get total movie count
export const getMovieCount = async (req, res) => {
  try {
    const count = await Movie.countDocuments({});
    res.json({ count });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movie count", error: err.message });
  }
};
