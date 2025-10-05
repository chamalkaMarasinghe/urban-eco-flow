const mongoose = require("mongoose");
const { catchAsync } = require("../utils/errors/catchAsync");
const Bin = require("../models/bin");
const Sensor = require("../models/sensor");
const User = require("../models/user");
const handleResponse = require("../utils/response/response");
const {
  RecordNotFoundError,
  ValidationError,
  PermissionDeniedError,
  DuplicateRecordsError,
  BadRequestError,
} = require("../utils/errors/CustomErrors");
const { wasteCategories } = require("../constants/commonConstants");

/**
 * @desc    Get all bins with pagination and filtering
 * @route   GET /api/v1/bins
 * @access  Private (Admin, Collection Team, Operations Planner)
 */
exports.getAllBins = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    owner,
    location,
    radius = 1000,
    hasSensor,
  } = req.query;

  let query = { isDeleted: { $ne: true } };

  // Apply filters
  if (category) {
    query.category = category;
  }
  if (owner) {
    query.owner = owner;
  }
  if (hasSensor !== undefined) {
    if (hasSensor === 'true') {
      query.sensor = { $exists: true, $ne: null };
    } else {
      query.sensor = { $exists: false };
    }
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
    sort: { createdAt: -1 },
    populate: [
      { path: "owner", select: "firstName lastName email phoneNumber" },
      { path: "sensor", select: "serialNumber type status batteryLevel" },
    ],
  };

  const bins = await Bin.paginate(query, options);

  return handleResponse(res, 200, "Bins retrieved successfully", bins);
});

/**
 * @desc    Get bin by ID
 * @route   GET /api/v1/bins/:id
 * @access  Private
 */
exports.getBinById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } })
    .populate("owner", "firstName lastName email phoneNumber address")
    .populate("sensor", "serialNumber type status batteryLevel installationDate");

  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  return handleResponse(res, 200, "Bin retrieved successfully", bin);
});

/**
 * @desc    Register a new bin
 * @route   POST /api/v1/bins
 * @access  Private (Resident, Business)
 */
exports.createBin = catchAsync(async (req, res, next) => {
  const {
    binNumber,
    capacity,
    category,
    material,
    color,
    location,
    sensorId,
  } = req.body;

  // Validate user
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new RecordNotFoundError("User");
  }

  // Check if bin number already exists
  const existingBin = await Bin.findOne({ binNumber });
  if (existingBin) {
    throw new DuplicateRecordsError("Bin with this number");
  }

  // Validate sensor ownership if sensorId provided
  if (sensorId) {
    const sensor = await Sensor.findOne({ id: sensorId, owner: req.user.id });
    if (!sensor) {
      throw new RecordNotFoundError("Sensor");
    }
  }

  // Validate location
  if (!location || !location.coordinates) {
    throw new ValidationError("Location with coordinates is required");
  }

  const binData = {
    binNumber,
    capacity,
    category: category || wasteCategories.GENERAL,
    material,
    color,
    owner: req.user.id,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
      address: location.address,
      landmark: location.landmark,
    },
  };

  if (sensorId) {
    binData.sensor = sensorId;
  }

  const bin = await Bin.create(binData);

  // Attach sensor to bin if specified
  if (sensorId) {
    const sensor = await Sensor.findOne({ id: sensorId });
    if (sensor) {
      sensor.bin = bin._id;
      sensor.status = "ACTIVE";
      sensor.installationDate = new Date();
      await sensor.save();
    }
  }

  const populatedBin = await Bin.findById(bin._id)
    .populate("owner", "firstName lastName email phoneNumber")
    .populate("sensor", "serialNumber type status batteryLevel");

  return handleResponse(res, 201, "Bin registered successfully", populatedBin);
});

/**
 * @desc    Update bin information
 * @route   PUT /api/v1/bins/:id
 * @access  Private (Owner, Admin)
 */
