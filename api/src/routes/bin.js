const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validations/validate");
const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  attachSensor,
  detachSensor,
  updateFillLevel,
  addCollectionRecord,
  getMyBins,
  getFullBins,
  getBinsByCategory,
  getBinsNearLocation,
  deleteBin,
} = require("../controllers/bin");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const { roles } = require("../constants/commonConstants");

// Validation schemas for bin operations
const createBinValidator = [
  require("../validators/bin").createBinValidator,
];

const updateBinValidator = [
  require("../validators/bin").updateBinValidator,
];

const attachSensorValidator = [
  require("../validators/bin").attachSensorValidator,
];

const updateFillLevelValidator = [
  require("../validators/bin").updateFillLevelValidator,
];

const addCollectionRecordValidator = [
  require("../validators/bin").addCollectionRecordValidator,
];

// Public routes (with authentication)
router.use(authenticateUser());

// Routes for all authenticated users (docs provided in src/docs/binDocs.js)
router.get("/my-bins", getMyBins);

// Get bin by ID (docs: src/docs/binDocs.js)
router.get("/:id", getBinById);

// Create a new bin (docs: src/docs/binDocs.js)
router.post("/", createBinValidator, validate, createBin);

// Update bin (docs: src/docs/binDocs.js)
router.put("/:id", updateBinValidator, validate, updateBin);

// Attach sensor (docs: src/docs/binDocs.js)
router.post("/:id/attach-sensor", attachSensorValidator, validate, attachSensor);

// Detach sensor (docs: src/docs/binDocs.js)
router.post("/:id/detach-sensor", detachSensor);

// Delete bin (docs: src/docs/binDocs.js)
router.delete("/:id", deleteBin);

// Admin and staff routes
// Get all bins (admin/staff) (docs: src/docs/binDocs.js)
router.get("/", authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM, roles.OPERATIONS_PLANNER, roles.USER]), getAllBins);

// Add collection record (docs: src/docs/binDocs.js)
router.post("/:id/collection-record", addCollectionRecordValidator, validate, authorizeRoles([roles.ADMIN, roles.COLLECTION_TEAM]), addCollectionRecord);

module.exports = router;
