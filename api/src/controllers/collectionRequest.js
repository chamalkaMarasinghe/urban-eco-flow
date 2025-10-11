const mongoose = require("mongoose");
const { catchAsync } = require("../utils/errors/catchAsync");
const CollectionRequest = require("../models/collectionRequest");
const Sensor = require("../models/sensor");
const Bin = require("../models/bin");
const User = require("../models/user");
const handleResponse = require("../utils/response/response");
const {
  RecordNotFoundError,
  ValidationError,
  PermissionDeniedError,
  BadRequestError,
} = require("../utils/errors/CustomErrors");
const {
  collectionRequestTypes,
  collectionRequestStatus,
  paymentStatus,
  priorityLevels,
  wasteCategories,
} = require("../constants/commonConstants");

/**
 * @desc    Get all collection requests with pagination and filtering
 * @route   GET /api/v1/collection-requests
 * @access  Private (Admin, Collection Team, Operations Planner)
 */
exports.getAllCollectionRequests = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    priority,
    requester,
    scheduledDate,
    location,
    radius = 5000,
  } = req.query;

  let query = { isDeleted: { $ne: true } };

  // Apply filters
  if (status) {
    query.status = status;
  }
  if (type) {
    query.type = type;
  }
  if (priority) {
    query.priority = priority;
  }
  if (requester) {
    query.requester = requester;
  }

  // Date filtering
  if (scheduledDate) {
    const date = new Date(scheduledDate);
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
  if (location) {
    const [longitude, latitude] = location.split(",").map(Number);
    if (longitude && latitude) {
      query["location.coordinates"] = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: parseInt(radius),
        },
      };
    }
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { priority: 1, createdAt: -1 },
    populate: [
      { path: "requester", select: "firstName lastName email phoneNumber" },
      { path: "collectionTeam", select: "firstName lastName email" },
      { path: "bin", select: "binNumber category location" },
    ],
  };

  const requests = await CollectionRequest.paginate(query, options);

  return handleResponse(res, 200, "Collection requests retrieved successfully", requests);
});

/**
 * @desc    Get collection request by ID
 * @route   GET /api/v1/collection-requests/:id
 * @access  Private
 */
exports.getCollectionRequestById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const request = await CollectionRequest.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("requester", "firstName lastName email phoneNumber address")
    .populate("collectionTeam", "firstName lastName email phoneNumber")
    .populate("bin", "binNumber category location");

  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  return handleResponse(res, 200, "Collection request retrieved successfully", request);
});

/**
 * @desc    Create a new collection request
 * @route   POST /api/v1/collection-requests
 * @access  Private (Resident, Business)
 */
exports.createCollectionRequest = catchAsync(async (req, res, next) => {
  const {
    title,
    type,
    priority,
    bin,
    location,
    wasteDetails,
    scheduledDate,
    scheduledTimeSlot,
    specialInstructions,
    attachment,
  } = req.body;

  console.log('location =========================');
  console.log(location);
  
  // Validate user
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new RecordNotFoundError("User");
  }

  // Validate bin ownership if binId provided
  if (bin) {
    const binDB = await Bin.findOne({ _id: bin, owner: req.user.id });
    if (!binDB) {
      throw new RecordNotFoundError("Bin");
    }
  }

  // Validate location
  if (!location || !location.coordinates) {
    throw new ValidationError("Location with coordinates is required");
  }

  const requestData = {
    requestNumber: title || "Default Title" ,
    type: type || wasteCategories.GENERAL,
    priority: priority || priorityLevels.REGULAR,
    requester: req.user.id,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
      address: location.address,
      landmark: location.landmark,
    },
    wasteDetails: {
      category: wasteCategories.GENERAL,
      description: wasteDetails?.description,
      estimatedWeight: wasteDetails?.estimatedWeight,
      estimatedVolume: wasteDetails?.estimatedVolume,
      specialInstructions: specialInstructions,
    },
    attachment
  };

  if (bin) {
    requestData.bin = bin;
  }

  if (scheduledDate) {
    requestData.scheduledDate = new Date(scheduledDate);
  }

  if (scheduledTimeSlot) {
    requestData.scheduledTimeSlot = scheduledTimeSlot;
  }

  // Set initial payment status based on request type
  if (type === collectionRequestTypes.URGENT || type === collectionRequestTypes.SPECIAL) {
    requestData.paymentDetails = {
      status: paymentStatus.PENDING,
      amount: calculateSpecialRequestFee(type, wasteDetails),
    };
  }

  const request = await CollectionRequest.create(requestData);

  // Add attachments if provided
  // if (attachments && attachments.length > 0) {
  //   for (const attachment of attachments) {
  //     await request.addAttachment(attachment);
  //   }
  // }

  const populatedRequest = await CollectionRequest.findById(request._id)
    .populate("requester", "firstName lastName email phoneNumber")
    .populate("bin", "binNumber category location");

  return handleResponse(res, 201, "Collection request created successfully", populatedRequest);
});

