import mongoose from 'mongoose';
import Movie from '../../../src/models/movieModel.js';
import { connect, closeDatabase, clearDatabase } from '../../utils/testDb.js';
import { testMovies } from '../../fixtures/testData.js';

describe('Movie Model Unit Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Movie validation', () => {
    it('should create a valid movie successfully', async () => {
      const movie = new Movie(testMovies.validMovie);
      const savedMovie = await movie.save();

      expect(savedMovie._id).toBeDefined();
      expect(savedMovie.title).toBe(testMovies.validMovie.title);
      expect(savedMovie.description).toBe(testMovies.validMovie.description);
      expect(savedMovie.releaseDate).toEqual(testMovies.validMovie.releaseDate);
      expect(savedMovie.duration).toBe(testMovies.validMovie.duration);
      expect(savedMovie.genres).toEqual(testMovies.validMovie.genres);
      expect(savedMovie.director).toBe(testMovies.validMovie.director);
      expect(savedMovie.cast).toEqual(testMovies.validMovie.cast);
      expect(savedMovie.moviePoster).toBe(testMovies.validMovie.moviePoster);
      expect(savedMovie.trailerURL).toBe(testMovies.validMovie.trailerURL);
      expect(savedMovie.imdbRating).toBe(testMovies.validMovie.imdbRating);
      expect(savedMovie.rating).toBe(testMovies.validMovie.rating);
    });

    it('should require title', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        title: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require description', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        description: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require releaseDate', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        releaseDate: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require duration', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        duration: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require director', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        director: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require at least one genre', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        genres: []
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should require moviePoster', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        moviePoster: undefined
      });

      await expect(movie.save()).rejects.toThrow();
    });

    it('should validate imdbRating range', async () => {
      const movieWithHighRating = new Movie({
        ...testMovies.validMovie,
        imdbRating: 11
      });

      await expect(movieWithHighRating.save()).rejects.toThrow();

      const movieWithNegativeRating = new Movie({
        ...testMovies.validMovie,
        imdbRating: -1
      });

      await expect(movieWithNegativeRating.save()).rejects.toThrow();
    });

    it('should accept valid imdbRating', async () => {
      const movie = new Movie({
        ...testMovies.validMovie,
        imdbRating: 7.5
      });

      const savedMovie = await movie.save();
      expect(savedMovie.imdbRating).toBe(7.5);
    });

    it('should add timestamps', async () => {
      const movie = new Movie(testMovies.validMovie);
      const savedMovie = await movie.save();

      expect(savedMovie.createdAt).toBeDefined();
      expect(savedMovie.updatedAt).toBeDefined();
    });
  });

  describe('Movie schema structure', () => {
    it('should have correct schema fields', () => {
      const schemaKeys = Object.keys(Movie.schema.paths);

      expect(schemaKeys).toContain('title');
      expect(schemaKeys).toContain('description');
      expect(schemaKeys).toContain('releaseDate');
      expect(schemaKeys).toContain('duration');
      expect(schemaKeys).toContain('genres');
      expect(schemaKeys).toContain('director');
      expect(schemaKeys).toContain('cast');
      expect(schemaKeys).toContain('moviePoster');
      expect(schemaKeys).toContain('moviePosterHomepage');
      expect(schemaKeys).toContain('trailerURL');
      expect(schemaKeys).toContain('imdbRating');
      expect(schemaKeys).toContain('rating');
    });

    it('should have correct field types', () => {
      expect(Movie.schema.paths.title.instance).toBe('String');
      expect(Movie.schema.paths.description.instance).toBe('String');
      expect(Movie.schema.paths.releaseDate.instance).toBe('Date');
      expect(Movie.schema.paths.duration.instance).toBe('Number');
      expect(Movie.schema.paths.genres.instance).toBe('Array');
      expect(Movie.schema.paths.director.instance).toBe('String');
      expect(Movie.schema.paths.cast.instance).toBe('Array');
      expect(Movie.schema.paths.moviePoster.instance).toBe('String');
      expect(Movie.schema.paths.trailerURL.instance).toBe('String');
      expect(Movie.schema.paths.imdbRating.instance).toBe('Number');
      expect(Movie.schema.paths.rating.instance).toBe('String');
    });
  });

  describe('Movie array fields', () => {
    it('should handle genres as an array', async () => {
      const movie = new Movie(testMovies.validMovie);
      const savedMovie = await movie.save();

      expect(Array.isArray(savedMovie.genres)).toBe(true);
      expect(savedMovie.genres).toContain('Action');
      expect(savedMovie.genres).toContain('Drama');
    });

    it('should handle cast as an array', async () => {
      const movie = new Movie(testMovies.validMovie);
      const savedMovie = await movie.save();

      expect(Array.isArray(savedMovie.cast)).toBe(true);
      expect(savedMovie.cast.length).toBe(3);
      expect(savedMovie.cast).toContain('Actor 1');
    });
  });

  describe('Movie date handling', () => {
    it('should handle past release dates', async () => {
      const pastDate = new Date('2020-01-01');
      const movie = new Movie({
        ...testMovies.validMovie,
        releaseDate: pastDate
      });

      const savedMovie = await movie.save();
      expect(savedMovie.releaseDate).toEqual(pastDate);
    });

    it('should handle future release dates', async () => {
      const futureDate = new Date('2025-12-31');
      const movie = new Movie({
        ...testMovies.validMovie,
        releaseDate: futureDate
      });

      const savedMovie = await movie.save();
      expect(savedMovie.releaseDate).toEqual(futureDate);
    });
  });
});