const Sensor = require('../models/sensor');
const Bin = require('../models/bin');
const User = require('../models/user');
const { logBusinessEvent, logError } = require('../utils/logging/logger');
const { RecordNotFoundError, ValidationError, PermissionDeniedError } = require('../utils/errors/CustomErrors');
const AppError = require('../utils/errors/AppError');

/**
 * Sensor Service - Business logic for sensor operations
 * Implements Single Responsibility Principle
 */
class SensorService {
  /**
   * Create a new sensor
   * @param {Object} sensorData - Sensor data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created sensor
   */
  async createSensor(sensorData, userId) {
    try {
      const startTime = Date.now();
      
      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new RecordNotFoundError('User');
      }

      // Check for duplicate serial number
      const existingSensor = await Sensor.findOne({ serialNumber: sensorData.serialNumber });
      if (existingSensor) {
        throw new AppError('Sensor with this serial number already exists', 400, 400);
      }

      // Validate bin ownership if binId provided
      if (sensorData.binId) {
        const bin = await Bin.findOne({ id: sensorData.binId, owner: userId });
        if (!bin) {
          throw new RecordNotFoundError('Bin');
        }
      }

      // Prepare sensor data
      const newSensorData = {
        serialNumber: sensorData.serialNumber,
        type: sensorData.type || 'FILL_LEVEL',
        manufacturer: sensorData.manufacturer,
        model: sensorData.model,
        purchasePrice: sensorData.purchasePrice,
        owner: userId,
        status: 'INACTIVE',
        attachment: "https://firebasestorage.googleapis.com/v0/b/realstate-aa106.appspot.com/o/collection-requests%2F1760025951908volume-sensor.jpg?alt=media&token=0e631f4e-0555-4bba-90be-ff55d300dee1"
      };

      if (sensorData.location) {
        newSensorData.location = {
          type: 'Point',
          coordinates: [sensorData.location.longitude, sensorData.location.latitude],
          address: sensorData.location.address,
        };
      }

      if (sensorData.binId) {
        newSensorData.bin = sensorData.binId;
      }

      console.log(newSensorData);
      
      console.log('new sensor datra |||||||||||||||||||||||||||||||||||||||||', newSensorData);
      
      // Create sensor
      const sensor = await Sensor.create(newSensorData);
          console.log('sensor |||||||||||||||||||||||||||||||||||||||||', sensor);

      // Attach sensor to bin if specified
      if (sensorData.binId) {
        const bin = await Bin.findOne({ id: sensorData.binId });
        if (bin) {
          bin.sensor = sensor._id;
          await bin.save();
        }
      }

      const duration = Date.now() - startTime;
      logBusinessEvent('sensor_created', {
        sensorId: sensor.id,
        userId,
        duration: `${duration}ms`,
      });

      return await this.getSensorById(sensor._id);
    } catch (error) {
      logError(error, { operation: 'createSensor', userId, sensorData });
      throw error;
    }
  }

  /**
   * Get sensor by ID
   * @param {string} sensorId - Sensor ID
   * @returns {Promise<Object>} Sensor data
   */
  async getSensorById(sensorId) {
    try {
      console.log('sensor idddddddddddddddddddd ||||||||||||||||||||||||||||| ', sensorId);
      
      const sensor = await Sensor.findOne({ _id: sensorId, isDeleted: { $ne: true } })
        .populate('owner', 'firstName lastName email phoneNumber')
        .populate('bin', 'binNumber category location');

      if (!sensor) {
        throw new RecordNotFoundError('Sensor');
      }

      return sensor;
    } catch (error) {
      logError(error, { operation: 'getSensorById', sensorId });
      throw error;
    }
  }

  /**
   * Get all sensors with pagination and filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated sensor results
   */
  async getAllSensors(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { isDeleted: { $ne: true } };

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.owner) query.owner = filters.owner;

      // Location-based filtering
      if (filters.location) {
        const [longitude, latitude] = filters.location.split(',').map(Number);
        if (longitude && latitude) {
          query['location.coordinates'] = {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: filters.radius || 1000,
            },
          };
        }
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { path: 'owner', select: 'firstName lastName email' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await Sensor.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getAllSensors', filters, pagination });
      throw error;
    }
  }

  /**
   * Update sensor information
   * @param {string} sensorId - Sensor ID
   * @param {Object} updateData - Update data
   * @param {string} userId - User ID requesting update
   * @returns {Promise<Object>} Updated sensor
   */
  async updateSensor(sensorId, updateData, userId) {
    try {
      const sensor = await Sensor.findOne({ _id: sensorId, isDeleted: { $ne: true } });
      if (!sensor) {
        throw new RecordNotFoundError('Sensor');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      console.log(sensor.owner.toString(), userId);
      
      if (sensor.owner.toString() !== userId?.toString()) {
        throw new PermissionDeniedError();
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      // delete updateData.serialNumber;
      delete updateData.owner;

      console.log(updateData);
      

      const updatedSensor = await Sensor.findOneAndUpdate(
        { _id: sensorId },
        updateData,
        { new: true, runValidators: true }
      ).populate('owner', 'firstName lastName email')
       .populate('bin', 'binNumber category');

      logBusinessEvent('sensor_updated', {
        sensorId,
        userId,
        updateData,
      });

      return updatedSensor;
    } catch (error) {
      logError(error, { operation: 'updateSensor', sensorId, userId, updateData });
      throw error;
    }
  }

  /**
   * Install sensor to a bin
   * @param {string} sensorId - Sensor ID
   * @param {Object} installData - Installation data
   * @param {string} userId - User ID performing installation
   * @returns {Promise<Object>} Updated sensor
   */
  async installSensor(sensorId, installData, userId) {
    try {
      const sensor = await Sensor.findOne({ _id: sensorId, isDeleted: { $ne: true } });
      if (!sensor) {
        throw new RecordNotFoundError('Sensor');
      }

      const bin = await Bin.findOne({ _id: installData.binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canInstall = sensor.owner.toString() === userId?.toString() ||
        user.roles.includes('ADMIN') ||
        user.roles.includes('COLLECTION_TEAM');

      if (!canInstall) {
        throw new PermissionDeniedError();
      }

      // Update sensor
      sensor.status = 'ACTIVE';
      sensor.installationDate = installData.installationDate || new Date();
      sensor.bin = bin._id;
      await sensor.save();

      // Update bin
      bin.sensor = sensor._id;
      await bin.save();

      logBusinessEvent('sensor_installed', {
        sensorId,
        binId: bin.id,
        userId,
      });

      return await this.getSensorById(sensorId);
    } catch (error) {
      logError(error, { operation: 'installSensor', sensorId, userId, installData });
      throw error;
    }
  }

  /**
   * Get user's sensors
   * @param {string} userId - User ID
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated sensor results
   */
  async getUserSensors(userId, filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { owner: userId, isDeleted: { $ne: true } };

      if (filters.status) {
        query.status = filters.status;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: { path: 'bin', select: 'binNumber category location' },
      };

      return await Sensor.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getUserSensors', userId, filters, pagination });
      throw error;
    }
  }

  /**
   * Delete sensor (soft delete)
   * @param {string} sensorId - Sensor ID
   * @param {string} userId - User ID requesting deletion
   * @returns {Promise<void>}
   */
  async deleteSensor(sensorId, userId) {
    try {
      const sensor = await Sensor.findOne({ id: sensorId, isDeleted: { $ne: true } });
      if (!sensor) {
        throw new RecordNotFoundError('Sensor');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      if (sensor.owner.toString() !== userId && !user.roles.includes('ADMIN')) {
        throw new PermissionDeniedError();
      }

      // Detach from bin if attached
      if (sensor.bin) {
        await Bin.findByIdAndUpdate(sensor.bin, { sensor: null });
      }

      // Soft delete
      sensor.isDeleted = true;
      await sensor.save();

      logBusinessEvent('sensor_deleted', {
        sensorId,
        userId,
      });
    } catch (error) {
      logError(error, { operation: 'deleteSensor', sensorId, userId });
      throw error;
    }
  }
}

module.exports = new SensorService();
