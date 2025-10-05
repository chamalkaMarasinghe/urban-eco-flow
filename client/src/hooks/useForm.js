import { useState } from "react";
import { COMMON_FIELD_TYPES } from "../constants/fieldTypes";
import { validateField } from "../utils/validationUtils";
import { errorMessages } from "../constants/frontendErrorMessages"

const useForm = (initialValues = {}, requiredFields = {}, inputTypes = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouchedState] = useState({});

  const handleInputChange = (name, value) => {
    let updatedValue = value;

    console.log("Before Update:", name, value);

    // Handle dropdown selections - FIXED: Don't convert objects to strings for dropdown
    if (
        inputTypes[name]?.type === COMMON_FIELD_TYPES.DROPDOWN &&
        typeof value === "object" &&
        value !== null
    ) {
      // Keep the full object for dropdowns that expect objects
      updatedValue = value;
    } else if (
        inputTypes[name] === COMMON_FIELD_TYPES.DROPDOWN &&
        typeof value === "object" &&
        value !== null
    ) {
      // Keep the full object for dropdowns that expect objects
      updatedValue = value;
    }

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: updatedValue };

      console.log('newFormData', newFormData);

      // Clear error when value changes (don't validate on change, only on blur)
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));

      return newFormData;
    });
  };

  const handleBlur = (name, value) => {
    console.log("On Blur:", name, value);

    let sanitizedValue = typeof value === "boolean" ? value : value?.trim() || value;

    // For dropdown fields, use the current formData value if no value provided
    if (inputTypes[name] === COMMON_FIELD_TYPES.DROPDOWN && !value && formData[name]) {
      sanitizedValue = formData[name];
    }

    // Sanitizing the date input
    if (inputTypes[name] === COMMON_FIELD_TYPES.DATE_PICKER) {
      sanitizedValue = sanitizedValue ? new Date(sanitizedValue)?.toISOString()?.split("T")[0] : "";
    }

    // Sanitizing the time input
    if (inputTypes[name] === COMMON_FIELD_TYPES.TIME_PICKER && sanitizedValue) {
      // Ensure the time is in the correct format: 'hh:mm AM/PM'
      const [hourMinute, period] = sanitizedValue.split(" ");

      if (hourMinute && period) {
        const [hour, minute] = hourMinute.split(":");
        const sanitizedHour = hour?.padStart(2, "0");
        const sanitizedMinute = minute?.padStart(2, "0");
        sanitizedValue = `${sanitizedHour}:${sanitizedMinute} ${period.toUpperCase()}`;
      }
    }

    // Only update formData if the value actually changed or if it's not a dropdown
    if (inputTypes[name] !== COMMON_FIELD_TYPES.DROPDOWN || sanitizedValue !== formData[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }

    setTouchedState((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate the field on blur using the current or updated value
    const valueToValidate = inputTypes[name] === COMMON_FIELD_TYPES.DROPDOWN && formData[name] ? formData[name] : sanitizedValue;

    let error = validateField(
        name,
        inputTypes[name],
        valueToValidate,
        { ...formData, [name]: valueToValidate }, // Use updated formData for validation
        requiredFields
    );

    console.log("Validation error for", name, ":", error);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Function to clear errors on focus
  const clearError = (name) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Function to clear all errors on focus at once
  const clearAllErrors = () => {
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {

      newErrors[key] = validateField(
          key,
          inputTypes[key],
          typeof formData[key] === "string" ? formData[key]?.trim() : formData[key],
          formData,
          requiredFields
      );

    });

    console.log("Form validation errors:", newErrors);

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    clearError,
    validateForm,
    setTouched: setTouchedState,
    setErrors,
    clearAllErrors,
    setFormData,
  };
};

export default useForm;
