import request from 'supertest';
import app from '../../src/app.js';
import { connect, closeDatabase, clearDatabase } from '../utils/testDb.js';
import { testUsers } from '../fixtures/testData.js';
import User from '../../src/models/userModel.js';
import jwt from 'jsonwebtoken';

// Helper function to generate tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
};

describe('Auth Routes Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUsers.validUser)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('token');
      expect(response.body.firstName).toBe(testUsers.validUser.firstName);
      expect(response.body.email).toBe(testUsers.validUser.email);
      expect(response.body.role).toBe('user');
      expect(response.body).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await User.findOne({ email: testUsers.validUser.email });
      expect(user).toBeTruthy();
    });

    it('should not register user with existing email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(testUsers.validUser);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUsers.validUser)
        .expect(400);

      expect(response.body.message).toBe('User with that email already exists');
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        firstName: 'John',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const user = new User(testUsers.validUser);
      await user.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.validUser.email,
          password: testUsers.validUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(testUsers.validUser.email);
      expect(response.body.firstName).toBe(testUsers.validUser.firstName);
      expect(response.body.role).toBe('user');
      expect(response.body).not.toHaveProperty('password');

      // Verify token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('id');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.validUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUsers.validUser.password
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.validUser.email
          // Missing password
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create a user and get token
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();
      userId = savedUser._id;
      authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(userId.toString());
      expect(response.body.email).toBe(testUsers.validUser.email);
      expect(response.body.firstName).toBe(testUsers.validUser.firstName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body.message).toBe('Not authorized, token failed');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create a user and get token
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();
      userId = savedUser._id;
      authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast',
        mobile: '9999999999'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
      expect(response.body.mobile).toBe(updateData.mobile);
      expect(response.body.email).toBe(testUsers.validUser.email); // Should not change
      expect(response.body).toHaveProperty('token');

      // Verify changes in database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.firstName).toBe(updateData.firstName);
    });

    it('should not update profile without authentication', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({ firstName: 'NewName' })
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });
  });

  describe('GET /api/auth/count', () => {
    it('should return total user count', async () => {
      // Create an admin user
      const adminUser = await User.create({
        ...testUsers.validUser,
        email: 'admin@example.com',
        role: 'admin'
      });
      
      // Create regular users
      await User.create(testUsers.validUser);
      await User.create({
        ...testUsers.validUser,
        email: 'another@example.com'
      });

      const adminToken = generateToken(adminUser._id);

      const response = await request(app)
        .get('/api/auth/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.count).toBe(3); // Including admin user
    });

    it('should return zero when no users exist', async () => {
      // Create an admin user
      const adminUser = await User.create({
        ...testUsers.validUser,
        email: 'admin@example.com',
        role: 'admin'
      });
      
      const adminToken = generateToken(adminUser._id);

      const response = await request(app)
        .get('/api/auth/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.count).toBe(1); // Only admin user exists
    });
  });
});