const mongoose = require("mongoose");
const { getNewID } = require("../utils/genCustomID/getNewID");

/**
 * Maintenance Request Schema for UrbanEcoFlow
 * Represents maintenance requests for sensors, bins, or other equipment
 */
const maintenanceRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    requestNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["sensor_repair", "sensor_replacement", "bin_repair", "bin_replacement", "general_maintenance"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "assigned", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    equipment: {
      sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        required: false,
      },
      bin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bin",
        required: false,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
      address: {
        type: String,
        required: false,
        trim: true,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    issueDetails: {
      symptoms: {
        type: String,
        required: false,
        trim: true,
      },
      errorCode: {
        type: String,
        required: false,
        trim: true,
      },
      lastWorkingDate: {
        type: Date,
        required: false,
      },
    },
    scheduledDate: {
      type: Date,
      required: false,
    },
    completedDate: {
      type: Date,
      required: false,
    },
    resolution: {
      type: String,
      required: false,
      trim: true,
    },
    partsUsed: [{
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      cost: {
        type: Number,
        required: false,
        min: 0,
      },
    }],
    totalCost: {
      type: Number,
      required: false,
      min: 0,
    },
    attachments: [{
      filename: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
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
// maintenanceRequestSchema.index({ requestNumber: 1 });
// maintenanceRequestSchema.index({ requester: 1 });
// maintenanceRequestSchema.index({ assignedTo: 1 });
// maintenanceRequestSchema.index({ status: 1 });
// maintenanceRequestSchema.index({ type: 1 });
// maintenanceRequestSchema.index({ priority: 1 });
// maintenanceRequestSchema.index({ "location.coordinates": "2dsphere" });

// Pre-save middleware to generate IDs
maintenanceRequestSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNewID("MaintenanceRequest");
  }
  if (this.isNew && !this.requestNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.requestNumber = `MR${timestamp}`;
  }
  next();
});

// Instance methods
maintenanceRequestSchema.methods.assignTo = function (maintenanceCrewId) {
  this.assignedTo = maintenanceCrewId;
  this.status = "assigned";
  return this.save();
};

maintenanceRequestSchema.methods.startWork = function () {
  this.status = "in_progress";
  return this.save();
};

maintenanceRequestSchema.methods.completeMaintenance = function (resolutionData) {
  this.status = "completed";
  this.completedDate = new Date();
  this.resolution = resolutionData.resolution;
  this.partsUsed = resolutionData.partsUsed || [];
  this.totalCost = resolutionData.totalCost || 0;
  return this.save();
};

maintenanceRequestSchema.methods.addAttachment = function (attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

// Static methods
maintenanceRequestSchema.statics.findByRequester = function (requesterId) {
  return this.find({ requester: requesterId, isDeleted: { $ne: true } })
    .sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByStatus = function (status) {
  return this.find({ status, isDeleted: { $ne: true } })
    .sort({ priority: 1, createdAt: 1 });
};

maintenanceRequestSchema.statics.findByAssignedTo = function (assignedToId) {
  return this.find({ assignedTo: assignedToId, isDeleted: { $ne: true } })
    .sort({ priority: 1, createdAt: 1 });
};

maintenanceRequestSchema.statics.findPendingRequests = function () {
  return this.find({ 
    status: "pending", 
    isDeleted: { $ne: true } 
  }).sort({ priority: 1, createdAt: 1 });
};

maintenanceRequestSchema.statics.findUrgentRequests = function () {
  return this.find({
    priority: "urgent",
    status: { $in: ["pending", "assigned", "in_progress"] },
    isDeleted: { $ne: true },
  }).sort({ createdAt: 1 });
};

const MaintenanceRequest = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);

module.exports = MaintenanceRequest;
