import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../Reusable/Input"
import CustomButton from "../../Reusable/CustomButton";
import useForm from "../../../hooks/useForm";
import { COMMON_FIELD_TYPES } from "../../../constants/fieldTypes";
import { useThunk } from "../../../hooks/useThunk";
import { closeSignInModal, signin, startDataRefresh } from "../../../store";
import showToast from "../../../utils/toastNotifications";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../../../constants/commonConstants"
import { IoArrowBackCircleSharp } from "react-icons/io5";

const SignInForm = ({ isModel = false }) => {// NOTE: need to be removed
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [doSignin, isSigninIn, signinError] = useThunk(signin);

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
      emailOrPhone: "",
      password: "",
      rememberMe: false,
    },
    {
      emailOrPhone: true,
      password: true,
      rememberMe: false,
    },
    {
      emailOrPhone: COMMON_FIELD_TYPES.EMAIL_OR_PHONE,
      password: COMMON_FIELD_TYPES.PASSWORD_FIELD,
      rememberMe: COMMON_FIELD_TYPES.BOOLEAN_FIELD,
    }
  );

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
      rememberMe: true,
    });

    const { rememberMe, ...otherData } = formData;
    if (validateForm()) {
      const result = await doSignin(otherData);
      if (result?.success) {
        showToast("success", "Sign in Sucessfull");
        // Start the data refresh process
        if (isModel) {
          dispatch(startDataRefresh());
        }
        localStorage.setItem("token", result?.response?.data?.token);

        if (!isModel) {
          navigate("/"); // navigate to home page only if not in modal
        } else {
          // Instead of reloading, close the modal and force component updates
          dispatch(closeSignInModal());

          // Force pending API requests to cancel and retry with new auth token
          // This could be a custom event that your API interceptors listen for
          window.dispatchEvent(new CustomEvent("auth-state-changed"));
        }
      } else {
        showToast("error", result?.error?.message);
      }
    }
  };

  return (
    <div
      className={`relative w-full max-w-[512px] my-auto flex flex-col ${
        isModel ? "w-[440px]" : "py-12 w-full"
      } `}
    >
      {!isModel && (
        <button
          className="absolute -left-2 -top-4 sm:-left-20 sm:top-11 text-primary "
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14">
            <IoArrowBackCircleSharp className="w-full h-full" />
          </div>
        </button>
      )}

      <h1 className="text-3xl font-bold sm:text-5xl text-primary font-nonito_sans">
        Sign In
      </h1>

      <form className="">
        <div className="flex flex-col gap-3 mt-14">
          <CustomInput
            label={"E-mail / Phone Number"}
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            error={touched.emailOrPhone && errors.emailOrPhone}
            onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
            onBlur={() => handleBlur("emailOrPhone", formData.emailOrPhone)}
            onFocus={() => clearError("emailOrPhone")}
            placeholder=""
            className="w-full h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
            labelStyle="font-inter font-medium  sm:text-[16px] text-dark"
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
            placeholder=""
            className="w-full h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
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
            labelStyle="font-inter font-medium sm:text-[16px] text-dark"
            isRequired={true}
          />
        </div>

        <div className="flex items-center justify-end mt-12 xs:mt-6">
          {/* <label className="flex items-center gap-3 text-[#718096] font-inter text-[12px] sm:text-[14px]">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span>Remember me</span>
          </label> */}
          <Link
            to="/forgot-password"
            className="font-medium underline text-primary font-inter text-[12px] sm:text-[14px]"
          >
            Forgot Password?
          </Link>
        </div>

        <div
          className={` flex flex-col gap-2 ${
            isModel ? "mt-10 md:mt-20" : "mt-[88px] lg:mt-[148px]"
          } `}
        >
          <CustomButton
            type="submit"
            className="h-[50px] sm:h-[60px] bg-primary font-inter text-tertiary rounded-xl text-xl font-semibold"
            buttonText="Sign In"
            onClick={handleSubmit}
            loading={isSigninIn}
            disabled={isSigninIn}
          />

          <div className="flex justify-center">
            <p className="text-gray-500 font-inter sm:text-[14px] text-[12px]">
              Don't have an account?{" "}
              <Link
                to={role === roles?.USER ? "/signup" : "/tasker-signup"}
                className="underline cursor-pointer text-primary"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