/**
 * @desc    Update collection request
 * @route   PUT /api/v1/collection-requests/:id
 * @access  Private (Owner, Admin, Collection Team)
 */
exports.updateCollectionRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const request = await CollectionRequest.findOne({_id: id, isDeleted: { $ne: true } });
  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  // Check permissions
  const canUpdate = request.requester.toString() === req.user.id?.toString() ||
    req.user.roles.includes("ADMIN") ||
    req.user.roles.includes("COLLECTION_TEAM") ||
    req.user.roles.includes("OPERATIONS_PLANNER");

  if (!canUpdate) {
    throw new PermissionDeniedError();
  }

  // Remove fields that shouldn't be updated directly
  delete updateData.id;
  // delete updateData.requestNumber;
  delete updateData.requester;

  // Only allow status updates for collection team and admin
  if (updateData.status && !req.user.roles.includes("COLLECTION_TEAM") && !req.user.roles.includes("ADMIN")) {
    delete updateData.status;
  }

  const updatedRequest = await CollectionRequest.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true, runValidators: true }
  ).populate("requester", "firstName lastName email phoneNumber")
   .populate("collectionTeam", "firstName lastName email")
   .populate("bin", "binNumber category location");

  return handleResponse(res, 200, "Collection request updated successfully", updatedRequest);
});

/**
 * @desc    Schedule collection request
 * @route   POST /api/v1/collection-requests/:id/schedule
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.scheduleCollectionRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { scheduledDate, timeSlot, collectionTeamId } = req.body;

  const request = await CollectionRequest.findOne({ id, isDeleted: { $ne: true } });
  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  // Validate collection team member
  if (collectionTeamId) {
    const teamMember = await User.findOne({ 
      _id: collectionTeamId, 
      roles: "COLLECTION_TEAM",
      isDeleted: { $ne: true }
    });
    if (!teamMember) {
      throw new RecordNotFoundError("Collection team member");
    }
  }

  await request.scheduleCollection(new Date(scheduledDate), timeSlot);
  
  if (collectionTeamId) {
    request.collectionTeam = collectionTeamId;
    await request.save();
  }

  const populatedRequest = await CollectionRequest.findById(request._id)
    .populate("requester", "firstName lastName email phoneNumber")
    .populate("collectionTeam", "firstName lastName email")
    .populate("bin", "binNumber category location");

  return handleResponse(res, 200, "Collection request scheduled successfully", populatedRequest);
});

/**
 * @desc    Complete collection request
 * @route   POST /api/v1/collection-requests/:id/complete
 * @access  Private (Collection Team, Admin)
 */
exports.completeCollectionRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { actualWeight, actualVolume, notes, images } = req.body;

  const request = await CollectionRequest.findOne({ id, isDeleted: { $ne: true } });
  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  if (request.status !== collectionRequestStatus.IN_PROGRESS) {
    throw new BadRequestError("Request must be in progress to complete");
  }

  const collectionData = {
    actualWeight,
    actualVolume,
    notes,
    images,
    collectedBy: req.user.id,
  };

  await request.completeCollection(collectionData);

  const populatedRequest = await CollectionRequest.findById(request._id)
    .populate("requester", "firstName lastName email phoneNumber")
    .populate("collectionTeam", "firstName lastName email")
    .populate("bin", "binNumber category location");

  return handleResponse(res, 200, "Collection request completed successfully", populatedRequest);
});

/**
 * @desc    Get my collection requests
 * @route   GET /api/v1/collection-requests/my-requests
 * @access  Private (Resident, Business)
 */
exports.getMyCollectionRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { requester: req.user.id, isDeleted: { $ne: true } };

  if (status) {
    query.status = status;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: "collectionTeam", select: "firstName lastName email" },
      { path: "bin", select: "binNumber category location" },
    ],
  };

  const requests = await CollectionRequest.paginate(query, options);

  return handleResponse(res, 200, "Your collection requests retrieved successfully", requests);
});

