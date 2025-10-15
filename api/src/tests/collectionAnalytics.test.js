const request = require('supertest');
const app = require('./app');
const CollectionRequest = require('../models/collectionRequest');
const Bin = require('../models/bin');
const User = require('../models/user');
const { generateTestToken, createMockUser, createMockBin } = require('./helpers');

// Mock data
const mockUser = createMockUser();
const mockBin = createMockBin();

describe('Collection Analytics API', () => {
  // describe('GET /api/v1/collection-requests/analytics', () => {
  //   it('should get user collection analytics successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //       capacity: 120
  //     });

  //     // Create collection requests for different dates
  //     const today = new Date();
  //     const yesterday = new Date(today);
  //     yesterday.setDate(yesterday.getDate() - 1);
      
  //     await CollectionRequest.create([
  //       {
  //         requestNumber: 'CR001',
  //         type: 'NORMAL',
  //         status: 'COMPLETED',
  //         requester: user._id,
  //         bin: bin._id,
  //         location: {
  //           type: 'Point',
  //           coordinates: [-74.0059, 40.7128],
  //           address: '123 Main St, New York, NY'
  //         },
  //         wasteDetails: {
  //           category: 'GENERAL',
  //           description: 'Household waste'
  //         },
  //         createdAt: today
  //       },
  //       {
  //         requestNumber: 'CR002',
  //         type: 'NORMAL',
  //         status: 'COMPLETED',
  //         requester: user._id,
  //         bin: bin._id,
  //         location: {
  //           type: 'Point',
  //           coordinates: [-74.0059, 40.7128],
  //           address: '123 Main St, New York, NY'
  //         },
  //         wasteDetails: {
  //           category: 'GENERAL',
  //           description: 'Household waste'
  //         },
  //         createdAt: yesterday
  //       }
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/collection-requests/analytics')
  //       .set('Authorization', `Bearer ${generateTestToken(user)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.message).toBe('Collection analytics retrieved successfully');
  //     expect(Array.isArray(response.body.data)).toBe(true);
      
  //     // Should always return exactly 7 days of data
  //     expect(response.body.data).toHaveLength(7);
      
  //     // Check that each data point has the required properties
  //     response.body.data.forEach((item, index) => {
  //       expect(item).toHaveProperty('date');
  //       expect(item).toHaveProperty('value');
  //       expect(typeof item.value).toBe('number');
  //       expect(item.value).toBeGreaterThanOrEqual(0);
  //     });
  //   });
  //   //   const user = await User.create(mockUser);

  //   //   const response = await request(app)
  //   //     .get('/api/v1/collection-requests/analytics')
  //   //     .set('Authorization', `Bearer ${generateTestToken(user)}`)
  //   //     .expect(200);

  //   //   expect(response.body.success).toBe(true);
  //   //   expect(response.body.data).toHaveLength(7);
      
  //   //   // All values should be 0 when no collection requests exist
  //   //   response.body.data.forEach((item) => {
  //   //     expect(item.value).toBe(0);
  //   //     expect(item).toHaveProperty('date');
  //   //   });
  //   // });

  //   it('should require authentication', async () => {
  //     const response = await request(app)
  //       .get('/api/v1/collection-requests/analytics')
  //       .expect(401);

  //     expect(response.body.success).toBe(false);
  //   });
  // });
});
