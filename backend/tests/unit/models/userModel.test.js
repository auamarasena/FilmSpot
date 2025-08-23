import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../../src/models/userModel.js';
import { connect, closeDatabase, clearDatabase } from '../../utils/testDb.js';
import { testUsers } from '../../fixtures/testData.js';

describe('User Model Unit Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('User validation', () => {
    it('should create a valid user successfully', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(testUsers.validUser.firstName);
      expect(savedUser.lastName).toBe(testUsers.validUser.lastName);
      expect(savedUser.email).toBe(testUsers.validUser.email);
      expect(savedUser.mobile).toBe(testUsers.validUser.mobile);
      expect(savedUser.role).toBe('user');
      expect(savedUser.password).not.toBe(testUsers.validUser.password); // Should be hashed
    });

    it('should require firstName', async () => {
      const user = new User({
        ...testUsers.validUser,
        firstName: undefined
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require lastName', async () => {
      const user = new User({
        ...testUsers.validUser,
        lastName: undefined
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require email', async () => {
      const user = new User({
        ...testUsers.validUser,
        email: undefined
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require unique email', async () => {
      const user1 = new User(testUsers.validUser);
      await user1.save();

      const user2 = new User(testUsers.validUser);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should require password', async () => {
      const user = new User({
        ...testUsers.validUser,
        password: undefined
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require mobile', async () => {
      const user = new User({
        ...testUsers.validUser,
        mobile: undefined
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should set default role to "user"', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      expect(savedUser.role).toBe('user');
    });

    it('should accept admin role', async () => {
      const user = new User(testUsers.adminUser);
      const savedUser = await user.save();

      expect(savedUser.role).toBe('admin');
    });

    it('should reject invalid role', async () => {
      const user = new User({
        ...testUsers.validUser,
        role: 'superuser'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should add timestamps', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });
  });

  describe('Password hashing', () => {
    it('should hash password before saving', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(testUsers.validUser.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });

    it('should not hash password if not modified', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();
      const originalHash = savedUser.password;

      savedUser.firstName = 'UpdatedName';
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).toBe(originalHash);
    });

    it('should hash new password on update', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();
      const originalHash = savedUser.password;

      savedUser.password = 'NewPassword123!';
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).not.toBe(originalHash);
      expect(updatedUser.password).not.toBe('NewPassword123!');
    });
  });

  describe('matchPassword method', () => {
    it('should return true for correct password', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      const isMatch = await savedUser.matchPassword(testUsers.validUser.password);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      const isMatch = await savedUser.matchPassword('WrongPassword123!');
      expect(isMatch).toBe(false);
    });

    it('should return false for empty password', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      const isMatch = await savedUser.matchPassword('');
      expect(isMatch).toBe(false);
    });

    it('should handle bcrypt errors gracefully', async () => {
      const user = new User(testUsers.validUser);
      const savedUser = await user.save();

      // Corrupt the password hash
      savedUser.password = 'invalid-hash';

      // The matchPassword method returns false on error, doesn't throw
      const result = await savedUser.matchPassword(testUsers.validUser.password);
      expect(result).toBe(false);
    });
  });

  describe('User schema structure', () => {
    it('should have correct schema fields', () => {
      const schemaKeys = Object.keys(User.schema.paths);

      expect(schemaKeys).toContain('firstName');
      expect(schemaKeys).toContain('lastName');
      expect(schemaKeys).toContain('email');
      expect(schemaKeys).toContain('password');
      expect(schemaKeys).toContain('mobile');
      expect(schemaKeys).toContain('role');
      expect(schemaKeys).toContain('createdAt');
      expect(schemaKeys).toContain('updatedAt');
    });

    it('should have correct field types', () => {
      expect(User.schema.paths.firstName.instance).toBe('String');
      expect(User.schema.paths.lastName.instance).toBe('String');
      expect(User.schema.paths.email.instance).toBe('String');
      expect(User.schema.paths.password.instance).toBe('String');
      expect(User.schema.paths.mobile.instance).toBe('String');
      expect(User.schema.paths.role.instance).toBe('String');
    });
  });
});