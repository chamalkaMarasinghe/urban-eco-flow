import dayjs from "dayjs";
import { COMMON_FIELD_TYPES } from "../constants/fieldTypes";
import { errorMessages } from "../constants/frontendErrorMessages";

// NOTE: Ghana Phone Number Pattern
// const GHANA_PHONE_NUMBER_PATTERN = /^(?:\+233|0)[2356789]\d{8}$/;
// const GHANA_PHONE_NUMBER_PATTERN = /^\d{5,}$/;
const GHANA_PHONE_NUMBER_PATTERN = /^\+?[0-9\s\-().]{7,20}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;


// Validate MongoDB ObjectId format
export const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

// Validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return errorMessages.INVALID_EMAIL;
  return "";
};

// FUNCTION: Validate Phone Number
function validatePhone(phoneNumber) {
  // INFO: Ghana Mobile & Landline Numbers
  // Mobile: 10 digits, starting with 02X, 05X, or 024-059
  // Landline: 9 digits, starting with 03X

  if (!phoneNumber) {
    return errorMessages.REQUIRED_FIELD;
  } else if (!GHANA_PHONE_NUMBER_PATTERN.test(phoneNumber)) {
    return errorMessages.INVALID_PHONE_NUMBER;
  }

  return "";
}

// Validate email or phone number
const validateEmailOrPhone = (input) => {
  if (!input) {
    return errorMessages.REQUIRED_FIELD;
  } else if (validateEmail(input) === "") {
    // valid email
    return "";
  } else if (validatePhone(input) === "") {
    // valid phone number
    return "";
  }

  return errorMessages.INVALID_EMAIL_OR_PHONE; // invalid email or phone number
};

// Validate password
const validatePassword = (password) => {
  // const hasMinLength = password.length >= 8;
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
  //   return errorMessages.INVALID_PASSWORD;
  // }
  if (!PASSWORD_PATTERN.test(password)) return errorMessages.INVALID_PASSWORD;
  return "";
};

// FUNCTION: Validate number
const isValidNumber = (input) => {
  // Check if the input is of type "number" or can be converted to a valid number
  if (typeof input === "number" && !isNaN(input)) {
    return "";
  }
  if (
    typeof input === "string" &&
    !isNaN(parseFloat(input)) &&
    isFinite(input)
  ) {
    return "";
  }
  return errorMessages.INVALID_NUMBER;
};

// FUNCTION: Validate date
const isValidDate = (dateString) => {


  // If no date provided
  if (!dateString) return false;
  dateString = dayjs(dateString);

  // If it's a dayjs object, format it first
  if (dayjs.isDayjs(dateString)) {
    dateString = dateString.format("YYYY-MM-DD");
  }

  // Check format (YYYY-MM-DD)
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(dateString)) return false;

  // Parse the date parts
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a new Date object and verify the values
  const date = new Date(year, month - 1, day); // month is 0-based in JavaScript
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    year >= 1900 && // Reasonable minimum year
    year <= 2100 && // Reasonable maximum year
    date >= today // Ensure the date is not in the past
  );
};

// FUNCTION: Validate time
const isValidTime = (time) => {
  // Regex for 12-hour format (e.g., 01:30 AM, 12:45 PM)
  const twelveHourRegex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  
  // Regex for 24-hour format (e.g., 14:50, 00:15)
  const twentyFourHourRegex = /^([01]\d|2[0-3]):([0-5][0-9])$/;
  
  return twelveHourRegex.test(time) || twentyFourHourRegex.test(time);
};

// FUNCTION: Ghana Nic Number Validation - Format Should be like this GHA-XXXXXXXXX-X
function isValidGhanaIdNumber(pin) {
  // INFO:
  //  A three-letter country code (e.g., 'GHA' for Ghana),
  //  Followed by a hyphen,
  //  Nine digits,
  //  Another hyphen,
  //  And a single check digit.

  // // USAGE: Regular expression to match the Ghana Card PIN format
  // const pinRegex = /^GHA-\d{9}-\d$/;
  // return pinRegex.test(pin);

   // Check if the input is a string and has a minimum length of 1
  if (typeof pin !== "string" || pin.length < 1) {
    return false;
  }
}

