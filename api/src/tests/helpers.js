const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

/**
 * Generate a valid JWT token for testing
 * @param {Object} user - User object with _id and roles
 * @returns {string} JWT token
 */
function generateTestToken(user) {
  return jwt.sign(
    { 
      _id: user._id,
      email: user.email,
      roles: user.roles 
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * Create a mock user for testing
 * @param {Object} overrides - User data overrides
 * @returns {Object} Mock user data
 */
function createMockUser(overrides = {}) {
  return {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    roles: ['RESIDENT'],
    ...overrides
  };
}

/**
 * Create a mock sensor for testing
 * @param {Object} overrides - Sensor data overrides
 * @returns {Object} Mock sensor data
 */
function createMockSensor(overrides = {}) {
  return {
    id: 'sensor123',
    serialNumber: 'SN123456',
    type: 'FILL_LEVEL',
    manufacturer: 'EcoTech',
    model: 'ET-100',
    purchasePrice: 150.00,
    status: 'INACTIVE',
    owner: 'user123',
    ...overrides
  };
}

/**
 * Create a mock bin for testing
 * @param {Object} overrides - Bin data overrides
 * @returns {Object} Mock bin data
 */
function createMockBin(overrides = {}) {
  return {
    id: 'bin123',
    binNumber: 'BN001',
    capacity: 120,
    category: 'GENERAL',
    material: 'plastic',
    color: 'blue',
    owner: 'user123',
    location: {
      type: 'Point',
      coordinates: [-74.0059, 40.7128],
      address: '123 Main St, New York, NY',
    },
    ...overrides
  };
}

/**
 * Create a mock collection request for testing
 * @param {Object} overrides - Collection request data overrides
 * @returns {Object} Mock collection request data
 */
function createMockCollectionRequest(overrides = {}) {
  return {
    id: 'cr123',
    requestNumber: 'CR123456',
    type: 'NORMAL',
    priority: 'MEDIUM',
    status: 'PENDING',
    requester: 'user123',
    location: {
      type: 'Point',
      coordinates: [-74.0059, 40.7128],
      address: '123 Main St, New York, NY',
    },
    wasteDetails: {
      category: 'GENERAL',
      description: 'Regular household waste',
      estimatedWeight: 10,
    },
    ...overrides
  };
}

module.exports = {
  generateTestToken,
  createMockUser,
  createMockSensor,
  createMockBin,
  createMockCollectionRequest
};
