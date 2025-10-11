const mongoose = require("mongoose");
const { 
  collectionRequestTypes, 
  collectionRequestStatus, 
  paymentStatus, 
  priorityLevels,
  wasteCategories 
} = require("../constants/commonConstants");
const { getNewID } = require("../utils/genCustomID/getNewID");

/**
 * Collection Request Schema for UrbanEcoFlow
 * Represents waste collection requests made by residents/businesses
 */
const collectionRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // required: true,
      // unique: true,
    },
    attachment: {
      type: String,
    },
    requestNumber: {
      type: String,
      // required: true,
      // unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(wasteCategories),
      default: wasteCategories.GENERAL,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(collectionRequestStatus),
      default: collectionRequestStatus.PENDING,
    },
    priority: {
      type: String,
      required: true,
      enum: Object.values(priorityLevels),
      default: priorityLevels.REGULAR,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin",
      required: false,
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
    wasteDetails: {
      category: {
        type: String,
        required: true,
        enum: Object.values(wasteCategories),
      },
      description: {
        type: String,
        required: false,
        trim: true,
      },
      estimatedWeight: {
        type: Number,
        required: false,
        min: 0,
      },
      estimatedVolume: {
        type: Number,
        required: false,
        min: 0,
      },
      specialInstructions: {
        type: String,
        required: false,
        trim: true,
      },
    },
    scheduledDate: {
      type: Date,
      required: false,
    },
    scheduledTimeSlot: {
      start: {
        type: String,
        required: false,
      },
      end: {
        type: String,
        required: false,
      },
    },
    collectionTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    collectionDetails: {
      actualWeight: {
        type: Number,
        required: false,
      },
      actualVolume: {
        type: Number,
        required: false,
      },
      collectionDate: {
        type: Date,
        required: false,
      },
      collectionTime: {
        type: Date,
        required: false,
      },
      notes: {
        type: String,
        required: false,
        trim: true,
      },
      images: [{
        type: String,
        required: false,
      }],
    },
    paymentDetails: {
      amount: {
        type: Number,
        required: false,
        min: 0,
      },
      status: {
        type: String,
        enum: Object.values(paymentStatus),
        default: paymentStatus.PENDING,
      },
      paymentMethod: {
        type: String,
        required: false,
        enum: ["credit_card", "debit_card", "mobile_money", "bank_transfer"],
      },
      transactionId: {
        type: String,
        required: false,
        trim: true,
      },
      paidAt: {
        type: Date,
        required: false,
      },
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
    notifications: [{
      type: {
        type: String,
        required: true,
        enum: ["sms", "email", "push"],
      },
      message: {
        type: String,
        required: true,
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["sent", "delivered", "failed"],
        default: "sent",
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
// collectionRequestSchema.index({ "location.coordinates": "2dsphere" });
// collectionRequestSchema.index({ requestNumber: 1 });
// collectionRequestSchema.index({ requester: 1 });
// collectionRequestSchema.index({ status: 1 });
// collectionRequestSchema.index({ type: 1 });
// collectionRequestSchema.index({ scheduledDate: 1 });
// collectionRequestSchema.index({ priority: 1 });

// Pre-save middleware to generate IDs
collectionRequestSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNewID("CollectionRequest");
  }
  // if (this.isNew && !this.requestNumber) {
  //   const timestamp = Date.now().toString().slice(-6);
  //   this.requestNumber = `CR${timestamp}`;
  // }
  next();
});

// Instance methods
collectionRequestSchema.methods.updateStatus = function (newStatus, updatedBy) {
  this.status = newStatus;
  if (updatedBy) {
    this.collectionTeam = updatedBy;
  }
  return this.save();
};

collectionRequestSchema.methods.scheduleCollection = function (date, timeSlot) {
  this.status = collectionRequestStatus.SCHEDULED;
  this.scheduledDate = date;
  this.scheduledTimeSlot = timeSlot;
  return this.save();
};

collectionRequestSchema.methods.completeCollection = function (collectionData) {
  this.status = collectionRequestStatus.COMPLETED;
  this.collectionDetails = {
    ...this.collectionDetails,
    ...collectionData,
    collectionDate: new Date(),
    collectionTime: new Date(),
  };
  return this.save();
};

collectionRequestSchema.methods.addNotification = function (notificationData) {
  this.notifications.push(notificationData);
  return this.save();
};

collectionRequestSchema.methods.addAttachment = function (attachmentData) {
  this.attachments.push(attachmentData);
  return this.save();
};

collectionRequestSchema.methods.processPayment = function (paymentData) {
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentData,
    paidAt: new Date(),
  };
  return this.save();
};

// Static methods
collectionRequestSchema.statics.findByRequester = function (requesterId) {
  return this.find({ requester: requesterId, isDeleted: { $ne: true } })
    .sort({ createdAt: -1 });
};

collectionRequestSchema.statics.findByStatus = function (status) {
  return this.find({ status, isDeleted: { $ne: true } })
    .sort({ priority: 1, createdAt: 1 });
};

collectionRequestSchema.statics.findByType = function (type) {
  return this.find({ type, isDeleted: { $ne: true } })
    .sort({ createdAt: -1 });
};

collectionRequestSchema.statics.findByLocation = function (longitude, latitude, radius = 5000) {
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

collectionRequestSchema.statics.findPendingRequests = function () {
  return this.find({ 
    status: collectionRequestStatus.PENDING, 
    isDeleted: { $ne: true } 
  }).sort({ priority: 1, createdAt: 1 });
};

collectionRequestSchema.statics.findScheduledForDate = function (date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    scheduledDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: collectionRequestStatus.SCHEDULED,
    isDeleted: { $ne: true },
  }).sort({ scheduledTimeSlot: 1 });
};

collectionRequestSchema.statics.findUrgentRequests = function () {
  return this.find({
    priority: priorityLevels.URGENT,
    status: { $in: [collectionRequestStatus.PENDING, collectionRequestStatus.SCHEDULED] },
    isDeleted: { $ne: true },
  }).sort({ createdAt: 1 });
};

/**
 * Lightweight paginate implementation compatible with common usage in services.
 * Supports: page, limit, sort, populate (array or object)
 * Returns an object similar to mongoose-paginate-v2: { docs, totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage }
 */
collectionRequestSchema.statics.paginate = async function (query = {}, options = {}) {
  const page = Math.max(parseInt(options.page || 1, 10), 1);
  const limit = Math.max(parseInt(options.limit || 10, 10), 1);
  const sort = options.sort || { createdAt: -1 };

  const skip = (page - 1) * limit;

  let q = this.find(query).sort(sort).skip(skip).limit(limit);

  if (options.populate) {
    const pop = options.populate;
    if (Array.isArray(pop)) {
      pop.forEach((p) => q = q.populate(p));
    } else if (typeof pop === 'object') {
      q = q.populate(pop);
    }
  }

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

const CollectionRequest = mongoose.model("CollectionRequest", collectionRequestSchema);

module.exports = CollectionRequest;
