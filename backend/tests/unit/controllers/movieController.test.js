jest.mock('../../../src/websocket.js', () => ({
  broadcastMessage: jest.fn(),
  initWebSocket: jest.fn()
}));

import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieCount
} from '../../../src/controllers/movieController.js';
import Movie from '../../../src/models/movieModel.js';
import { mockRequest, mockResponse, clearAllMocks } from '../../utils/mockHelpers.js';
import { testMovies } from '../../fixtures/testData.js';
import { broadcastMessage } from '../../../src/websocket.js';

// Mock dependencies
jest.mock('../../../src/models/movieModel.js');

describe('Movie Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return all movies without filters', async () => {
      const mockMovies = [testMovies.validMovie, testMovies.upcomingMovie];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res);

      expect(Movie.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(mockMovies);
    });

    it('should filter movies by search term', async () => {
      req.query = { search: 'Test' };
      const mockMovies = [testMovies.validMovie];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res);

      expect(Movie.find).toHaveBeenCalledWith({
        title: { $regex: 'Test', $options: 'i' }
      });
    });

    it('should filter movies by genre', async () => {
      req.query = { genre: 'Action' };
      const mockMovies = [testMovies.validMovie];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res);

      expect(Movie.find).toHaveBeenCalledWith({
        genres: 'Action'
      });
    });

    it('should filter "Now Showing" movies', async () => {
      req.query = { filter: 'Now Showing' };
      const mockMovies = [testMovies.validMovie];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res);

      const callArg = Movie.find.mock.calls[0][0];
      expect(callArg.releaseDate.$lte).toBeInstanceOf(Date);
    });

    it('should filter "Coming Soon" movies', async () => {
      req.query = { filter: 'Coming Soon' };
      const mockMovies = [testMovies.upcomingMovie];
      Movie.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res);

      const callArg = Movie.find.mock.calls[0][0];
      expect(callArg.releaseDate.$gt).toBeInstanceOf(Date);
    });

    it('should handle server errors', async () => {
      Movie.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await getMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error fetching movies'
      });
    });
  });

  describe('getMovieById', () => {
    it('should return movie by ID', async () => {
      req.params = { id: 'movieId123' };
      Movie.findById.mockResolvedValue(testMovies.validMovie);

      await getMovieById(req, res);

      expect(Movie.findById).toHaveBeenCalledWith('movieId123');
      expect(res.json).toHaveBeenCalledWith(testMovies.validMovie);
    });

    it('should return 404 if movie not found', async () => {
      req.params = { id: 'nonexistentId' };
      Movie.findById.mockResolvedValue(null);

      await getMovieById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie not found'
      });
    });

    it('should handle server errors', async () => {
      req.params = { id: 'movieId123' };
      Movie.findById.mockRejectedValue(new Error('Database error'));

      await getMovieById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error fetching movie by ID'
      });
    });
  });

  describe('createMovie', () => {
    it('should create a new movie successfully', async () => {
      req.body = { ...testMovies.validMovie, cast: 'Actor 1, Actor 2, Actor 3' };
      const mockMovie = {
        ...testMovies.validMovie,
        _id: 'movieId123',
        save: jest.fn().mockResolvedValue(testMovies.validMovie)
      };

      Movie.prototype.save = jest.fn().mockResolvedValue(mockMovie);

      await createMovie(req, res);

      expect(broadcastMessage).toHaveBeenCalledWith({ type: 'MOVIE_COUNT_UPDATE' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle cast as array', async () => {
      req.body = testMovies.validMovie;
      const mockMovie = {
        ...testMovies.validMovie,
        _id: 'movieId123',
        save: jest.fn().mockResolvedValue(testMovies.validMovie)
      };

      Movie.prototype.save = jest.fn().mockResolvedValue(mockMovie);

      await createMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle creation errors', async () => {
      req.body = testMovies.validMovie;
      Movie.prototype.save = jest.fn().mockRejectedValue(new Error('Validation error'));

      await createMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating movie',
        error: 'Validation error'
      });
    });
  });

  describe('updateMovie', () => {
    it('should update movie successfully', async () => {
      req.params = { id: 'movieId123' };
      req.body = {
        title: 'Updated Title',
        description: 'Updated Description',
        cast: 'New Actor 1, New Actor 2'
      };

      const mockMovie = {
        _id: 'movieId123',
        ...testMovies.validMovie,
        save: jest.fn()
      };

      const updatedMovie = {
        ...mockMovie,
        ...req.body,
        cast: ['New Actor 1', 'New Actor 2']
      };

      Movie.findById.mockResolvedValue(mockMovie);
      mockMovie.save.mockResolvedValue(updatedMovie);

      await updateMovie(req, res);

      expect(Movie.findById).toHaveBeenCalledWith('movieId123');
      expect(mockMovie.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(updatedMovie);
    });

    it('should return 404 if movie not found', async () => {
      req.params = { id: 'nonexistentId' };
      req.body = { title: 'Updated Title' };
      Movie.findById.mockResolvedValue(null);

      await updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie not found'
      });
    });

    it('should handle update errors', async () => {
      req.params = { id: 'movieId123' };
      req.body = { title: 'Updated Title' };
      Movie.findById.mockRejectedValue(new Error('Database error'));

      await updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating movie',
        error: 'Database error'
      });
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie successfully', async () => {
      req.params = { id: 'movieId123' };
      const mockMovie = {
        _id: 'movieId123',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Movie.findById.mockResolvedValue(mockMovie);

      await deleteMovie(req, res);

      expect(Movie.findById).toHaveBeenCalledWith('movieId123');
      expect(mockMovie.deleteOne).toHaveBeenCalled();
      expect(broadcastMessage).toHaveBeenCalledWith({ type: 'MOVIE_COUNT_UPDATE' });
      expect(res.json).toHaveBeenCalledWith({ message: 'Movie removed' });
    });

    it('should return 404 if movie not found', async () => {
      req.params = { id: 'nonexistentId' };
      Movie.findById.mockResolvedValue(null);

      await deleteMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie not found'
      });
    });

    it('should handle deletion errors', async () => {
      req.params = { id: 'movieId123' };
      Movie.findById.mockRejectedValue(new Error('Database error'));

      await deleteMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting movie',
        error: 'Database error'
      });
    });
  });

  describe('getMovieCount', () => {
    it('should return movie count', async () => {
      Movie.countDocuments.mockResolvedValue(25);

      await getMovieCount(req, res);

      expect(Movie.countDocuments).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({ count: 25 });
    });

    it('should handle count errors', async () => {
      Movie.countDocuments.mockRejectedValue(new Error('Database error'));

      await getMovieCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching movie count',
        error: 'Database error'
      });
    });
  });
});