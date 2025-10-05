const CollectionRequest = require('../models/collectionRequest');
const Sensor = require('../models/sensor');
const Bin = require('../models/bin');
const User = require('../models/user');
const { logBusinessEvent, logError } = require('../utils/logging/logger');
const { RecordNotFoundError, ValidationError, PermissionDeniedError, BadRequestError } = require('../utils/errors/CustomErrors');

/**
 * Collection Request Service - Business logic for collection request operations
 * Implements Single Responsibility Principle
 */
class CollectionRequestService {
  /**
   * Create a new collection request
   * @param {Object} requestData - Request data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created collection request
   */
  async createCollectionRequest(requestData, userId) {
    try {
      const startTime = Date.now();
      
      // Validate user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new RecordNotFoundError('User');
      }

      // Validate bin ownership if binId provided
      if (requestData.binId) {
        const bin = await Bin.findOne({ id: requestData.binId, owner: userId });
        if (!bin) {
          throw new RecordNotFoundError('Bin');
        }
      }

      // Validate location
      if (!requestData.location || !requestData.location.coordinates) {
        throw new ValidationError('Location with coordinates is required');
      }

      // Prepare request data
      const newRequestData = {
        type: requestData.type || 'NORMAL',
        priority: requestData.priority || 'MEDIUM',
        requester: userId,
        location: {
          type: 'Point',
          coordinates: [requestData.location.longitude, requestData.location.latitude],
          address: requestData.location.address,
          landmark: requestData.location.landmark,
        },
        wasteDetails: {
          category: requestData.wasteDetails.category,
          description: requestData.wasteDetails.description,
          estimatedWeight: requestData.wasteDetails.estimatedWeight,
          estimatedVolume: requestData.wasteDetails.estimatedVolume,
          specialInstructions: requestData.specialInstructions,
        },
      };

      if (requestData.binId) {
        newRequestData.bin = requestData.binId;
      }

      if (requestData.scheduledDate) {
        newRequestData.scheduledDate = new Date(requestData.scheduledDate);
      }

      if (requestData.scheduledTimeSlot) {
        newRequestData.scheduledTimeSlot = requestData.scheduledTimeSlot;
      }

      // Set initial payment status based on request type
      if (requestData.type === 'URGENT' || requestData.type === 'SPECIAL') {
        newRequestData.paymentDetails = {
          status: 'PENDING',
          amount: this.calculateSpecialRequestFee(requestData.type, requestData.wasteDetails),
        };
      }

      // Create request
      const request = await CollectionRequest.create(newRequestData);

      // Add attachments if provided
      if (requestData.attachments && requestData.attachments.length > 0) {
        for (const attachment of requestData.attachments) {
          await request.addAttachment(attachment);
        }
      }

      const duration = Date.now() - startTime;
      logBusinessEvent('collection_request_created', {
        requestId: request.id,
        userId,
        type: request.type,
        priority: request.priority,
        duration: `${duration}ms`,
      });

      return await this.getCollectionRequestById(request.id);
    } catch (error) {
      logError(error, { operation: 'createCollectionRequest', userId, requestData });
      throw error;
    }
  }

  /**
   * Get collection request by ID
   * @param {string} requestId - Request ID
   * @returns {Promise<Object>} Collection request data
   */
  async getCollectionRequestById(requestId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } })
        .populate('requester', 'firstName lastName email phoneNumber address')
        .populate('collectionTeam', 'firstName lastName email phoneNumber')
        .populate('bin', 'binNumber category location');

      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      return request;
    } catch (error) {
      logError(error, { operation: 'getCollectionRequestById', requestId });
      throw error;
    }
  }

  /**
   * Get all collection requests with pagination and filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated collection request results
   */
  async getAllCollectionRequests(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { isDeleted: { $ne: true } };

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.priority) query.priority = filters.priority;
      if (filters.requester) query.requester = filters.requester;

      // Date filtering
      if (filters.scheduledDate) {
        const date = new Date(filters.scheduledDate);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query.scheduledDate = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
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
              $maxDistance: filters.radius || 5000,
            },
          };
        }
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { priority: 1, createdAt: -1 },
        populate: [
          { path: 'requester', select: 'firstName lastName email phoneNumber' },
          { path: 'collectionTeam', select: 'firstName lastName email' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await CollectionRequest.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getAllCollectionRequests', filters, pagination });
      throw error;
    }
  }

  /**
   * Update collection request
   * @param {string} requestId - Request ID
   * @param {Object} updateData - Update data
   * @param {string} userId - User ID requesting update
   * @returns {Promise<Object>} Updated collection request
   */
  async updateCollectionRequest(requestId, updateData, userId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } });
      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canUpdate = request.requester.toString() === userId ||
        user.roles.includes('ADMIN') ||
        user.roles.includes('COLLECTION_TEAM') ||
        user.roles.includes('OPERATIONS_PLANNER');

      if (!canUpdate) {
        throw new PermissionDeniedError();
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.requestNumber;
      delete updateData.requester;

      // Only allow status updates for collection team and admin
      if (updateData.status && !user.roles.includes('COLLECTION_TEAM') && !user.roles.includes('ADMIN')) {
        delete updateData.status;
      }

      const updatedRequest = await CollectionRequest.findOneAndUpdate(
        { id: requestId },
        updateData,
        { new: true, runValidators: true }
      ).populate('requester', 'firstName lastName email phoneNumber')
       .populate('collectionTeam', 'firstName lastName email')
       .populate('bin', 'binNumber category location');

      logBusinessEvent('collection_request_updated', {
        requestId,
        userId,
        updateData,
      });

      return updatedRequest;
    } catch (error) {
      logError(error, { operation: 'updateCollectionRequest', requestId, userId, updateData });
      throw error;
    }
  }

  /**
   * Schedule collection request
   * @param {string} requestId - Request ID
   * @param {Object} scheduleData - Schedule data
   * @param {string} userId - User ID scheduling the request
   * @returns {Promise<Object>} Updated collection request
   */
  async scheduleCollectionRequest(requestId, scheduleData, userId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } });
      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      // Validate collection team member
      if (scheduleData.collectionTeamId) {
        const teamMember = await User.findOne({ 
          _id: scheduleData.collectionTeamId, 
          roles: 'COLLECTION_TEAM',
          isDeleted: { $ne: true }
        });
        if (!teamMember) {
          throw new RecordNotFoundError('Collection team member');
        }
      }

      await request.scheduleCollection(new Date(scheduleData.scheduledDate), scheduleData.timeSlot);
      
      if (scheduleData.collectionTeamId) {
        request.collectionTeam = scheduleData.collectionTeamId;
        await request.save();
      }

      logBusinessEvent('collection_request_scheduled', {
        requestId,
        userId,
        scheduledDate: scheduleData.scheduledDate,
        collectionTeamId: scheduleData.collectionTeamId,
      });

      return await this.getCollectionRequestById(requestId);
    } catch (error) {
      logError(error, { operation: 'scheduleCollectionRequest', requestId, userId, scheduleData });
      throw error;
    }
  }

  /**
   * Complete collection request
   * @param {string} requestId - Request ID
   * @param {Object} completionData - Completion data
   * @param {string} userId - User ID completing the request
   * @returns {Promise<Object>} Updated collection request
   */
  async completeCollectionRequest(requestId, completionData, userId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } });
      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      if (request.status !== 'IN_PROGRESS') {
        throw new BadRequestError('Request must be in progress to complete');
      }

      const collectionData = {
        actualWeight: completionData.actualWeight,
        actualVolume: completionData.actualVolume,
        notes: completionData.notes,
        images: completionData.images,
        collectedBy: userId,
      };

      await request.completeCollection(collectionData);

      logBusinessEvent('collection_request_completed', {
        requestId,
        userId,
        actualWeight: completionData.actualWeight,
        actualVolume: completionData.actualVolume,
      });

      return await this.getCollectionRequestById(requestId);
    } catch (error) {
      logError(error, { operation: 'completeCollectionRequest', requestId, userId, completionData });
      throw error;
    }
  }

  /**
   * Get user's collection requests
   * @param {string} userId - User ID
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated collection request results
   */
  async getUserCollectionRequests(userId, filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      let query = { requester: userId, isDeleted: { $ne: true } };

      if (filters.status) {
        query.status = filters.status;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { path: 'collectionTeam', select: 'firstName lastName email' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await CollectionRequest.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getUserCollectionRequests', userId, filters, pagination });
      throw error;
    }
  }

  /**
   * Get pending collection requests
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated pending collection request results
   */
  async getPendingCollectionRequests(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const query = { 
        status: 'PENDING', 
        isDeleted: { $ne: true } 
      };

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { priority: 1, createdAt: 1 },
        populate: [
          { path: 'requester', select: 'firstName lastName email phoneNumber' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await CollectionRequest.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getPendingCollectionRequests', pagination });
      throw error;
    }
  }

  /**
   * Get scheduled collection requests for a specific date
   * @param {string} date - Date to get scheduled requests for
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated scheduled collection request results
   */
  async getScheduledCollectionRequests(date, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      
      if (!date) {
        throw new ValidationError('Date parameter is required');
      }

      const scheduledDate = new Date(date);
      const startOfDay = new Date(scheduledDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(scheduledDate);
      endOfDay.setHours(23, 59, 59, 999);

      const query = {
        scheduledDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: 'SCHEDULED',
        isDeleted: { $ne: true },
      };

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { scheduledTimeSlot: 1 },
        populate: [
          { path: 'requester', select: 'firstName lastName email phoneNumber' },
          { path: 'collectionTeam', select: 'firstName lastName email' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await CollectionRequest.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getScheduledCollectionRequests', date, pagination });
      throw error;
    }
  }

  /**
   * Get urgent collection requests
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated urgent collection request results
   */
  async getUrgentCollectionRequests(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const query = {
        priority: 'URGENT',
        status: { $in: ['PENDING', 'SCHEDULED'] },
        isDeleted: { $ne: true },
      };

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: 1 },
        populate: [
          { path: 'requester', select: 'firstName lastName email phoneNumber' },
          { path: 'collectionTeam', select: 'firstName lastName email' },
          { path: 'bin', select: 'binNumber category location' },
        ],
      };

      return await CollectionRequest.paginate(query, options);
    } catch (error) {
      logError(error, { operation: 'getUrgentCollectionRequests', pagination });
      throw error;
    }
  }

  /**
   * Cancel collection request
   * @param {string} requestId - Request ID
   * @param {Object} cancelData - Cancel data
   * @param {string} userId - User ID requesting cancellation
   * @returns {Promise<Object>} Updated collection request
   */
  async cancelCollectionRequest(requestId, cancelData, userId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } });
      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canCancel = request.requester.toString() === userId ||
        user.roles.includes('ADMIN');

      if (!canCancel) {
        throw new PermissionDeniedError();
      }

      if (request.status === 'COMPLETED') {
        throw new BadRequestError('Cannot cancel completed request');
      }

      request.status = 'CANCELLED';
      if (cancelData.reason) {
        request.collectionDetails = request.collectionDetails || {};
        request.collectionDetails.notes = cancelData.reason;
      }
      await request.save();

      logBusinessEvent('collection_request_cancelled', {
        requestId,
        userId,
        reason: cancelData.reason,
      });

      return request;
    } catch (error) {
      logError(error, { operation: 'cancelCollectionRequest', requestId, userId, cancelData });
      throw error;
    }
  }

  /**
   * Add attachment to collection request
   * @param {string} requestId - Request ID
   * @param {Object} attachmentData - Attachment data
   * @param {string} userId - User ID adding attachment
   * @returns {Promise<Object>} Updated collection request
   */
  async addAttachment(requestId, attachmentData, userId) {
    try {
      const request = await CollectionRequest.findOne({ id: requestId, isDeleted: { $ne: true } });
      if (!request) {
        throw new RecordNotFoundError('Collection request');
      }

      // Check permissions
      const user = await User.findById(userId);
      const canAddAttachment = request.requester.toString() === userId ||
        user.roles.includes('ADMIN') ||
        user.roles.includes('COLLECTION_TEAM');

      if (!canAddAttachment) {
        throw new PermissionDeniedError();
      }

      await request.addAttachment(attachmentData);

      logBusinessEvent('collection_request_attachment_added', {
        requestId,
        userId,
        attachmentFilename: attachmentData.filename,
      });

      return request;
    } catch (error) {
      logError(error, { operation: 'addAttachment', requestId, userId, attachmentData });
      throw error;
    }
  }

  /**
   * Calculate special request fee
   * @param {string} type - Request type
   * @param {Object} wasteDetails - Waste details
   * @returns {number} Calculated fee
   */
  calculateSpecialRequestFee(type, wasteDetails) {
    const baseFee = 50; // Base fee for special requests
    
    switch (type) {
      case 'URGENT':
        return baseFee * 2;
      case 'BULKY_ITEMS':
        return baseFee + (wasteDetails.estimatedWeight || 0) * 2;
      case 'E_WASTE':
        return baseFee + (wasteDetails.estimatedWeight || 0) * 3;
      case 'HAZARDOUS':
        return baseFee + (wasteDetails.estimatedWeight || 0) * 5;
      default:
        return baseFee;
    }
  }
}

module.exports = new CollectionRequestService();
