# FilmSpot Backend Test Suite

This directory contains the comprehensive test suite for the FilmSpot backend application.

## Test Structure

```
tests/
├── unit/                    # Unit tests for isolated components
│   ├── controllers/         # Controller unit tests
│   ├── models/             # Model unit tests
│   └── middleware/         # Middleware unit tests
├── integration/            # Integration tests for API endpoints
├── fixtures/              # Test data and fixtures
└── utils/                 # Test utilities and helpers
```

## Running Tests

### Prerequisites
- Ensure all dependencies are installed: `npm install`
- MongoDB must be available (tests use in-memory MongoDB)

### Test Commands

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Coverage

The test suite aims for comprehensive coverage:
- Unit tests for all controllers, models, and middleware
- Integration tests for all API endpoints
- Authentication and authorization testing
- Error handling and edge cases
- WebSocket event mocking

## Writing New Tests

### Unit Tests
Unit tests should:
- Mock all external dependencies
- Test single units in isolation
- Cover all code paths and edge cases
- Use descriptive test names

Example:
```javascript
describe('Controller Name', () => {
  it('should perform expected action', async () => {
    // Arrange
    const mockData = { /* ... */ };
    
    // Act
    await controllerFunction(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
```

### Integration Tests
Integration tests should:
- Use the actual Express app
- Test complete request/response cycles
- Include authentication where required
- Verify database operations

Example:
```javascript
describe('API Endpoint', () => {
  it('should handle request correctly', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .expect(200);
      
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

## Test Environment

- Tests run with `NODE_ENV=test`
- Uses `.env.test` for test-specific configuration
- In-memory MongoDB for fast, isolated tests
- WebSocket broadcasts are mocked
- Email services are mocked

## Debugging Tests

To debug failing tests:
1. Run specific test file: `npm test -- path/to/test.js`
2. Add `console.log` statements (set `DEBUG_TESTS=true`)
3. Use Jest's `--verbose` flag for detailed output
4. Check test logs for database connection issues

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clear database between tests
3. **Mocking**: Mock external services consistently
4. **Assertions**: Use specific, meaningful assertions
5. **Performance**: Keep tests fast and focused

## Common Issues

### Tests Hanging
- Ensure all database connections are closed
- Check for unresolved promises
- Use `--detectOpenHandles` flag

### Database Errors
- Verify MongoDB Memory Server is installed
- Check for port conflicts
- Ensure proper cleanup in afterEach/afterAll

### Authentication Failures
- Verify JWT_SECRET is set in .env.test
- Check token generation in test setup
- Ensure user fixtures match expected format