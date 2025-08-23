import { protect, admin } from '../../../src/middleware/authMiddleware.js';
import User from '../../../src/models/userModel.js';
import jwt from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext, clearAllMocks } from '../../utils/mockHelpers.js';

// Mock dependencies
jest.mock('../../../src/models/userModel.js');
jest.mock('jsonwebtoken');

describe('Auth Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should authenticate valid token and attach user to request', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        role: 'user'
      };

      req.headers.authorization = 'Bearer validtoken123';
      jwt.verify.mockReturnValue({ id: mockUser._id });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken123', process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should reject request with no token', async () => {
      req.headers.authorization = undefined;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', async () => {
      req.headers.authorization = 'InvalidFormat token123';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalidtoken123';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when user not found', async () => {
      req.headers.authorization = 'Bearer validtoken123';
      jwt.verify.mockReturnValue({ id: 'userId123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeNull();
    });

    it('should handle jwt.verify errors', async () => {
      req.headers.authorization = 'Bearer errortoken123';
      jwt.verify.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('admin middleware', () => {
    it('should allow admin users to proceed', () => {
      req.user = {
        _id: 'adminId123',
        email: 'admin@example.com',
        role: 'admin'
      };

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should reject non-admin users', () => {
      req.user = {
        _id: 'userId123',
        email: 'user@example.com',
        role: 'user'
      };

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized as an admin'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject when no user is attached to request', () => {
      req.user = null;

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized as an admin'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject when user has no role', () => {
      req.user = {
        _id: 'userId123',
        email: 'user@example.com'
      };

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized as an admin'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});