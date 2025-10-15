const request = require('supertest');
const app = require('./app');
const Bin = require('../models/bin');
const Sensor = require('../models/sensor');
const User = require('../models/user');
const { generateTestToken, createMockUser, createMockBin, createMockSensor } = require('./helpers');

// Mock data
const mockUser = createMockUser();
const mockCollectionTeamUser = createMockUser({
  id: 'team123',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  roles: ['COLLECTION_TEAM'],
});
const mockBin = createMockBin();
const mockSensor = createMockSensor();

describe('Bin Controller', () => {
  describe('POST /api/v1/bins', () => {
    it('should create a new bin successfully', async () => {
      const user = await User.create(mockUser);
      
      const binData = {
        binNumber: 'BN001',
        capacity: 120,
        category: 'GENERAL',
        material: 'plastic',
        color: 'blue',
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        owner: user._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/bins')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(binData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.binNumber).toBe(binData.binNumber);
      expect(response.body.data.capacity).toBe(binData.capacity);
      expect(response.body.data.owner).toBe(user._id.toString());
    });

    it('should fail to create bin with duplicate bin number', async () => {
      const user = await User.create(mockUser);
      
      // Create first bin
      await Bin.create({
        ...mockBin,
        owner: user._id,
      });

      const binData = {
        binNumber: 'BN001', // Same bin number
        capacity: 120,
        material: 'plastic',
        color: 'blue',
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        owner: user._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/bins')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(binData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail to create bin without required fields', async () => {
      const user = await User.create(mockUser);
      
      const binData = {
        // Missing required fields
        category: 'GENERAL',
      };

      const response = await request(app)
        .post('/api/v1/bins')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(binData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/bins/my-bins', () => {
    it('should get user bins successfully', async () => {
      const user = await User.create(mockUser);
      
      // Create bins for the user
      await Bin.create([
        { ...mockBin, owner: user._id, binNumber: 'BN001' },
        { ...mockBin, owner: user._id, binNumber: 'BN002' },
      ]);

      const response = await request(app)
        .get('/api/v1/bins/my-bins')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(2);
    });

    it('should filter bins by category', async () => {
      const user = await User.create(mockUser);
      
      // Create bins with different categories
      await Bin.create([
        { ...mockBin, owner: user._id, binNumber: 'BN001', category: 'GENERAL' },
        { ...mockBin, owner: user._id, binNumber: 'BN002', category: 'RECYCLABLE' },
      ]);

      const response = await request(app)
        .get('/api/v1/bins/my-bins?category=GENERAL')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].category).toBe('GENERAL');
    });
  });

  describe('PUT /api/v1/bins/:id', () => {
    it('should update bin successfully', async () => {
      const user = await User.create(mockUser);
      const bin = await Bin.create({
        ...mockBin,
        owner: user._id,
      });

      const updateData = {
        capacity: 150,
        color: 'green',
      };

      const response = await request(app)
        .put(`/api/v1/bins/${bin.id}`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.capacity).toBe(updateData.capacity);
      expect(response.body.data.color).toBe(updateData.color);
    });

    it('should fail to update bin without permission', async () => {
      const user1 = await User.create(mockUser);
      const user2 = await User.create({
        ...mockUser,
        email: 'user2@example.com',
      });
      
      const bin = await Bin.create({
        ...mockBin,
        owner: user1._id,
      });

      const updateData = {
        capacity: 150,
      };

      const response = await request(app)
        .put(`/api/v1/bins/${bin.id}`)
        .set('Authorization', `Bearer ${generateMockToken(user2)}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/bins/:id/attach-sensor', () => {
    it('should attach sensor to bin successfully', async () => {
      const user = await User.create(mockUser);
      const bin = await Bin.create({
        ...mockBin,
        owner: user._id,
      });
      const sensor = await Sensor.create({
        ...mockSensor,
        owner: user._id,
      });

      const attachData = {
        sensorId: sensor.id,
      };

      const response = await request(app)
        .post(`/api/v1/bins/${bin.id}/attach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(attachData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sensor).toBe(sensor._id.toString());
    });

    it('should fail to attach sensor already attached to another bin', async () => {
      const user = await User.create(mockUser);
      const bin1 = await Bin.create({
        ...mockBin,
        owner: user._id,
        binNumber: 'BN001',
      });
      const bin2 = await Bin.create({
        ...mockBin,
        owner: user._id,
        binNumber: 'BN002',
      });
      const sensor = await Sensor.create({
        ...mockSensor,
        owner: user._id,
        bin: bin1._id,
      });

      const attachData = {
        sensorId: sensor.id,
      };

      const response = await request(app)
        .post(`/api/v1/bins/${bin2.id}/attach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(attachData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/bins/:id/detach-sensor', () => {
    it('should detach sensor from bin successfully', async () => {
      const user = await User.create(mockUser);
      const sensor = await Sensor.create({
        ...mockSensor,
        owner: user._id,
      });
      const bin = await Bin.create({
        ...mockBin,
        owner: user._id,
        sensor: sensor._id,
      });

      const response = await request(app)
        .post(`/api/v1/bins/${bin.id}/detach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sensor).toBeUndefined();
    });

    it('should fail to detach sensor when no sensor is attached', async () => {
      const user = await User.create(mockUser);
      const bin = await Bin.create({
        ...mockBin,
        owner: user._id,
      });

      const response = await request(app)
        .post(`/api/v1/bins/${bin.id}/detach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // describe('PUT /api/v1/bins/:id/fill-level', () => {
  //   it('should update bin fill level successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //     });

  //     const updateData = {
  //       fillLevel: 75,
  //       weight: 90,
  //     };

  //     const response = await request(app)
  //       .put(`/api/v1/bins/${bin.id}/fill-level`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(updateData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.currentFillLevel).toBe(updateData.fillLevel);
  //     expect(response.body.data.currentWeight).toBe(updateData.weight);
  //   });

  //   it('should fail to update fill level with invalid values', async () => {
  //     const user = await User.create(mockUser);
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //     });

  //     const updateData = {
  //       fillLevel: 150, // Invalid: > 100
  //       weight: -10, // Invalid: negative
  //     };

  //     const response = await request(app)
  //       .put(`/api/v1/bins/${bin.id}/fill-level`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(updateData)
  //       .expect(400);

  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe('POST /api/v1/bins/:id/collection-record', () => {
  //   it('should add collection record to bin successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //       currentFillLevel: 80,
  //       currentWeight: 96,
  //     });

  //     const collectionData = {
  //       weight: 96,
  //       fillLevel: 80,
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/bins/${bin.id}/collection-record`)
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .send(collectionData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.currentFillLevel).toBe(0);
  //     expect(response.body.data.currentWeight).toBe(0);
  //     expect(response.body.data.collectionHistory).toHaveLength(1);
  //   });
  // });

  // describe('DELETE /api/v1/bins/:id', () => {
  //   it('should delete bin successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //     });

  //     const response = await request(app)
  //       .delete(`/api/v1/bins/${bin.id}`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);

  //     // Verify bin is soft deleted
  //     const deletedBin = await Bin.findOne({ id: bin.id });
  //     expect(deletedBin.isDeleted).toBe(true);
  //     expect(deletedBin.isActive).toBe(false);
  //   });
  // });

  // describe('GET /api/v1/bins/full', () => {
  //   it('should get full bins for collection team', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
      
  //     // Create bins with different fill levels
  //     await Bin.create([
  //       { ...mockBin, owner: user._id, binNumber: 'BN001', currentFillLevel: 90 },
  //       { ...mockBin, owner: user._id, binNumber: 'BN002', currentFillLevel: 50 },
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/bins/full')
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.docs).toHaveLength(1);
  //     expect(response.body.data.docs[0].currentFillLevel).toBe(90);
  //   });
  // });

  // describe('GET /api/v1/bins/category/:category', () => {
  //   it('should get bins by category', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
      
  //     // Create bins with different categories
  //     await Bin.create([
  //       { ...mockBin, owner: user._id, binNumber: 'BN001', category: 'GENERAL' },
  //       { ...mockBin, owner: user._id, binNumber: 'BN002', category: 'RECYCLABLE' },
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/bins/category/GENERAL')
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.docs).toHaveLength(1);
  //     expect(response.body.data.docs[0].category).toBe('GENERAL');
  //   });
  // });

  // describe('GET /api/v1/bins/near', () => {
  //   it('should get bins near location', async () => {
  //     const user = await User.create(mockUser);
  //     const teamUser = await User.create(mockCollectionTeamUser);
      
  //     // Create bins at different locations
  //     await Bin.create([
  //       { 
  //         ...mockBin, 
  //         owner: user._id, 
  //         binNumber: 'BN001',
  //         location: {
  //           type: 'Point',
  //           coordinates: [-74.0059, 40.7128], // New York
  //           address: '123 Main St, New York, NY',
  //         }
  //       },
  //       { 
  //         ...mockBin, 
  //         owner: user._id, 
  //         binNumber: 'BN002',
  //         location: {
  //           type: 'Point',
  //           coordinates: [-118.2437, 34.0522], // Los Angeles
  //           address: '456 Oak St, Los Angeles, CA',
  //         }
  //       },
  //     ]);

  //     const response = await request(app)
  //       .get('/api/v1/bins/near?longitude=-74.0059&latitude=40.7128&radius=1000')
  //       .set('Authorization', `Bearer ${generateMockToken(teamUser)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.docs).toHaveLength(1);
  //     expect(response.body.data.docs[0].binNumber).toBe('BN001');
  //   });
  // });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
  return generateTestToken(user);
}
