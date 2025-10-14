const { default: mongoose, Mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/errors/catchAsync");
const User = require("../models/user");
const handleResponse = require("../utils/response/response");
const sendMail = require("../utils/email/sendEmail");
const {
  roles,
  types,
  emailSendingActionTypes,
  minutesTakenToExpireTheSigninOTP,
  rolesForInquiry,
  documentCounters,
} = require("../constants/commonConstants");
// const { COMMON_ERRORS, NOT_FOUND, FAILURES, INVALID_STATUS, INVALID } = require("../constants/errorMessages");
// const passport = require("../config/passportConfig");
// const { transporter } = require("../config/nodeMailer");
// const sendMail = require("../utils/sendEmail");
// const { getCookieOption } = require("../config/cookie");
const { getNewID } = require("../utils/genCustomID/getNewID");
const currentEnvironment = require("../config/environmentConfig");
const {
  DuplicateRecordsError,
  FailureOccurredError,
  RecordNotFoundError,
  PasswordMismatchError,
  UnauthorizedError,
  TokenError,
  ActionNotAllowedError,
  BadRequestError,
} = require("../utils/errors/CustomErrors");
const ServiceProvider = require("../models/serviceProvider");
// const { getUserInSignInWithDistanceWishlist } = require("../queries/event");
const JWT_SECRET = currentEnvironment.JWT_SECRET;
const SIGNIN_OTP_VERIFICATION = currentEnvironment.SIGNIN_OTP_VERIFICATION;

// NOTE: user
exports.signupAsUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, serviceType, filteredAddresses } = req.body;

  const userRoles = [`${roles.USER}`];

  const existingUser = await User.findOne({
    $or: [
      { email: email?.toString()?.toLowerCase() },
      { phoneNumber: { $eq: phoneNumber } },
    ],
  });

  if (existingUser)
    return next(new DuplicateRecordsError("Email Or Phone Number"));

  const newId = await getNewID(documentCounters.USER);

  if (!newId) {
    return next(new FailureOccurredError("ID Generation"));
  }

  const user = new User({
    id: newId,
    firstName,
    lastName,
    phoneNumber: phoneNumber,
    roles: userRoles,
    email: email?.toString()?.toLowerCase(),
    password,
    scope: serviceType?.toUpperCase(),
    filteredAddresses
  });

  const newUser = await user.save();

  if (!newUser) return next(new FailureOccurredError("User Registeration"));

  const details = {
    _id: newUser._id,
    roles: newUser.roles,
  };

  const accessToken = jwt.sign(details, JWT_SECRET, {
    expiresIn: "1h",
  });

  const userData = {
    _id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    phoneNumber: newUser?.phoneNumber,
    email: newUser?.email,
  };

  return handleResponse(res, 201, "Signed up Successfully", {
    token: accessToken,
    userData,
  });
});

exports.signin = catchAsync(async (req, res, next) => {

  const { email, password, longitude, latitude } = req.body;
  
  const user = await User.findOne({$or: [{ email: email?.toString()?.toLowerCase() }, { phoneNumber: email }]});  
  
  if (!user || user?.isDeleted) {
    return next(new RecordNotFoundError("User"));
  }

  const match = await user.comparePassword(password);

  if (!match) {
    return next(new PasswordMismatchError());
  }

  const details = {
    _id: user._id,
    roles: user.roles,
  };

  const accessToken = jwt.sign(details, JWT_SECRET, {
    expiresIn: "1h",
  });

  userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user?.phoneNumber,
    email: user?.email,
    profilePicture: user?.profilePicture,
    wishList: user?.wishList || [],
  };
  return handleResponse(res, 200, "Signed-in Successfully", {
    token: accessToken,
    OTP: false,
    userData,
  });
});

// NOTE: for user
exports.forgotPasswordUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    $or: [{ email: email?.toString()?.toLowerCase() }, { phoneNumber: email }],
  });

  if (!user || user?.isDeleted) {
    return next(new RecordNotFoundError("User"));
  }

  const token = await user.getVerifyToken();

  if (!token || token === "") throw new FailureOccurredError("Reset Password");

  await sendMail(
    user.email,
    "Reset Your Password",
    {
      topic: `Hi ${user?.firstName || ""} ${user?.lastName || ""}`,
      content: `${currentEnvironment.CLIENT}/?isReset=${true}&id=${
        user._id
      }&token=${token}`,
    },
    emailSendingActionTypes.RESET_PASSWORD
  );

  return handleResponse(
    res,
    201,
    "Password Reset Link Sent To Your Email Successfully"
  );
});

exports.verifyUserForgot = catchAsync(async (req, res, next) => {
  const { id, token } = req.params;

  const user = await User.findById(id);

  if (!user || user?.isDeleted) {
    return next(new RecordNotFoundError("User"));
  }

  const verified = await user.verify(token);

  if (!(verified === true)) {
    return next(new FailureOccurredError("Token Verification"));
  }

  userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user?.phoneNumber,
    email: user.email,
    profilePicture: user?.profilePicture,
    jobTitle: user?.jobTitle,
    location: user?.location,
    taskerRequestedAndStillNotVerified:
      user?.taskerRequestedAndStillNotVerified,
    isSuspended: user?.isSuspended,
  };

  return handleResponse(res, 200, "Token verified", userData);
});

exports.changePasswordUser = catchAsync(async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);

  if (!user || user?.isDeleted) {
    return next(new RecordNotFoundError("User"));
  }

  const verified = await user.verify(token);

  if (!(verified === true)) {
    return next(new FailureOccurredError("Token Verification"));
  }

  user.password = password;
  /* clearToken function will update the User Object with updated password*/
  const updatedUser = await user.clearToken({});

  if (!updatedUser) {
    return new FailureOccurredError("Reset Password");
  }

  userData = {
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    phoneNumber: updatedUser?.phoneNumber,
    email: updatedUser.email,
    profilePicture: updatedUser?.profilePicture,
    jobTitle: updatedUser?.jobTitle,
    location: updatedUser?.location,
    taskerRequestedAndStillNotVerified:
      updatedUser?.taskerRequestedAndStillNotVerified,
    isSuspended: user?.isSuspended,
  };

  return handleResponse(res, 200, "Password updated successfully", userData);
});