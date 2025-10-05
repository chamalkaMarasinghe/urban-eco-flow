const mongoose = require("mongoose");
const { wasteCategories } = require("../constants/commonConstants");
const { getNewID } = require("../utils/genCustomID/getNewID");

/**
 * Bin Schema for UrbanEcoFlow
 * Represents waste bins that can have sensors attached
 */
const binSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      // unique: true,
    },
    binNumber: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    capacity: {
      type: Number, // in liters
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(wasteCategories),
      default: wasteCategories.GENERAL,
    },
    material: {
      type: String,
      required: true,
      trim: true,
      enum: ["plastic", "metal", "concrete", "wood"],
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      landmark: {
        type: String,
        required: false,
        trim: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: false,
    },
    installationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastCollectionDate: {
      type: Date,
      required: false,
    },
    collectionHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        weight: {
          type: Number,
          required: false,
        },
        fillLevel: {
          type: Number,
          required: false,
          min: 0,
          max: 100,
        },
        collectedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
      },
    ],
    currentFillLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    currentWeight: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Indexes
// binSchema.index({ "location.coordinates": "2dsphere" });
// binSchema.index({ binNumber: 1 });
// binSchema.index({ owner: 1 });
// binSchema.index({ category: 1 });
// binSchema.index({ isActive: 1 });

// Pre-save middleware to generate ID
binSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNewID("Bin");
  }
  next();
});

// Instance methods
binSchema.methods.updateFillLevel = function (fillLevel) {
  if (fillLevel >= 0 && fillLevel <= 100) {
    this.currentFillLevel = fillLevel;
    return this.save();
  }
  throw new Error("Fill level must be between 0 and 100");
};

binSchema.methods.updateWeight = function (weight) {
  if (weight >= 0) {
    this.currentWeight = weight;
    return this.save();
  }
  throw new Error("Weight must be a positive number");
};

binSchema.methods.addCollectionRecord = function (collectionData) {
  this.collectionHistory.push({
    date: new Date(),
    weight: collectionData.weight,
    fillLevel: collectionData.fillLevel,
    collectedBy: collectionData.collectedBy,
  });
  this.lastCollectionDate = new Date();
  this.currentFillLevel = 0;
  this.currentWeight = 0;
  return this.save();
};

binSchema.methods.attachSensor = function (sensorId) {
  this.sensor = sensorId;
  return this.save();
};

binSchema.methods.detachSensor = function () {
  this.sensor = undefined;
  return this.save();
};

// Static methods
binSchema.statics.findByLocation = function (longitude, latitude, radius = 1000) {
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

binSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId, isDeleted: { $ne: true } });
};

binSchema.statics.findFullBins = function (threshold = 80) {
  return this.find({
    currentFillLevel: { $gte: threshold },
    isActive: true,
    isDeleted: { $ne: true },
  });
};

binSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true, isDeleted: { $ne: true } });
};

const Bin = mongoose.model("Bin", binSchema);

module.exports = Bin;
