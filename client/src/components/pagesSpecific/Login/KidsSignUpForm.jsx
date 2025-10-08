import { useState } from "react";
import CustomInput from "../../Reusable/Input"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import CustomButton from "../../Reusable/CustomButton"
import { COMMON_FIELD_TYPES } from "../../../constants/fieldTypes";
import {
  closeSignInModal,
  resetPassword,
  signin,
  signup,
  startDataRefresh,
  updatePassword,
  validateToken,
} from "../../../store"
import { useThunk } from "../../../hooks/useThunk";
import { useCurrentLocation } from "../../../context/location/location";
import showToast from "../../../utils/toastNotifications";

import { IoArrowBackCircleSharp } from "react-icons/io5";
import { AUTH_POPUP_VARIANTS } from "../../../constants/commonConstants";
import { useDispatch, useSelector } from "react-redux";
import {validateField} from "../../../utils/validationUtils";
import { useLanguage } from "../../../context/language/language";

const KidsSignUpForm = ({ handlers, variant }) => {
  const {language} = useLanguage();
  const authPopupContentMap = {
    [AUTH_POPUP_VARIANTS.REGISTER]: {
      title: "Register Account",
      subtitle: "Create Your Account",
      footerText: "Already have an account?",
      footerAction: "Sign In",
      footerActionHandler: "switchToSignIn",
      formConfig: {
        showFirstName: true,
        showLastName: true,
        showPhone: true,
        showPassword: true,
        showConfirmPassword: true,
        showEmail: true,
        buttonText: "Sign Up",
        layout: "grid-cols-2",
      },
    },
    [AUTH_POPUP_VARIANTS.SIGNIN]: {
      title: "Sign In",
      subtitle: "Sign in to your account",
      footerText: "Don't have an account?",
      footerAction: "Sign Up",
      footerActionHandler: "switchToRegister",
      forgotPasswordHandler: "switchToForgotPassword",
      formConfig: {
        showFirstName: false,
        showLastName: false,
        showPhone: false,
        showPassword: true,
        showConfirmPassword: false,
        showEmail: true,
        buttonText: "Sign In",
        layout: "grid-cols-1",
      },
    },
    [AUTH_POPUP_VARIANTS.FORGOT_PASSWORD]: {
      title: "Reset Your Password",
      subtitle: "Enter your email address and we'll send you a link to reset your password.",
      footerText: "Back to Sign In?",
      footerAction: "Sign In",
      footerActionHandler: "switchToSignIn",
      formConfig: {
        showFirstName: false,
        showLastName: false,
        showPhone: false,
        showPassword: false,
        showConfirmPassword: false,
        showEmail: true,
        buttonText: "Request Link",
        layout: "grid-cols-1",
      },
    },
    [AUTH_POPUP_VARIANTS.RESET_PASSWORD]: {
      title: "Set New Password",
      subtitle: "Create a new secure password",
      footerText: "Back to Sign in?",
      footerAction: "Sign In",
      footerActionHandler: "switchToSignIn",
      formConfig: {
        showFirstName: false,
        showLastName: false,
        showPhone: false,
        showPassword: true,
        showConfirmPassword: true,
        showEmail: false,
        buttonText: "Reset Password",
        layout: "grid-cols-1",
      },
    },
  };

  const content = authPopupContentMap[variant];

  const dynamicRequiredFields = {
    firstName: !!content.formConfig.showFirstName,
    lastName: !!content.formConfig.showLastName,
    email: !!content.formConfig.showEmail,
    phoneNumber: !!content.formConfig.showPhone,
    password: !!content.formConfig.showPassword,
    confirmPassword: !!content.formConfig.showConfirmPassword,
    terms: variant === AUTH_POPUP_VARIANTS.REGISTER,
    rememberMe: false,
  };

  const navigate = useNavigate();
  const currentLocation = useCurrentLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { resetId, resetToken } = useSelector((state) => state.auth);

  // NOTE: Custom Hooks
  const [doSignUp, isSigninUp, signUpError] = useThunk(signup);
  const [doSignIn, isSignIn, signInError] = useThunk(signin);

  const [doResetPassword, isResettingPassword, resetPasswordError] =
    useThunk(resetPassword);
  const [doValidateToken, isValidatingToken, validateTokenError] =
    useThunk(validateToken);
  const [doUpdatePassword, isUpdatingPassword, updatePasswordError] =
    useThunk(updatePassword);

  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateForm,
    setTouched,
    setFormData,
    clearError,
    clearAllErrors,
  } = useForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
      rememberMe: false,
    },
    dynamicRequiredFields,
    {
      firstName: COMMON_FIELD_TYPES.REQUIRED_FIELD,
      lastName: COMMON_FIELD_TYPES.REQUIRED_FIELD,
      email: COMMON_FIELD_TYPES.EMAIL_FIELD,
      phoneNumber: COMMON_FIELD_TYPES.PHONE,
      password: COMMON_FIELD_TYPES.PASSWORD_FIELD,
      confirmPassword: COMMON_FIELD_TYPES.CONFIRM_PASSWORD,
      terms: COMMON_FIELD_TYPES.CHECKBOX,
      rememberMe: COMMON_FIELD_TYPES.CHECKBOX,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(dynamicRequiredFields);

    if (validateForm()) {
      let result;
      try {
        switch (variant) {
          case AUTH_POPUP_VARIANTS.SIGNIN:
            result = await doSignIn({ ...formData, longitude: currentLocation?.longitude, latitude: currentLocation?.latitude });
            if (result?.success) {
              localStorage.setItem("token", result?.response?.data?.token);
              showToast("success", "Sign in Successful");
              dispatch(closeSignInModal());
              window.dispatchEvent(new CustomEvent("auth-state-changed"));
            } else {
              showToast("error", result?.error?.message);
            }
            break;

          case AUTH_POPUP_VARIANTS.REGISTER:
            result = await doSignUp(formData);
            if (result?.success) {
              localStorage.setItem("token", result?.response?.data?.token);
              showToast("success", "Sign in Successful");
              dispatch(closeSignInModal());
              window.dispatchEvent(new CustomEvent("auth-state-changed"));
            } else {
              showToast("error", result?.error?.message);
            }
            break;

          case AUTH_POPUP_VARIANTS.FORGOT_PASSWORD:
            result = await doResetPassword(formData);
            if (result?.success) {
              showToast("success", "Password reset link sent to your email");
            } else {
              showToast(
                  "error",
                  result?.error?.message || "Password reset failed"
              );
            }
            dispatch(closeSignInModal());
            break;

          case AUTH_POPUP_VARIANTS.RESET_PASSWORD:
            result = await doValidateToken({ id: resetId, token: resetToken });
            if (result?.success) {
              result = await doUpdatePassword({
                id: resetId,
                token: resetToken,
                data: {
                  password: formData.password,
                },
              });

              if (result?.success) {
                showToast("success", "Password updated successfully");
                navigate("/", { replace: true });
                handlers["switchToSignIn"]();
              } else {
                showToast(
                    "error",
                    result?.error?.message || "Password update failed"
                );
              }
            } else {
              showToast("error", "Token validation failed");
            }
            break;

          default:
            result = new Error("Invalid variant");
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        showToast("error", error.message || "Something went wrong");
      }
    } else {
      // Always directly validate the "terms" field for the latest value
      const termsError = validateField(
          "terms",
          COMMON_FIELD_TYPES.CHECKBOX,
          formData.terms,
          formData,
          dynamicRequiredFields
      );
      if (termsError) {
        showToast("error", termsError);
      } else {
        showToast('error', "Please validate the necessary Information");
      }
    }
  };

  return (
    <div
      className={
        variant === AUTH_POPUP_VARIANTS.REGISTER
          ? `relative w-[542px] h-full flex flex-col gap-3 sm:gap-6`
          : variant === AUTH_POPUP_VARIANTS.FORGOT_PASSWORD
          ? `relative w-[542px] min-h-[311px] flex flex-col gap-3 sm:gap-6`
          : `relative w-[542px] min-h-[400px] flex flex-col gap-3 sm:gap-6`
      }
    >
      {/* Header Section */}
      <div className="w-full h-[67px] flex justify-center items-center flex-col gap-2">
        <h1 className="font-roboto font-semibold sm:text-[32px] text-2xl leading-[33.6px] align-middle tracking-[0%] text-[#000000] mb-0">
          {content.title}
        </h1>
        <h1 className="font-roboto font-normal text-[14px] leading-[25px] align-middle tracking-[0%] text-[#5C5F6A] mb-0">
          {content.subtitle}
        </h1>
        {variant === AUTH_POPUP_VARIANTS.REGISTER && (
            <span className="font-roboto font-normal text-[11px] leading-[18px] align-middle tracking-[0%] text-[#5C5F6A]">
              (All Fields are required)
            </span>
        )}
      </div>

      {/* Form Container with flex-1 to take remaining space */}
      <form className="flex flex-col justify-between flex-1 pt-2 sm:pt-0">
        {/* Form Fields Section */}
        <div className="flex flex-col justify-start flex-1">
          <div
            className={`grid sm:${content.formConfig.layout} gap-y-3 sm:gap-y-6 gap-x-4`}
          >
            {content.formConfig.showFirstName && (
              <CustomInput
                placeholder="Enter your first name"
                type="text"
                name="firstName"
                value={formData.firstName}
                error={touched.firstName && errors.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName", formData.firstName)}
                onFocus={() => clearError("firstName")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
              />
            )}

            {content.formConfig.showLastName && (
              <CustomInput
                placeholder="Enter your last name"
                type="text"
                name="lastName"
                value={formData.lastName}
                error={touched.lastName && errors.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName", formData.lastName)}
                onFocus={() => clearError("lastName")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] border bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
              />
            )}

            {content.formConfig.showEmail && (
              <CustomInput
                placeholder="Enter your Email"
                type="email"
                name="email"
                value={formData.email}
                error={touched.email && errors.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email", formData.email)}
                onFocus={() => clearError("email")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] border bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
              />
            )}

            {content.formConfig.showPhone && (
              <CustomInput
                placeholder="Enter your phone number"
                type="text"
                name="phone"
                value={formData.phoneNumber}
                error={touched.phoneNumber && errors.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                onBlur={() => handleBlur("phoneNumber", formData.phoneNumber)}
                onFocus={() => clearError("phoneNumber")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
              />
            )}

            {content.formConfig.showPassword && (
              <CustomInput
                placeholder="Enter your Email" // Note: This should likely be "Enter your password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                error={touched.password && errors.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleBlur("password", formData.password)}
                onFocus={() => clearError("password")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] border bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute border-l-2 pl-3 border-[#CFD9E0] right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <AiFillEye size={24} className="text-[#5C5F6A]" />
                    ) : (
                      <AiFillEyeInvisible
                        size={24}
                        className="text-[#5C5F6A]"
                      />
                    )}
                  </button>
                }
              />
            )}

            {content.formConfig.showConfirmPassword && (
              <CustomInput
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                onBlur={() =>
                  handleBlur("confirmPassword", formData.confirmPassword)
                }
                onFocus={() => clearError("confirmPassword")}
                className="font-roboto h-[32px] sm:h-[40px] px-3 py-[6px] rounded-[4px] bg-primary-light/30 text-[#5C5F6A] placeholder:font-roboto placeholder:font-normal sm:placeholder:text-base placeholder:text-[15px] placeholder:text-[#33415580]"
                labelStyle="font-inter font-medium sm:text-[16px] text-dark"
                isRequired={true}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute border-l-2 pl-3 border-[#CFD9E0] right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <AiFillEye size={24} className="text-[#5C5F6A]" />
                    ) : (
                      <AiFillEyeInvisible
                        size={24}
                        className="text-[#5C5F6A]"
                      />
                    )}
                  </button>
                }
              />
            )}
          </div>

          {/* Remember Me and Forgot Password for Sign In */}
          {variant === AUTH_POPUP_VARIANTS.SIGNIN && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <CustomInput
                    name="rememberMe"
                    type="checkbox"
                    value={formData.rememberMe}
                    onChange={(e) =>
                      handleInputChange("rememberMe", e.target.checked)
                    }
                    onBlur={() => handleBlur("rememberMe", formData.rememberMe)}
                    onFocus={() => clearError("rememberMe")}
                    className="h-[13px] w-[13px] accent-primary"
                    label="Remember Me"
                    labelStyle="font-roboto text-[14px] font-normal text-[#334155]"
                    inlineCheckbox={true}
                  />
                </div>
              </div>
              <div>
                <Link
                  onClick={() => {
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                      password: "",
                      confirmPassword: "",
                      terms: false,
                    });
                    clearAllErrors();
                    handlers[content.forgotPasswordHandler]();
                  }}
                  className="cursor-pointer text-primary font-medium font-roboto text-[14px] leading-[24px] align-middle tracking-[-1.1%]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}

          {/* Terms and Conditions for Register */}
          {variant === AUTH_POPUP_VARIANTS.REGISTER && (
            <div className="flex justify-end mt-4">
              <CustomInput
                name="terms"
                type="checkbox"
                value={formData.terms}
                error={touched.terms && errors.terms}
                onChange={(e) => {
                  handleInputChange("terms", e.target.checked);
                }}
                onBlur={() => handleBlur("terms", formData.terms)}
                onFocus={() => clearError("terms")}
                className="h-[13px] w-[13px] accent-primary"
                label={
                  <span className="font-roboto text-[14px] font-normal">
                    <span className="text-[#334155]">I agree to the </span>
                    <span className="text-primary">Privacy Policy</span>
                  </span>
                }
                labelStyle="font-roboto font-normal text-sm leading-[18px] tracking-normal text-[#334155]"
                inlineCheckbox={true}
                isFilterSearch={true}
              />
            </div>
          )}
        </div>

        {/* Bottom Section - Button and Footer Link */}
        <div className="flex flex-col gap-4 mt-6">
          <CustomButton
            type="submit"
            className="h-[43px] font-roboto bg-primary text-white sm:text-[16px] text-[15px] align-middle leading-[22.5px] rounded-[5px] gap-[10px] px-[30px] py-[10px]"
            buttonText={content.formConfig.buttonText}
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            textWeight="font-semibold"
            onClick={handleSubmit}
            loaderColor="white"
            loading={
              isSigninUp ||
              isSignIn ||
              isResettingPassword ||
              isValidatingToken ||
              isUpdatingPassword
            }
            disabled={
              isSigninUp ||
              isSignIn ||
              isResettingPassword ||
              isValidatingToken ||
              isUpdatingPassword ||
              (variant === AUTH_POPUP_VARIANTS.FORGOT_PASSWORD && errors?.email?.length > 0) || (variant === AUTH_POPUP_VARIANTS.FORGOT_PASSWORD && formData?.email?.length < 1)
            }
          />

          <div className="flex justify-center font-roboto sm:text-[14px] text-[12px]">
            <p className="text-[#5C5F6A]">
              {content.footerText}{" "}
              <Link
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    confirmPassword: "",
                    terms: false,
                  });
                  clearAllErrors();
                  handlers[content.footerActionHandler]();
                }}
                className="underline cursor-pointer text-primary"
              >
                {content.footerAction}
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KidsSignUpForm;