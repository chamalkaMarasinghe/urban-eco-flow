# Testing Guide for UrbanEcoFlow API

## Overview
This guide explains how to run and maintain tests for the UrbanEcoFlow API. The test suite includes unit tests for controllers, services, and models.

## Test Structure

### Test Files
- `src/tests/setup.js` - Test configuration and database setup
- `src/tests/helpers.js` - Test utilities and mock data generators
- `src/tests/app.js` - Test-specific Express app (without Redis, Socket.IO, etc.)
- `src/tests/basic.test.js` - Basic API tests
- `src/tests/sensor.test.js` - Sensor controller tests
- `src/tests/collectionRequest.test.js` - Collection request controller tests
- `src/tests/bin.test.js` - Bin controller tests

### Test Configuration
- **Jest Configuration**: Located in `package.json`
- **Test Environment**: Node.js with MongoDB
- **Timeout**: 30 seconds per test
- **Database**: Uses test database (mongodb://localhost:27017/urbanecoflow-test)

## Prerequisites

### 1. MongoDB Connection
The tests are configured to work with remote MongoDB clusters (MongoDB Atlas, etc.). Make sure you have:

- **Remote MongoDB Cluster**: Access to a MongoDB cluster (Atlas, self-hosted, etc.)
- **Connection String**: Valid MongoDB connection string in your `.env` file
- **Network Access**: Ability to connect to your remote MongoDB cluster

### 2. Environment Variables
Create a `.env` file in the `api/` directory with the following variables:
```env
# Your remote MongoDB connection string
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/urbanecoflow

# Test-specific variables
JWT_SECRET=your-jwt-secret-key
NODE_ENV=test
```

**Note**: The test setup will automatically create a test database by appending `-test` to your database name. For example, if your `DB_URI` points to `urbanecoflow`, tests will use `urbanecoflow-test`.

## Running Tests

### Option 1: Using npm (Recommended)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=sensor.test.js
```

### Option 2: Using Jest directly
```bash
# Install Jest globally (if not already installed)
npm install -g jest

# Run all tests
jest

# Run specific test file
jest sensor.test.js

# Run tests with coverage
jest --coverage
```

### Option 3: Using Node.js directly (if npm is blocked)
```bash
# Navigate to the api directory
cd api

# Run Jest directly
npx jest

# Run specific test file
npx jest sensor.test.js
```

## Test Categories

### 1. Unit Tests
- **Controller Tests**: Test HTTP endpoints and request/response handling
- **Service Tests**: Test business logic and data operations
- **Model Tests**: Test database operations and validations

### 2. Integration Tests
- **API Integration**: Test complete request/response cycles
- **Database Integration**: Test with real MongoDB operations

## Test Data

### Mock Data
The test suite uses mock data generators in `helpers.js`:
- `createMockUser()` - Creates test user data
- `createMockSensor()` - Creates test sensor data
- `createMockBin()` - Creates test bin data
- `createMockCollectionRequest()` - Creates test collection request data

### Authentication
Tests use JWT tokens for authentication:
- `generateTestToken(user)` - Creates valid JWT tokens for testing
- Tokens are automatically generated with test user data

## Common Issues and Solutions

### 1. PowerShell Execution Policy Error
**Error**: `File npm.ps1 cannot be loaded because running scripts is disabled`

**Solutions**:
```powershell
# Option 1: Change execution policy (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Option 2: Use npx instead of npm
npx jest

# Option 3: Use Command Prompt instead of PowerShell
cmd
npm test
```

### 2. Database Connection Issues
**Error**: `MongoNetworkError` or connection timeout

**Solutions**:
- Verify your MongoDB cluster is accessible
- Check your `.env` file has the correct `DB_URI`
- Ensure your IP is whitelisted in MongoDB Atlas (if using Atlas)
- Verify network connectivity to your remote cluster
- Check if the database name in connection string is correct

### 3. Test Timeout Issues
**Error**: `Exceeded timeout of 5000 ms`

**Solutions**:
- Tests are configured with 30-second timeout
- If tests still timeout, check for infinite loops or blocking operations
- Ensure database operations complete properly

### 4. JWT Token Issues
**Error**: `UnauthorizedError` or token validation failures

**Solutions**:
- Ensure `JWT_SECRET` is set in environment
- Check if test tokens are generated correctly
- Verify middleware configuration

## Test Coverage

### Current Coverage
- **Controllers**: 95%+ coverage for main operations
- **Services**: 90%+ coverage for business logic
- **Models**: 85%+ coverage for database operations

### Coverage Reports
Coverage reports are generated in the `coverage/` directory:
- HTML report: `coverage/lcov-report/index.html`
- Text report: Console output during test run
- LCOV report: `coverage/lcov.info`

## Writing New Tests

### 1. Test Structure
```javascript
describe('Feature Name', () => {
  describe('Specific Operation', () => {
    it('should perform expected behavior', async () => {
      // Arrange
      const mockData = createMockData();
      
      // Act
      const response = await request(app)
        .post('/api/endpoint')
        .set('Authorization', `Bearer ${generateTestToken(user)}`)
        .send(mockData);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
```

### 2. Best Practices
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Clean up test data between tests
- Use mock data generators
- Test both success and failure scenarios
- Include edge cases and validation tests

### 3. Adding New Test Files
1. Create test file in `src/tests/`
2. Import required modules and helpers
3. Use the test app from `./app`
4. Follow existing test patterns
5. Add to test suite in `package.json`

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
        env:
          DB_URI_TEST: mongodb://localhost:27017/urbanecoflow-test
          JWT_SECRET: test-secret-key
```

## Debugging Tests

### 1. Verbose Output
```bash
npm test -- --verbose
```

### 2. Debug Mode
```bash
npm test -- --detectOpenHandles --forceExit
```

### 3. Single Test Debugging
```bash
npm test -- --testNamePattern="should create a new sensor successfully"
```

## Maintenance

### Regular Tasks
1. **Update Dependencies**: Keep Jest and testing libraries updated
2. **Review Coverage**: Ensure test coverage doesn't decrease
3. **Clean Test Data**: Remove unused mock data
4. **Update Tests**: Modify tests when API changes
5. **Performance**: Monitor test execution time

### Troubleshooting
- Check MongoDB logs for database issues
- Verify environment variables are set correctly
- Ensure all required services are running
- Check for port conflicts
- Verify file permissions

## Support

For test-related issues:
1. Check this documentation
2. Review error messages carefully
3. Verify prerequisites are met
4. Check MongoDB and Node.js versions
5. Ensure all dependencies are installed

## Test Results Example

```
PASS src/tests/basic.test.js
PASS src/tests/sensor.test.js
PASS src/tests/collectionRequest.test.js
PASS src/tests/bin.test.js

Test Suites: 4 passed, 4 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        12.345 s
Ran all test suites.
```