// FUNCTION: Validate field
export const validateField = (name, type, value, formData, requiredFields) => {

  if (!type) return "Error";

  let error = "";
  const fieldType = typeof type === "object" ? type.type : type; // Extract actual type

  switch (fieldType) {

    case COMMON_FIELD_TYPES.REQUIRED_FIELD:
      if ((!value || value?.length < 1 || Object?.keys(value)?.length < 1) && requiredFields[name] ) error = errorMessages.REQUIRED_FIELD;
      break;

    case COMMON_FIELD_TYPES.BOOLEAN_FIELD:
      if (!value && value !== false && requiredFields[name])
        error = errorMessages.REQUIRED_FIELD;
      else if (
        !(!value && value !== false) &&
        !(value === false || value === true)
      )
        error = errorMessages.INVALID_OPTION;
      break;

    case COMMON_FIELD_TYPES.CHECKBOX:
      const normalized = value === true || value === "true" || value === 1 || value === "1" 
        ? true
        : value === false || value === 0 || value === "false" || value === "0" 
        ? false
        : null ;
        
      if(requiredFields[name] && normalized === false) {
        error = errorMessages.PRIVACY_CONCENT_ERROR;
      } else if (normalized === null) {
        error = errorMessages.INVALID_OPTION
      }
      break;

    case COMMON_FIELD_TYPES.NUMBER_FIELD:
      if (!value && value !== false && requiredFields[name])
        error = errorMessages.REQUIRED_FIELD;
      else if (value) error = isValidNumber(value);
      break;

    case COMMON_FIELD_TYPES.FIRST_NAME:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      break;

    case COMMON_FIELD_TYPES.LAST_NAME:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      break;

    case COMMON_FIELD_TYPES.EMAIL_FIELD:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      else if (value) error = validateEmail(value);
      break;

    case COMMON_FIELD_TYPES.PHONE:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      else if (value) error = validatePhone(value);
      break;

    case COMMON_FIELD_TYPES.PASSWORD_FIELD:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      else if (value) error = validatePassword(value);
      break;

    case COMMON_FIELD_TYPES.CONFIRM_PASSWORD:
      if (requiredFields[name]) {
        if (!value) {
          error = errorMessages.REQUIRED_FIELD;
        } else if (value !== formData.password) {
          error = errorMessages.PASSWORD_MISMATCH;
        }
      } else if (value) {
        if (value !== formData.password) {
          error = errorMessages.PASSWORD_MISMATCH;
        }
      }
      break;

    case COMMON_FIELD_TYPES.DROPDOWN:
      if ((!value || Object.keys(value).length === 0) && requiredFields[name]) {
        error = errorMessages.REQUIRED_FIELD;
      }
      //   else if (typeof value !== "object" || !value.hasOwnProperty("id"))
      //     error = errorMessages.INVALID_OPTION;
      break;

    case COMMON_FIELD_TYPES.DATE_PICKER:
      if (!value && requiredFields[name]) {
        error = errorMessages.REQUIRED_FIELD;
      } else if (value && !isValidDate(value)) {
        error = errorMessages.INVALID_DATE;
      }
      break;

    case COMMON_FIELD_TYPES.TIME_PICKER:
      if (!value && requiredFields[name]) error = errorMessages.REQUIRED_FIELD;
      else if (!isValidTime(value)) error = errorMessages.INVALID_TIME;
      break;

    case COMMON_FIELD_TYPES.ID_NUMBER:
      if (!value && requiredFields[name]) {
        error = errorMessages.REQUIRED_FIELD;
      } else if (isValidGhanaIdNumber(value)) {
        error = errorMessages.INVALID_ID_NUMBER;
      }
      break;

    case COMMON_FIELD_TYPES.EMAIL_OR_PHONE:
      if (!value && requiredFields[name]) {
        error = errorMessages.REQUIRED_FIELD;
      } else if (value) {
        error = validateEmailOrPhone(value);
      }
      break;

    default:
      break;
  }

  return error;
};