exports.updateBin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  // Check ownership or admin role
  if (bin.owner.toString() !== req.user.id && !req.user.roles.includes("ADMIN")) {
    throw new PermissionDeniedError();
  }

  // Remove fields that shouldn't be updated directly
  delete updateData.id;
  delete updateData.binNumber;
  delete updateData.owner;

  const updatedBin = await Bin.findOneAndUpdate(
    { id },
    updateData,
    { new: true, runValidators: true }
  ).populate("owner", "firstName lastName email phoneNumber")
   .populate("sensor", "serialNumber type status batteryLevel");

  return handleResponse(res, 200, "Bin updated successfully", updatedBin);
});

/**
 * @desc    Attach sensor to bin
 * @route   POST /api/v1/bins/:id/attach-sensor
 * @access  Private (Owner, Admin, Collection Team)
 */
exports.attachSensor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sensorId } = req.body;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  const sensor = await Sensor.findOne({ id: sensorId, isDeleted: { $ne: true } });
  if (!sensor) {
    throw new RecordNotFoundError("Sensor");
  }

  // Check permissions
  const canAttach = bin.owner.toString() === req.user.id ||
    req.user.roles.includes("ADMIN") ||
    req.user.roles.includes("COLLECTION_TEAM");

  if (!canAttach) {
    throw new PermissionDeniedError();
  }

  // Check if sensor is already attached to another bin
  if (sensor.bin && sensor.bin.toString() !== bin._id.toString()) {
    throw new BadRequestError("Sensor is already attached to another bin");
  }

  // Update bin
  bin.sensor = sensor._id;
  await bin.save();

  // Update sensor
  sensor.bin = bin._id;
  sensor.status = "ACTIVE";
  sensor.installationDate = new Date();
  await sensor.save();

  const populatedBin = await Bin.findById(bin._id)
    .populate("owner", "firstName lastName email phoneNumber")
    .populate("sensor", "serialNumber type status batteryLevel installationDate");

  return handleResponse(res, 200, "Sensor attached successfully", populatedBin);
});

/**
 * @desc    Detach sensor from bin
 * @route   POST /api/v1/bins/:id/detach-sensor
 * @access  Private (Owner, Admin, Collection Team)
 */
exports.detachSensor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  // Check permissions
  const canDetach = bin.owner.toString() === req.user.id ||
    req.user.roles.includes("ADMIN") ||
    req.user.roles.includes("COLLECTION_TEAM");

  if (!canDetach) {
    throw new PermissionDeniedError();
  }

  if (!bin.sensor) {
    throw new BadRequestError("No sensor attached to this bin");
  }

  // Update sensor
  const sensor = await Sensor.findById(bin.sensor);
  if (sensor) {
    sensor.bin = undefined;
    sensor.status = "INACTIVE";
    await sensor.save();
  }

  // Update bin
  bin.sensor = undefined;
  await bin.save();

  const populatedBin = await Bin.findById(bin._id)
    .populate("owner", "firstName lastName email phoneNumber");

  return handleResponse(res, 200, "Sensor detached successfully", populatedBin);
});

/**
 * @desc    Update bin fill level
 * @route   PUT /api/v1/bins/:id/fill-level
 * @access  Private (Collection Team, Admin)
 */
exports.updateFillLevel = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { fillLevel, weight } = req.body;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  if (fillLevel !== undefined) {
    if (fillLevel < 0 || fillLevel > 100) {
      throw new ValidationError("Fill level must be between 0 and 100");
    }
    bin.currentFillLevel = fillLevel;
  }

  if (weight !== undefined) {
    if (weight < 0) {
      throw new ValidationError("Weight must be a positive number");
    }
    bin.currentWeight = weight;
  }

  await bin.save();

  return handleResponse(res, 200, "Bin fill level updated successfully", bin);
});

/**
 * @desc    Add collection record to bin
 * @route   POST /api/v1/bins/:id/collection-record
 * @access  Private (Collection Team, Admin)
 */
