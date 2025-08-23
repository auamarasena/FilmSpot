export const mockBroadcastMessage = jest.fn();

// Mock the websocket module
jest.mock('../../src/websocket.js', () => ({
  broadcastMessage: jest.fn(),
  initWebSocket: jest.fn()
}), { virtual: true });

//Nodemailer
export const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: mockSendMail
  })
}));

// Helper to create mock Express request object
export const mockRequest = (data = {}) => ({
  body: data.body || {},
  params: data.params || {},
  query: data.query || {},
  headers: data.headers || {},
  user: data.user || null,
  ...data
});

// Helper to create mock Express response object
export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

// Helper to create mock Express next function
export const mockNext = jest.fn();

// Helper to generate JWT token for testing
export const generateTestToken = (userId = 'testUserId', role = 'user') => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
};

// Helper to create authorization header
export const authHeader = (token) => ({
  authorization: `Bearer ${token}`
});

// Clear all mocks
export const clearAllMocks = () => {
  mockBroadcastMessage.mockClear();
  mockSendMail.mockClear();
  mockNext.mockClear();
};