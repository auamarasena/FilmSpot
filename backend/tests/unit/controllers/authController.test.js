jest.mock('../../../src/websocket.js', () => ({
  broadcastMessage: jest.fn(),
  initWebSocket: jest.fn()
}));

import { registerUser, loginUser, getUserProfile, updateUserProfile, getTotalUserCount } from '../../../src/controllers/authController.js';
import User from '../../../src/models/userModel.js';
import jwt from 'jsonwebtoken';
import { mockRequest, mockResponse, clearAllMocks } from '../../utils/mockHelpers.js';
import { testUsers } from '../../fixtures/testData.js';
import { broadcastMessage } from '../../../src/websocket.js';

// Mock dependencies
jest.mock('../../../src/models/userModel.js');
jest.mock('jsonwebtoken');

describe('Auth Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      req.body = testUsers.validUser;
      const mockUser = {
        _id: 'userId123',
        ...testUsers.validUser,
        role: 'user',
        save: jest.fn()
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken123');

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: testUsers.validUser.email });
      expect(User.create).toHaveBeenCalledWith(testUsers.validUser);
      expect(broadcastMessage).toHaveBeenCalledWith({ type: 'USER_COUNT_UPDATE' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        firstName: mockUser.firstName,
        email: mockUser.email,
        token: 'mockToken123',
        role: mockUser.role
      });
    });

    it('should return error if user already exists', async () => {
      req.body = testUsers.validUser;
      User.findOne.mockResolvedValue({ email: testUsers.validUser.email });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User with that email already exists'
      });
      expect(User.create).not.toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      req.body = testUsers.validUser;
      User.findOne.mockRejectedValue(new Error('Database error'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server Error',
        error: 'Database error'
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      req.body = {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      };

      const mockUser = {
        _id: 'userId123',
        ...testUsers.validUser,
        role: 'user',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken123');

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(mockUser.matchPassword).toHaveBeenCalledWith(req.body.password);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        mobile: mockUser.mobile,
        token: 'mockToken123',
        role: mockUser.role
      });
    });

    it('should return error for invalid credentials', async () => {
      req.body = {
        email: testUsers.validUser.email,
        password: 'wrongpassword'
      };

      const mockUser = {
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password'
      });
    });

    it('should return error for non-existent user', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password'
      };

      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password'
      });
    });

    it('should handle server errors', async () => {
      req.body = {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      };

      User.findOne.mockRejectedValue(new Error('Database error'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server Error',
        error: 'Database error'
      });
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        _id: 'userId123',
        ...testUsers.validUser,
        role: 'user'
      };

      req.user = { _id: mockUser._id };
      User.findById.mockResolvedValue(mockUser);

      await getUserProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.user._id);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        mobile: mockUser.mobile,
        role: mockUser.role
      });
    });

    it('should return 404 if user not found', async () => {
      req.user = { _id: 'nonexistentId' };
      User.findById.mockResolvedValue(null);

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUser = {
        _id: 'userId123',
        firstName: 'Old',
        lastName: 'Name',
        mobile: '0000000000',
        email: 'test@example.com',
        role: 'user',
        save: jest.fn()
      };

      const updateData = {
        firstName: 'New',
        lastName: 'Name',
        mobile: '1111111111'
      };

      req.user = { _id: mockUser._id };
      req.body = updateData;

      const updatedUser = {
        ...mockUser,
        ...updateData
      };

      User.findById.mockResolvedValue(mockUser);
      mockUser.save.mockResolvedValue(updatedUser);
      jwt.sign.mockReturnValue('newMockToken123');

      await updateUserProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.user._id);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        token: 'newMockToken123'
      });
    });

    it('should return 404 if user not found', async () => {
      req.user = { _id: 'nonexistentId' };
      req.body = { firstName: 'New' };
      User.findById.mockResolvedValue(null);

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });
  });

  describe('getTotalUserCount', () => {
    it('should return total user count', async () => {
      User.countDocuments.mockResolvedValue(42);

      await getTotalUserCount(req, res);

      expect(User.countDocuments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ count: 42 });
    });

    it('should handle server errors', async () => {
      User.countDocuments.mockRejectedValue(new Error('Database error'));

      await getTotalUserCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});