exports.addCollectionRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { weight, fillLevel } = req.body;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  const collectionData = {
    weight,
    fillLevel: fillLevel || bin.currentFillLevel,
    collectedBy: req.user.id,
  };

  await bin.addCollectionRecord(collectionData);

  return handleResponse(res, 200, "Collection record added successfully", bin);
});

/**
 * @desc    Get my bins
 * @route   GET /api/v1/bins/my-bins
 * @access  Private (Resident, Business)
 */
exports.getMyBins = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, category } = req.query;

  let query = { owner: req.user.id, isDeleted: { $ne: true } };

  if (category) {
    query.category = category;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: { path: "sensor", select: "serialNumber type status batteryLevel" },
  };

  const bins = await Bin.paginate(query, options);

  return handleResponse(res, 200, "Your bins retrieved successfully", bins);
});

/**
 * @desc    Get full bins (above threshold)
 * @route   GET /api/v1/bins/full
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getFullBins = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, threshold = 80 } = req.query;

  const query = {
    currentFillLevel: { $gte: parseInt(threshold) },
    isActive: true,
    isDeleted: { $ne: true },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { currentFillLevel: -1 },
    populate: [
      { path: "owner", select: "firstName lastName email phoneNumber" },
      { path: "sensor", select: "serialNumber type status batteryLevel" },
    ],
  };

  const bins = await Bin.paginate(query, options);

  return handleResponse(res, 200, "Full bins retrieved successfully", bins);
});

/**
 * @desc    Get bins by category
 * @route   GET /api/v1/bins/category/:category
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getBinsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!Object.values(wasteCategories).includes(category)) {
    throw new ValidationError("Invalid waste category");
  }

  const query = {
    category,
    isActive: true,
    isDeleted: { $ne: true },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: "owner", select: "firstName lastName email phoneNumber" },
      { path: "sensor", select: "serialNumber type status batteryLevel" },
    ],
  };

  const bins = await Bin.paginate(query, options);

  return handleResponse(res, 200, `Bins in ${category} category retrieved successfully`, bins);
});

/**
 * @desc    Get bins near location
 * @route   GET /api/v1/bins/near
 * @access  Private (Collection Team, Operations Planner, Admin)
 */
exports.getBinsNearLocation = catchAsync(async (req, res, next) => {
  const { longitude, latitude, radius = 1000, page = 1, limit = 10 } = req.query;

  if (!longitude || !latitude) {
    throw new ValidationError("Longitude and latitude are required");
  }

  const query = {
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(radius),
      },
    },
    isActive: true,
    isDeleted: { $ne: true },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { currentFillLevel: -1 },
    populate: [
      { path: "owner", select: "firstName lastName email phoneNumber" },
      { path: "sensor", select: "serialNumber type status batteryLevel" },
    ],
  };

  const bins = await Bin.paginate(query, options);

  return handleResponse(res, 200, "Nearby bins retrieved successfully", bins);
});

/**
 * @desc    Delete bin (soft delete)
 * @route   DELETE /api/v1/bins/:id
 * @access  Private (Owner, Admin)
 */
exports.deleteBin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const bin = await Bin.findOne({ id, isDeleted: { $ne: true } });
  if (!bin) {
    throw new RecordNotFoundError("Bin");
  }

  // Check ownership or admin role
  if (bin.owner.toString() !== req.user.id && !req.user.roles.includes("ADMIN")) {
    throw new PermissionDeniedError();
  }

  // Detach sensor if attached
  if (bin.sensor) {
    const sensor = await Sensor.findById(bin.sensor);
    if (sensor) {
      sensor.bin = undefined;
      sensor.status = "INACTIVE";
      await sensor.save();
    }
  }

  // Soft delete
  bin.isDeleted = true;
  bin.isActive = false;
  await bin.save();

  return handleResponse(res, 200, "Bin deleted successfully");
});
