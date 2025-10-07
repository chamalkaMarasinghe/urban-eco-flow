const express = require("express");
const router = express.Router();
const {validate} = require("../utils/validations/validate");
const {
    signupAsUserValidator,
    signinValidator,
    verifyOTPValidator,
    forgotPasswordValidator,
    idTokenValidator,
    idTokenValidatorWithPassword,
    signInServiceProviderValidator,
    signupAsServiceProValidator
} = require("../validators/auth");
const {
    signupAsUser,
    signin,
    verifyOtp,
    forgotPassword,
    verifyUserForgot,
    changePassword,
    signinAdmin,
    signupAsServiceProvider,
    signinAsServiceProvider,
    forgotPasswordServicepro,
    verifyServiceproForgot,
    changePasswordServicepro,
    changePasswordUser,
    forgotPasswordUser, forgotPasswordAdmin, verifyAdminForgot, changePasswordAdmin,
    sendOTPForReset,
    verifyOTPForReset,
    resetPasswordWithOTP
} = require("../controllers/auth");
// const { authenticateUser } = require("../middlewares/authenticateUser");
// const { authorizeRoles } = require("../middlewares/authorizeRoles");
// const { authenticateWriter } = require("../middlewares/authenticateWriter");
const { roles } = require("../constants/commonConstants");

// allow any role ------------------------------------------

router.post("/signup/user", signupAsUserValidator, validate, signupAsUser);

router.post("/signin/user", signinValidator, validate, signin);

// NOTE: for user
router.post("/forgot-password/user", forgotPasswordValidator, validate, forgotPasswordUser);

router.get("/verify-forgot/user/:id/:token", idTokenValidator, validate, verifyUserForgot);

router.post("/change-password/user/:id/:token", idTokenValidatorWithPassword, validate, changePasswordUser);


module.exports = router;