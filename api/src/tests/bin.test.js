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
        capacity: "120",
        category: 'general',
        material: 'plastic',
        color: 'blue',
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
          location: {
            longitude: "5",
            latitude: "5"
          }
        },
        owner: user._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/bins')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(binData)
        .expect(201);
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
        capacity: "150",
        color: 'green',
      };

      const response = await request(app)
        .put(`/api/v1/bins/${bin._id}`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(updateData)
        .expect(200);
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
        sensorId: sensor._id,
      };

      const response = await request(app)
        .post(`/api/v1/bins/${bin._id}/attach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(attachData)
        .expect(200);
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
        .post(`/api/v1/bins/${bin._id}/detach-sensor`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);
    });
  });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
  return generateTestToken(user);
}