/**
 * @desc    Get pending collection requests
 * @route   GET /api/v1/collection-requests/pending
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getPendingCollectionRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const query = { 
    status: collectionRequestStatus.PENDING, 
    isDeleted: { $ne: true } 
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { priority: 1, createdAt: 1 },
    populate: [
      { path: "requester", select: "firstName lastName email phoneNumber" },
      { path: "bin", select: "binNumber category location" },
    ],
  };

  const requests = await CollectionRequest.paginate(query, options);

  return handleResponse(res, 200, "Pending collection requests retrieved successfully", requests);
});

/**
 * @desc    Get scheduled collection requests for a date
 * @route   GET /api/v1/collection-requests/scheduled/:date
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getScheduledCollectionRequests = catchAsync(async (req, res, next) => {
  const { date } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!date) {
    throw new ValidationError("Date parameter is required");
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
    status: collectionRequestStatus.SCHEDULED,
    isDeleted: { $ne: true },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { scheduledTimeSlot: 1 },
    populate: [
      { path: "requester", select: "firstName lastName email phoneNumber" },
      { path: "collectionTeam", select: "firstName lastName email" },
      { path: "bin", select: "binNumber category location" },
    ],
  };

  const requests = await CollectionRequest.paginate(query, options);

  return handleResponse(res, 200, "Scheduled collection requests retrieved successfully", requests);
});

/**
 * @desc    Get urgent collection requests
 * @route   GET /api/v1/collection-requests/urgent
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getUrgentCollectionRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    priority: priorityLevels.URGENT,
    status: { $in: [collectionRequestStatus.PENDING, collectionRequestStatus.SCHEDULED] },
    isDeleted: { $ne: true },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: 1 },
    populate: [
      { path: "requester", select: "firstName lastName email phoneNumber" },
      { path: "collectionTeam", select: "firstName lastName email" },
      { path: "bin", select: "binNumber category location" },
    ],
  };

  const requests = await CollectionRequest.paginate(query, options);

  return handleResponse(res, 200, "Urgent collection requests retrieved successfully", requests);
});

/**
 * @desc    Cancel collection request
 * @route   POST /api/v1/collection-requests/:id/cancel
 * @access  Private (Owner, Admin)
 */
exports.cancelCollectionRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const request = await CollectionRequest.findOne({ id, isDeleted: { $ne: true } });
  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  // Check permissions
  const canCancel = request.requester.toString() === req.user.id ||
    req.user.roles.includes("ADMIN");

  if (!canCancel) {
    throw new PermissionDeniedError();
  }

  if (request.status === collectionRequestStatus.COMPLETED) {
    throw new BadRequestError("Cannot cancel completed request");
  }

  request.status = collectionRequestStatus.CANCELLED;
  if (reason) {
    request.collectionDetails = request.collectionDetails || {};
    request.collectionDetails.notes = reason;
  }
  await request.save();

  return handleResponse(res, 200, "Collection request cancelled successfully", request);
});

/**
 * @desc    Add attachment to collection request
 * @route   POST /api/v1/collection-requests/:id/attachments
 * @access  Private (Owner, Collection Team, Admin)
 */
exports.addAttachment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const attachmentData = req.body;

  const request = await CollectionRequest.findOne({ id, isDeleted: { $ne: true } });
  if (!request) {
    throw new RecordNotFoundError("Collection request");
  }

  // Check permissions
  const canAddAttachment = request.requester.toString() === req.user.id ||
    req.user.roles.includes("ADMIN") ||
    req.user.roles.includes("COLLECTION_TEAM");

  if (!canAddAttachment) {
    throw new PermissionDeniedError();
  }

  await request.addAttachment(attachmentData);

  return handleResponse(res, 200, "Attachment added successfully", request);
});

// Helper function to calculate special request fees
function calculateSpecialRequestFee(type, wasteDetails) {
  const baseFee = 50; // Base fee for special requests
  
  switch (type) {
    case collectionRequestTypes.URGENT:
      return baseFee * 2;
    case collectionRequestTypes.BULKY_ITEMS:
      return baseFee + (wasteDetails.estimatedWeight || 0) * 2;
    case collectionRequestTypes.E_WASTE:
      return baseFee + (wasteDetails.estimatedWeight || 0) * 3;
    case collectionRequestTypes.HAZARDOUS:
      return baseFee + (wasteDetails.estimatedWeight || 0) * 5;
    default:
      return baseFee;
  }
}
