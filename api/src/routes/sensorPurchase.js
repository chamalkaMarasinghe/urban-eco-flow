// const express = require("express");
// const router = express.Router();
// const { authenticateUser } = require("../middlewares/authenticateUser");
// const { authorizeRoles } = require("../middlewares/authorizeRoles");
// const { roles } = require("../constants/commonConstants");
// const sensorPurchaseController = require("../controllers/sensorPurchase");

// // All routes require authentication
// router.use(authenticateUser);

// /**
//  * @route   POST /api/v1/sensors/purchase
//  * @desc    Purchase a sensor (auto-purchase without payment)
//  * @access  Private (Resident, Business)
//  */
// router.post(
//   "/purchase",
//   authorizeRoles(roles.RESIDENT, roles.BUSINESS),
//   sensorPurchaseController.purchaseSensor
// );

// /**
//  * @route   GET /api/v1/sensors/purchased
//  * @desc    Get user's purchased sensors
//  * @access  Private (Resident, Business)
//  */
// router.get(
//   "/purchased",
//   authorizeRoles(roles.RESIDENT, roles.BUSINESS),
//   sensorPurchaseController.getPurchasedSensors
// );

// module.exports = router;
