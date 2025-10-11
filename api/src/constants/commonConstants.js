
exports.environmentTypes = {
  DEV: "DEV",
  PROD: "PROD",
};

exports.roles = {
  USER: "USER",
  ADMIN: "ADMIN",
  RESIDENT: "RESIDENT",
  BUSINESS: "BUSINESS",
  COLLECTION_TEAM: "COLLECTION_TEAM",
  MAINTENANCE_CREW: "MAINTENANCE_CREW",
  OPERATIONS_PLANNER: "OPERATIONS_PLANNER",
};

exports.limitation = {
  FILES_LIMIT: 5,
  ID_LIMIT: 2,
};

exports.documentCounters = {
  THREAD: "Thread",
  OFFER: "Offer",
  ORDER: "Order",
  EVENT: "Event",
  PAYMENT: "Payment",
  REVISION: "Revision",
  COMPLAINT: "Complaint",
  BOOKING: "Booking",
  // REVIEW: "Review",
  USER: "User",
  PAYMENT_HISTORY: "PaymentHistory",
  SENSOR: "Sensor",
  COLLECTION_REQUEST: "CollectionRequest",
  BIN: "Bin",
  MAINTENANCE_REQUEST: "MaintenanceRequest"
};

exports.documentCountersMountingCount = 1000;
// exports.emailSenderNickName = "KIdsPlan Team";

exports.emailSendingActionTypes = {
  RESET_PASSWORD: "reset-password",
  CONTACT_FORM: "contact-form",
};

exports.types = {
  OTP_TOKEN: "otp_token",
};

exports.minutesTakenToExpireTheSigninOTP = 5;
exports.minutesTakenToExpireTheForgotPasswordToken = 6;

exports.threadStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

// UrbanEcoFlow specific constants
exports.sensorTypes = {
  FILL_LEVEL: "FILL_LEVEL",
  WEIGHT: "WEIGHT",
  TEMPERATURE: "TEMPERATURE",
  MULTI_SENSOR: "MULTI_SENSOR",
};

exports.sensorStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  FAULTY: "FAULTY",
  MAINTENANCE: "MAINTENANCE",
  RETIRED: "RETIRED",
};

exports.collectionRequestTypes = {
  NORMAL: "NORMAL",
  SPECIAL: "SPECIAL",
  BULKY_ITEMS: "BULKY_ITEMS",
  E_WASTE: "E_WASTE",
  HAZARDOUS: "HAZARDOUS",
  URGENT: "URGENT",
};

exports.collectionRequestStatus = {
  PENDING: "PENDING",
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
};

exports.paymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

exports.billingModels = {
  PAY_AS_YOU_THROW: "PAY_AS_YOU_THROW",
  FLAT_RATE: "FLAT_RATE",
};

exports.wasteCategories = {
  ORGANIC: "ORGANIC",
  RECYCLABLE: "RECYCLABLE",
  GENERAL: "GENERAL",
  HAZARDOUS: "HAZARDOUS",
  E_WASTE: "E_WASTE",
  BULKY: "BULKY",
};

exports.priorityLevels = {
  REGULAR: "REGULAR",
  SCHEDULED: "SCHEDULED",
  URGENT: "URGENT",
};