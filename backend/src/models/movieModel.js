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
      type: Number,
      required: true,
    },
    rating: {
      type: String,
    },
    genres: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one genre is required'
      }
    },
    imdbRating: {
      type: Number,
      min: [0, 'IMDB rating must be at least 0'],
      max: [10, 'IMDB rating must be at most 10']
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
