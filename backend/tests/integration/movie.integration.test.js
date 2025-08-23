import request from 'supertest';
import app from '../../src/app.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { testMovies, testUsers } from '../fixtures/testData.js';
import Movie from '../../src/models/movieModel.js';
import User from '../../src/models/userModel.js';
import jwt from 'jsonwebtoken';

describe('Movie Routes Integration Tests', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Create admin user
    const adminUser = new User(testUsers.adminUser);
    const savedAdmin = await adminUser.save();
    adminToken = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET);

    // Create regular user
    const regularUser = new User(testUsers.validUser);
    const savedUser = await regularUser.save();
    userToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/movies', () => {
    beforeEach(async () => {
      // Create test movies
      await Movie.create(testMovies.validMovie);
      await Movie.create(testMovies.upcomingMovie);
    });

    it('should get all movies', async () => {
      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should filter movies by search term', async () => {
      const response = await request(app)
        .get('/api/movies?search=The')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('The Test Movie');
    });

    it('should filter movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies?genre=Action')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].genres).toContain('Action');
    });

    it('should filter "Now Showing" movies', async () => {
      const response = await request(app)
        .get('/api/movies?filter=Now Showing')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('The Test Movie');
    });

    it('should filter "Coming Soon" movies', async () => {
      const response = await request(app)
        .get('/api/movies?filter=Coming Soon')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Future Test Movie');
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/movies?search=Future&genre=Sci-Fi&filter=Coming Soon')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Future Test Movie');
    });
  });

  describe('GET /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create(testMovies.validMovie);
      movieId = movie._id;
    });

    it('should get movie by ID', async () => {
      const response = await request(app)
        .get(`/api/movies/${movieId}`)
        .expect(200);

      expect(response.body.title).toBe(testMovies.validMovie.title);
      expect(response.body._id).toBe(movieId.toString());
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/movies/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Movie not found');
    });

    it('should handle invalid movie ID format', async () => {
      const response = await request(app)
        .get('/api/movies/invalid-id')
        .expect(500);

      expect(response.body.message).toBe('Server error fetching movie by ID');
    });
  });

  describe('POST /api/movies', () => {
    it('should create movie with admin token', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testMovies.validMovie)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(testMovies.validMovie.title);
      expect(response.body.genres).toEqual(testMovies.validMovie.genres);

      // Verify movie was created in database
      const movie = await Movie.findById(response.body._id);
      expect(movie).toBeTruthy();
    });

    it('should handle cast as comma-separated string', async () => {
      const movieData = {
        ...testMovies.validMovie,
        cast: 'Actor 1, Actor 2, Actor 3'
      };

      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(movieData)
        .expect(201);

      expect(response.body.cast).toEqual(['Actor 1', 'Actor 2', 'Actor 3']);
    });

    it('should not create movie without admin privileges', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testMovies.validMovie)
        .expect(401);

      expect(response.body.message).toBe('Not authorized as an admin');
    });

    it('should not create movie without authentication', async () => {
      const response = await request(app)
        .post('/api/movies')
        .send(testMovies.validMovie)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should validate required fields', async () => {
      const invalidMovie = {
        title: 'Test Movie'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidMovie)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Error creating movie');
    });
  });

  describe('PUT /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create(testMovies.validMovie);
      movieId = movie._id;
    });

    it('should update movie with admin token', async () => {
      const updateData = {
        title: 'Updated Movie Title',
        description: 'Updated description',
        cast: 'New Actor 1, New Actor 2'
      };

      const response = await request(app)
        .put(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.cast).toEqual(['New Actor 1', 'New Actor 2']);

      // Verify changes in database
      const updatedMovie = await Movie.findById(movieId);
      expect(updatedMovie.title).toBe(updateData.title);
    });

    it('should not update movie without admin privileges', async () => {
      const response = await request(app)
        .put(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'New Title' })
        .expect(401);

      expect(response.body.message).toBe('Not authorized as an admin');
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/movies/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.message).toBe('Movie not found');
    });
  });

  describe('DELETE /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create(testMovies.validMovie);
      movieId = movie._id;
    });

    it('should delete movie with admin token', async () => {
      const response = await request(app)
        .delete(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('Movie removed');

      // Verify movie was deleted from database
      const deletedMovie = await Movie.findById(movieId);
      expect(deletedMovie).toBeNull();
    });

    it('should not delete movie without admin privileges', async () => {
      const response = await request(app)
        .delete(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);

      expect(response.body.message).toBe('Not authorized as an admin');

      // Verify movie still exists
      const movie = await Movie.findById(movieId);
      expect(movie).toBeTruthy();
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/movies/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.message).toBe('Movie not found');
    });
  });

  describe('GET /api/movies/stats/count', () => {
    it('should return movie count', async () => {
      // Create multiple movies
      await Movie.create(testMovies.validMovie);
      await Movie.create(testMovies.upcomingMovie);

      const response = await request(app)
        .get('/api/movies/stats/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.count).toBe(2);
    });

    it('should return zero when no movies exist', async () => {
      const response = await request(app)
        .get('/api/movies/stats/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.count).toBe(0);
    });
  });
});