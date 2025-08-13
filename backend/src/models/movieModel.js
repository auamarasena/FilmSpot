import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
    },
    genres: {
      type: [String],
      required: true,
      default: [],
    },
    imdbRating: {
      type: Number,
    },
    trailerURL: {
      type: String,
    },
    moviePoster: {
      type: String,
      required: true,
    },
    moviePosterHomepage: {
      type: String,
      required: true,
    },
  },
  {
    //Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
