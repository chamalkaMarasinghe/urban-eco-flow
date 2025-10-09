const mongoose = require("mongoose");
const { sensorTypes, sensorStatus } = require("../constants/commonConstants");
const { getNewID } = require("../utils/genCustomID/getNewID");

/**
 * Sensor Schema for UrbanEcoFlow
 * Represents sensors/tags attached to waste bins for tracking
 */
const sensorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // required: true,
      // unique: true,
    },
    attachment: {
      type: String,
    },
    serialNumber: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
    type: {
      type: String,
      // required: true,
      enum: Object.values(sensorTypes),
      default: sensorTypes.FILL_LEVEL,
    },
    status: {
      type: String,
      // required: true,
      enum: Object.values(sensorStatus),
      default: sensorStatus.INACTIVE,
    },
    manufacturer: {
      type: String,
      // required: true,
      trim: true,
    },
    model: {
      type: String,
      // required: true,
      trim: true,
    },
    purchasePrice: {
      type: Number,
      // required: true,
      min: 0,
    },
    installationDate: {
      type: Date,
      required: false,
    },
    lastMaintenanceDate: {
      type: Date,
      required: false,
    },
    nextMaintenanceDate: {
      type: Date,
      required: false,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number], // [longitude, latitude]
    //     required: false,
    //   },
    //   address: {
    //     type: String,
    //     required: false,
    //     trim: true,
    //   },
    // },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    bin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin",
      required: false,
    },
    specifications: {
      batteryLife: {
        type: Number, // in months
        required: false,
      },
      operatingTemperature: {
        min: { type: Number, required: false },
        max: { type: Number, required: false },
      },
      accuracy: {
        type: Number, // percentage
        required: false,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
// sensorSchema.index({ "location.coordinates": "2dsphere" });
// sensorSchema.index({ serialNumber: 1 });
// sensorSchema.index({ owner: 1 });
// sensorSchema.index({ status: 1 });

// Pre-save middleware to generate ID
sensorSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNewID("Sensor");
  }
  next();
});

// Instance methods
sensorSchema.methods.updateBatteryLevel = function (newLevel) {
  if (newLevel >= 0 && newLevel <= 100) {
    this.batteryLevel = newLevel;
    return this.save();
  }
  throw new Error("Battery level must be between 0 and 100");
};

sensorSchema.methods.markAsFaulty = function () {
  this.status = sensorStatus.FAULTY;
  return this.save();
};

sensorSchema.methods.scheduleMaintenance = function (maintenanceDate) {
  this.nextMaintenanceDate = maintenanceDate;
  return this.save();
};

// Static methods
sensorSchema.statics.findByLocation = function (longitude, latitude, radius = 1000) {
  return this.find({
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius,
      },
    },
    isDeleted: { $ne: true },
  });
};

sensorSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId, isDeleted: { $ne: true } });
};

sensorSchema.statics.findFaultySensors = function () {
  return this.find({ status: sensorStatus.FAULTY, isDeleted: { $ne: true } });
};

sensorSchema.statics.findSensorsDueForMaintenance = function () {
  const today = new Date();
  return this.find({
    nextMaintenanceDate: { $lte: today },
    status: { $ne: sensorStatus.MAINTENANCE },
    isDeleted: { $ne: true },
  });
};

/**
 * Lightweight paginate implementation compatible with common usage in services.
 * Supports: page, limit, sort, populate (array or object)
 * Returns an object similar to mongoose-paginate-v2: { docs, totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage }
 */
sensorSchema.statics.paginate = async function (query = {}, options = {}) {
  const page = Math.max(parseInt(options.page || 1, 10), 1);
  const limit = Math.max(parseInt(options.limit || 10, 10), 1);
  const sort = options.sort || { createdAt: -1 };

  const skip = (page - 1) * limit;

  // Build the mongoose query
  let q = this.find(query).sort(sort).skip(skip).limit(limit);

  // Apply population if provided
  if (options.populate) {
    const pop = options.populate;
    if (Array.isArray(pop)) {
      pop.forEach((p) => q = q.populate(p));
    } else if (typeof pop === 'object') {
      q = q.populate(pop);
    }
  }

  // Execute both count and find in parallel
  const [docs, totalDocs] = await Promise.all([
    q.exec(),
    this.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalDocs / limit) || 1;

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
