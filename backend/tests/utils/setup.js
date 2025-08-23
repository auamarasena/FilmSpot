import dotenv from 'dotenv';

// Set NODE_ENV to test if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless explicitly needed
if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TESTS) {
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}