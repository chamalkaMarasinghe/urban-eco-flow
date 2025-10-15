const request = require('supertest');
const app = require('./app');
const CollectionRequest = require('../models/collectionRequest');
const User = require('../models/user');
const Bin = require('../models/bin');
const { generateTestToken, createMockUser, createMockCollectionRequest, createMockBin } = require('./helpers');

// Mock data
const mockUser = createMockUser();
const mockCollectionTeamUser = createMockUser({
  id: 'team123',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  roles: ['COLLECTION_TEAM'],
});
const mockCollectionRequest = createMockCollectionRequest();
const mockBin = createMockBin();

describe('Collection Request Controller', () => {
  describe('POST /api/v1/collection-requests', () => {
    it('should create a new collection request successfully', async () => {
      const user = await User.create(mockUser);
      
      const requestData = {
        type: 'NORMAL',
        priority: 'MEDIUM',
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        wasteDetails: {
          category: 'GENERAL',
          description: 'Regular household waste',
          estimatedWeight: 10,
        },
      };

      const response = await request(app)
        .post('/api/v1/collection-requests')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(requestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe(requestData.type);
      expect(response.body.data.priority).toBe(requestData.priority);
      expect(response.body.data.requester).toBe(user._id.toString());
    });

    it('should create urgent collection request with payment details', async () => {
      const user = await User.create(mockUser);
      
      const requestData = {
        type: 'URGENT',
        priority: 'URGENT',
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        wasteDetails: {
          category: 'HAZARDOUS',
          description: 'Urgent hazardous waste collection',
          estimatedWeight: 5,
        },
      };

      const response = await request(app)
        .post('/api/v1/collection-requests')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(requestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentDetails.status).toBe('PENDING');
      expect(response.body.data.paymentDetails.amount).toBeGreaterThan(0);
    });

    it('should fail to create collection request without required fields', async () => {
      const user = await User.create(mockUser);
      
      const requestData = {
        type: 'NORMAL',
        // Missing location and wasteDetails
      };

      const response = await request(app)
        .post('/api/v1/collection-requests')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(requestData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/collection-requests/my-requests', () => {
    it('should get user collection requests successfully', async () => {
      const user = await User.create(mockUser);
      
      // Create collection requests for the user
      await CollectionRequest.create([
        { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR001' },
        { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR002' },
      ]);

      const response = await request(app)
        .get('/api/v1/collection-requests/my-requests')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(2);
    });

    it('should filter requests by status', async () => {
      const user = await User.create(mockUser);
      
      // Create requests with different statuses
      await CollectionRequest.create([
        { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR001', status: 'PENDING' },
        { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR002', status: 'COMPLETED' },
      ]);

      const response = await request(app)
        .get('/api/v1/collection-requests/my-requests?status=PENDING')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].status).toBe('PENDING');
    });
  });

  describe('PUT /api/v1/collection-requests/:id', () => {
    it('should update collection request successfully', async () => {
      const user = await User.create(mockUser);
      const request = await CollectionRequest.create({
        ...mockCollectionRequest,
        requester: user._id,
      });

      const updateData = {
        priority: 'HIGH',
        wasteDetails: {
          category: 'RECYCLABLE',
          description: 'Updated description',
        },
      };

      const response = await request(app)
        .put(`/api/v1/collection-requests/${request.id}`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.priority).toBe(updateData.priority);
    });
  });

  // describe('POST /api/v1/collection-requests/:id/schedule', () => {
  //   it('should schedule collection request successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
  //     const request = await CollectionRequest.create({
  //       ...mockCollectionRequest,
  //       requester: user._id,
  //     });

  //     const scheduleData = {
  //       scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  //       timeSlot: {
  //         start: '09:00',
  //         end: '11:00',
  //       },
  //       collectionTeamId: teamUser._id.toString(),
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/collection-requests/${request.id}/schedule`)
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .send(scheduleData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.status).toBe('SCHEDULED');
  //     expect(response.body.data.collectionTeam).toBe(teamUser._id.toString());
  //   });
  // });

  // describe('POST /api/v1/collection-requests/:id/complete', () => {
  //   it('should complete collection request successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
  //     const request = await CollectionRequest.create({
  //       ...mockCollectionRequest,
  //       requester: user._id,
  //       status: 'IN_PROGRESS',
  //     });

  //     const completionData = {
  //       actualWeight: 12,
  //       actualVolume: 0.5,
  //       notes: 'Collection completed successfully',
  //       images: ['https://example.com/image1.jpg'],
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/collection-requests/${request.id}/complete`)
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .send(completionData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.status).toBe('COMPLETED');
  //     expect(response.body.data.collectionDetails.actualWeight).toBe(completionData.actualWeight);
  //   });

  //   it('should fail to complete request not in progress', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
  //     const request = await CollectionRequest.create({
  //       ...mockCollectionRequest,
  //       requester: user._id,
  //       status: 'PENDING', // Not in progress
  //     });

  //     const completionData = {
  //       actualWeight: 12,
  //       notes: 'Collection completed successfully',
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/collection-requests/${request.id}/complete`)
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .send(completionData)
  //       .expect(400);

  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe('POST /api/v1/collection-requests/:id/cancel', () => {
  //   it('should cancel collection request successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const request = await CollectionRequest.create({
  //       ...mockCollectionRequest,
  //       requester: user._id,
  //     });

  //     const cancelData = {
  //       reason: 'No longer needed',
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/collection-requests/${request.id}/cancel`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(cancelData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.status).toBe('CANCELLED');
  //   });

  //   it('should fail to cancel completed request', async () => {
  //     const user = await User.create(mockUser);
  //     const request = await CollectionRequest.create({
  //       ...mockCollectionRequest,
  //       requester: user._id,
  //       status: 'COMPLETED',
  //     });

  //     const cancelData = {
  //       reason: 'No longer needed',
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/collection-requests/${request.id}/cancel`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(cancelData)
  //       .expect(400);

  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe('GET /api/v1/collection-requests/pending', () => {
  //   it('should get pending requests for collection team', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
      
  //     // Create pending requests
  //     await CollectionRequest.create([
  //       { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR001', status: 'PENDING' },
  //       { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR002', status: 'PENDING' },
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/collection-requests/pending')
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.docs).toHaveLength(2);
  //     expect(response.body.data.docs.every(req => req.status === 'PENDING')).toBe(true);
  //   });
  // });

  // describe('GET /api/v1/collection-requests/urgent', () => {
  //   it('should get urgent requests for collection team', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
      
  //     // Create urgent requests
  //     await CollectionRequest.create([
  //       { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR001', priority: 'URGENT', status: 'PENDING' },
  //       { ...mockCollectionRequest, requester: user._id, requestNumber: 'CR002', priority: 'MEDIUM', status: 'PENDING' },
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/collection-requests/urgent')
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.docs).toHaveLength(1);
  //     expect(response.body.data.docs[0].priority).toBe('URGENT');
  //   });
  // });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
  return generateTestToken(user);
}
