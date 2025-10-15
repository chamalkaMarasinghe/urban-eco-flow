const request = require('supertest');
const app = require('./app');
const Sensor = require('../models/sensor');
const User = require('../models/user');
const Bin = require('../models/bin');
const { generateTestToken, createMockUser, createMockSensor, createMockBin } = require('./helpers');

// Mock data
const mockUser = createMockUser();
const mockSensor = createMockSensor();
const mockBin = createMockBin();

describe('Sensor Controller', () => {
  describe('POST /api/v1/sensors', () => {
    it('should create a new sensor successfully', async () => {
      // Create a user first
      const user = await User.create(mockUser);
      
      const sensorData = {
        serialNumber: 'SN123456',
        type: 'FILL_LEVEL',
        manufacturer: 'EcoTech',
        model: 'ET-100',
        purchasePrice: 150.00,
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        owner: user._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/sensors')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(sensorData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.serialNumber).toBe(sensorData.serialNumber);
      expect(response.body.data.manufacturer).toBe(sensorData.manufacturer);
      expect(response.body.data.owner).toBe(user._id.toString());
    });

    it('should fail to create sensor with duplicate serial number', async () => {
      // Create a user first
      const user = await User.create(mockUser);
      
      // Create first sensor
      await Sensor.create({
        ...mockSensor,
        owner: user._id,
      });

      const sensorData = {
        serialNumber: 'SN123456', // Same serial number
        type: 'FILL_LEVEL',
        manufacturer: 'EcoTech',
        model: 'ET-100',
        purchasePrice: 150.00,
        location: {
          coordinates: [-74.0059, 40.7128],
          address: '123 Main St, New York, NY',
        },
        owner: user._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/sensors')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(sensorData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail to create sensor without required fields', async () => {
      const user = await User.create(mockUser);
      
      const sensorData = {
        // Missing required fields
        type: 'FILL_LEVEL',
      };

      const response = await request(app)
        .post('/api/v1/sensors')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(sensorData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/sensors/my-sensors', () => {
    it('should get user sensors successfully', async () => {
      const user = await User.create(mockUser);
      
      // Create sensors for the user
      await Sensor.create([
        { ...mockSensor, owner: user._id, serialNumber: 'SN001' },
        { ...mockSensor, owner: user._id, serialNumber: 'SN002' },
      ]);

      const response = await request(app)
        .get('/api/v1/sensors/my-sensors')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(2);
    });

    it('should filter sensors by status', async () => {
      const user = await User.create(mockUser);
      
      // Create sensors with different statuses
      await Sensor.create([
        { ...mockSensor, owner: user._id, serialNumber: 'SN001', status: 'ACTIVE' },
        { ...mockSensor, owner: user._id, serialNumber: 'SN002', status: 'INACTIVE' },
      ]);

      const response = await request(app)
        .get('/api/v1/sensors/my-sensors?status=ACTIVE')
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].status).toBe('ACTIVE');
    });
  });

  describe('PUT /api/v1/sensors/:id', () => {
    it('should update sensor successfully', async () => {
      const user = await User.create(mockUser);
      const sensor = await Sensor.create({
        ...mockSensor,
        owner: user._id,
      });

      const updateData = {
        manufacturer: 'UpdatedTech',
        model: 'UT-200',
      };

      const response = await request(app)
        .put(`/api/v1/sensors/${sensor.id}`)
        .set('Authorization', `Bearer ${generateMockToken(user)}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.manufacturer).toBe(updateData.manufacturer);
      expect(response.body.data.model).toBe(updateData.model);
    });

    it('should fail to update sensor without permission', async () => {
      const user1 = await User.create(mockUser);
      const user2 = await User.create({
        ...mockUser,
        email: 'user2@example.com',
      });
      
      const sensor = await Sensor.create({
        ...mockSensor,
        owner: user1._id,
      });

      const updateData = {
        manufacturer: 'UpdatedTech',
      };

      const response = await request(app)
        .put(`/api/v1/sensors/${sensor.id}`)
        .set('Authorization', `Bearer ${generateMockToken(user2)}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  // describe('POST /api/v1/sensors/:id/install', () => {
  //   it('should install sensor to bin successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const sensor = await Sensor.create({
  //       ...mockSensor,
  //       owner: user._id,
  //     });
  //     const bin = await Bin.create({
  //       ...mockBin,
  //       owner: user._id,
  //     });

  //     const installData = {
  //       binId: bin.id,
  //       installationDate: new Date().toISOString(),
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/sensors/${sensor.id}/install`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(installData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.status).toBe('ACTIVE');
  //     expect(response.body.data.bin).toBe(bin._id.toString());
  //   });
  // });

  // describe('POST /api/v1/sensors/:id/report-faulty', () => {
  //   it('should report sensor as faulty successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const sensor = await Sensor.create({
  //       ...mockSensor,
  //       owner: user._id,
  //     });

  //     const reportData = {
  //       reason: 'Battery drain',
  //       description: 'Sensor battery draining faster than expected',
  //     };

  //     const response = await request(app)
  //       .post(`/api/v1/sensors/${sensor.id}/report-faulty`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .send(reportData)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.status).toBe('FAULTY');
  //   });
  // });

  // describe('DELETE /api/v1/sensors/:id', () => {
  //   it('should delete sensor successfully', async () => {
  //     const user = await User.create(mockUser);
  //     const sensor = await Sensor.create({
  //       ...mockSensor,
  //       owner: user._id,
  //     });

  //     const response = await request(app)
  //       .delete(`/api/v1/sensors/${sensor.id}`)
  //       .set('Authorization', `Bearer ${generateMockToken(user)}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);

  //     // Verify sensor is soft deleted
  //     const deletedSensor = await Sensor.findOne({ id: sensor.id });
  //     expect(deletedSensor.isDeleted).toBe(true);
  //   });
  // });
});

// Helper function to generate mock JWT token (using the helper)
function generateMockToken(user) {
  return generateTestToken(user);
}
