import { useState } from "react";
import CustomInput from "../Form/Input";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import CustomButton from "../Form/CustomButton";
import { COMMON_FIELD_TYPES } from "../../../constants/fieldTypes";
import { signup } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import showToast from "../../utils/toastNotifications";

import { IoArrowBackCircleSharp } from "react-icons/io5";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // NOTE: Custom Hooks
  const [doSignUp, isSigninUp, signUpError] = useThunk(signup);
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
  } = useForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true,
    },
    {
      firstName: COMMON_FIELD_TYPES.REQUIRED_FIELD,
      lastName: COMMON_FIELD_TYPES.REQUIRED_FIELD,
      email: COMMON_FIELD_TYPES.EMAIL_FIELD,
      phoneNumber: COMMON_FIELD_TYPES.PHONE,
      password: COMMON_FIELD_TYPES.PASSWORD_FIELD,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true,
    });

    if (validateForm()) {
      const result = await doSignUp(formData);
      if (result?.success) {
        localStorage.setItem("token", result?.response?.data?.token);
        showToast("success", "Account created successfully");
        navigate("/");
      } else {
        showToast("error", result.error?.message);
      }
    }
  };



  return (
    <div className="relative w-full max-w-[512px] flex flex-col gap-10 my-[48px] lg:px-6 xl:px-0">

      <button className="absolute -left-2 -top-16 sm:-left-20 sm:-top-1 text-primary " onClick={() => navigate('/')}>
        <div className="w-10 h-10 sm:w-14 sm:h-14">
          <IoArrowBackCircleSharp className="w-full h-full" />
        </div>
      </button>
      
      <h1 className="text-3xl font-bold sm:text-5xl text-primary font-nonito_sans">
        Sign Up
      </h1>

      <form>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CustomInput
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              error={touched.firstName && errors.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName", formData.firstName)}
              onFocus={() => clearError("firstName")}
              className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
              labelStyle="font-inter font-medium sm:text-[16px] text-dark"
              isRequired={true}
            />

            <CustomInput
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              error={touched.lastName && errors.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName", formData.lastName)}
              onFocus={() => clearError("lastName")}
              className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
              labelStyle="font-inter font-medium sm:text-[16px] text-dark"
              isRequired={true}
            />
          </div>

          <CustomInput
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            error={touched.email && errors.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email", formData.email)}
            onFocus={() => clearError("email")}
            className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            isRequired={true}
          />

          <CustomInput
            label="Phone Number"
            type="text"
            name="phone"
            value={formData.phoneNumber}
            error={touched.phoneNumber && errors.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber", formData.phoneNumber)}
            onFocus={() => clearError("phoneNumber")}
            className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            isRequired={true}
          />

          <CustomInput
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            error={touched.password && errors.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={() => handleBlur("password", formData.password)}
            onFocus={() => clearError("password")}
            className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            isRequired={true}
            icon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute border-l-2 pl-3 border-[#CFD9E0] right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <AiFillEye size={24} className="text-gray-500" />
                ) : (
                  <AiFillEyeInvisible size={24} className="text-gray-500" />
                )}
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <CustomButton
            type="submit"
            className="h-[50px] sm:h-[60px] font-inter bg-primary text-white rounded-xl text-xl font-semibold mt-[44px]"
            buttonText="Create Account"
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            onClick={handleSubmit}
            loaderColor="white"
            loading={isSigninUp}
            disabled={isSigninUp}
          />

          <div className="flex justify-center font-inter sm:text-[14px] text-[12px]">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="underline cursor-pointer text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
