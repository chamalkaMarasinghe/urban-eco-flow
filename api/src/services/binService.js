const Bin = require('../models/bin');
const Sensor = require('../models/sensor');
const User = require('../models/user');
const { logBusinessEvent, logError } = require('../utils/logging/logger');
const { RecordNotFoundError, ValidationError, PermissionDeniedError, DuplicateRecordsError, BadRequestError } = require('../utils/errors/CustomErrors');

/**
 * Bin Service - Business logic for bin operations
 * Implements Single Responsibility Principle
 */
class BinService {
  /**
   * Create a new bin
   * @param {Object} binData - Bin data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created bin
   */
  async createBin(binData, userId) {
    try {
      const startTime = Date.now();
      
      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new RecordNotFoundError('User');
      }

      // Check for duplicate bin number
      const existingBin = await Bin.findOne({ binNumber: binData.binNumber });
      if (existingBin) {
        throw new DuplicateRecordsError('Bin with this number');
      }

      // Validate sensor ownership if sensorId provided
      if (binData.sensorId) {
        const sensor = await Sensor.findOne({ _id: binData.sensorId, owner: userId });
        if (!sensor) {
          throw new RecordNotFoundError('Sensor');
        }
      }

      // Validate location
      if (!binData.location || !binData.location.coordinates) {
        throw new ValidationError('Location with coordinates is required');
      }

      // Prepare bin data
      const newBinData = {
        binNumber: binData.binNumber,
        capacity: binData.capacity,
        category: binData.category || 'GENERAL',
        material: binData.material,
        color: binData.color,
        owner: userId,
        location: {
          type: 'Point',
          coordinates: [binData.location.longitude, binData.location.latitude],
          address: binData.location.address,
          landmark: binData.location.landmark,
        },
      };

      if (binData.sensorId) {
        newBinData.sensor = binData.sensorId;
      }

      // Create bin
      const bin = await Bin.create(newBinData);

      // Attach sensor to bin if specified
      if (binData.sensorId) {
        const sensor = await Sensor.findOne({ id: binData.sensorId });
        if (sensor) {
          sensor.bin = bin._id;
          sensor.status = 'ACTIVE';
          sensor.installationDate = new Date();
          await sensor.save();
        }
      }

      const duration = Date.now() - startTime;
      logBusinessEvent('bin_created', {
        binId: bin.id,
        userId,
        binNumber: bin.binNumber,
        capacity: bin.capacity,
        duration: `${duration}ms`,
      });

      return await this.getBinById(bin.id);
    } catch (error) {
      logError(error, { operation: 'createBin', userId, binData });
      throw error;
    }
  }

  /**
   * Get bin by ID
   * @param {string} binId - Bin ID
   * @returns {Promise<Object>} Bin data
   */
  async getBinById(binId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } })
        .populate('owner', 'firstName lastName email phoneNumber address')
        .populate('sensor', 'serialNumber type status batteryLevel installationDate');

      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      return bin;
    } catch (error) {
      logError(error, { operation: 'getBinById', binId });
      throw error;
    }
  }

  /**
   * Get all bins with pagination and filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated bin results
   */
  async getAllBins(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { isDeleted: { $ne: true } };

      // Apply filters
      if (filters.category) query.category = filters.category;
      if (filters.owner) query.owner = filters.owner;
      if (filters.hasSensor !== undefined) {
        if (filters.hasSensor === 'true') {
          query.sensor = { $exists: true, $ne: null };
        } else {
          query.sensor = { $exists: false };
        }
      }

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
          { path: 'owner', select: 'firstName lastName email phoneNumber' },
          { path: 'sensor', select: 'serialNumber type status batteryLevel' },
        ],
      };

      return await Bin.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getAllBins', filters, pagination });
      throw error;
    }
  }

  /**
   * Update bin information
   * @param {string} binId - Bin ID
   * @param {Object} updateData - Update data
   * @param {string} userId - User ID requesting update
   * @returns {Promise<Object>} Updated bin
   */
  async updateBin(binId, updateData, userId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      if (bin.owner.toString() !== userId?.toString()) {
        throw new PermissionDeniedError();
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.binNumber;
      delete updateData.owner;

      const updatedBin = await Bin.findOneAndUpdate(
        { id: binId },
        updateData,
        { new: true, runValidators: true }
      ).populate('owner', 'firstName lastName email phoneNumber')
       .populate('sensor', 'serialNumber type status batteryLevel');

      logBusinessEvent('bin_updated', {
        binId,
        userId,
        updateData,
      });

      return updatedBin;
    } catch (error) {
      logError(error, { operation: 'updateBin', binId, userId, updateData });
      throw error;
    }
  }

  /**
   * Attach sensor to bin
   * @param {string} binId - Bin ID
   * @param {Object} attachData - Attachment data
   * @param {string} userId - User ID performing attachment
   * @returns {Promise<Object>} Updated bin
   */
  async attachSensor(binId, attachData, userId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      const sensor = await Sensor.findOne({ id: attachData.sensorId, isDeleted: { $ne: true } });
      if (!sensor) {
        throw new RecordNotFoundError('Sensor');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canAttach = bin.owner.toString() === userId ||
        user.roles.includes('ADMIN') ||
        user.roles.includes('COLLECTION_TEAM');

      if (!canAttach) {
        throw new PermissionDeniedError();
      }

      // Check if sensor is already attached to another bin
      if (sensor.bin && sensor.bin.toString() !== bin._id.toString()) {
        throw new BadRequestError('Sensor is already attached to another bin');
      }

      // Update bin
      bin.sensor = sensor._id;
      await bin.save();

      // Update sensor
      sensor.bin = bin._id;
      sensor.status = 'ACTIVE';
      sensor.installationDate = new Date();
      await sensor.save();

      logBusinessEvent('sensor_attached_to_bin', {
        binId,
        sensorId: sensor.id,
        userId,
      });

      return await this.getBinById(binId);
    } catch (error) {
      logError(error, { operation: 'attachSensor', binId, userId, attachData });
      throw error;
    }
  }

  /**
   * Detach sensor from bin
   * @param {string} binId - Bin ID
   * @param {string} userId - User ID performing detachment
   * @returns {Promise<Object>} Updated bin
   */
  async detachSensor(binId, userId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canDetach = bin.owner.toString() === userId ||
        user.roles.includes('ADMIN') ||
        user.roles.includes('COLLECTION_TEAM');

      if (!canDetach) {
        throw new PermissionDeniedError();
      }

      if (!bin.sensor) {
        throw new BadRequestError('No sensor attached to this bin');
      }

      // Update sensor
      const sensor = await Sensor.findById(bin.sensor);
      if (sensor) {
        sensor.bin = undefined;
        sensor.status = 'INACTIVE';
        await sensor.save();
      }

      // Update bin
      bin.sensor = undefined;
      await bin.save();

      logBusinessEvent('sensor_detached_from_bin', {
        binId,
        sensorId: sensor?.id,
        userId,
      });

      return await this.getBinById(binId);
    } catch (error) {
      logError(error, { operation: 'detachSensor', binId, userId });
      throw error;
    }
  }

  /**
   * Add collection record to bin
   * @param {string} binId - Bin ID
   * @param {Object} collectionData - Collection data
   * @param {string} userId - User ID performing collection
   * @returns {Promise<Object>} Updated bin
   */
  async addCollectionRecord(binId, collectionData, userId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      const recordData = {
        weight: collectionData.weight,
        fillLevel: collectionData.fillLevel || bin.currentFillLevel,
        collectedBy: userId,
      };

      await bin.addCollectionRecord(recordData);

      logBusinessEvent('bin_collection_record_added', {
        binId,
        userId,
        weight: collectionData.weight,
        fillLevel: recordData.fillLevel,
      });

      return bin;
    } catch (error) {
      logError(error, { operation: 'addCollectionRecord', binId, userId, collectionData });
      throw error;
    }
  }

  /**
   * Get user's bins
   * @param {string} userId - User ID
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated bin results
   */
  async getUserBins(userId, filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { owner: userId, isDeleted: { $ne: true } };

      if (filters.category) {
        query.category = filters.category;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: { path: 'sensor', select: 'serialNumber type status batteryLevel' },
      };

      return await Bin.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getUserBins', userId, filters, pagination });
      throw error;
    }
  }

  /**
   * Delete bin (soft delete)
   * @param {string} binId - Bin ID
   * @param {string} userId - User ID requesting deletion
   * @returns {Promise<void>}
   */
  async deleteBin(binId, userId) {
    try {
      const bin = await Bin.findOne({ id: binId, isDeleted: { $ne: true } });
      if (!bin) {
        throw new RecordNotFoundError('Bin');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      if (bin.owner.toString() !== userId && !user.roles.includes('ADMIN')) {
        throw new PermissionDeniedError();
      }

      // Detach sensor if attached
      if (bin.sensor) {
        const sensor = await Sensor.findById(bin.sensor);
        if (sensor) {
          sensor.bin = undefined;
          sensor.status = 'INACTIVE';
          await sensor.save();
        }
      }

      // Soft delete
      bin.isDeleted = true;
      bin.isActive = false;
      await bin.save();

      logBusinessEvent('bin_deleted', {
        binId,
        userId,
      });
    } catch (error) {
      logError(error, { operation: 'deleteBin', binId, userId });
      throw error;
    }
  }
}

module.exports = new BinService();
