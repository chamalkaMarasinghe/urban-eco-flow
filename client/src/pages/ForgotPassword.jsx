import React from "react";
import CustomInput from "../../components/Form/Input";
import ImageSection from "../../components/Login/ImageSection";
import CustomButton from "../../components/Form/CustomButton";
import Image from "../../assets/login/setnewpassword.webp";
import Image_LQ from "../../assets/login/setnewpassword_lq.webp";
import { Link } from "react-router-dom";
import { resetPassword } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import useForm from "../../hooks/useForm";
import { COMMON_FIELD_TYPES } from "../../constants/fieldTypes";
import showToast from "../../utils/toastNotifications";

const ForgotPassword = () => {
  const [doResetPassword, isResettingPassword, resetPasswordError] =
    useThunk(resetPassword);

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
    },
    {
      emailOrPhone: true,
    },
    {
      emailOrPhone: COMMON_FIELD_TYPES.EMAIL_OR_PHONE,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      emailOrPhone: true,
    });

    const isValid = validateForm();

    if (isValid) {
      const result = await doResetPassword(formData);
      if (result?.success) {
        showToast(
          "success",
          result?.response?.message ||
            "Password Reset Link Sent To Your Email Successfully"
        );
      } else {
        showToast("error", result?.response?.message || "Failed to send reset link");
      }
    }
  }; 

  return (
    <div className="flex items-center min-w-[320px] justify-center w-full min-h-screen px-[30px] md:px-[100px] bg-light">
      <div className="container max-w-[1240px] lg:max-h-[714px] flex flex-col md:flex-row justify-center items-center gap-[50px]">
        <div className="flex justify-center w-full lg:w-1/2">
          <div className="w-full md:w-[512px] md:flex md:flex-col md:my-auto">
            <div className="flex flex-col gap-[6px] ">
              <h1 className="m-0 text-3xl font-bold  md:text-5xl text-primary font-nonito_sans">
                Forgot Password
              </h1>
              <p className="text-[#83899F] text-[14px] sm:text-[16px] font-inter leading-[150%] mt-2">
                Please Enter Your Registered Email Address or Phone Number
              </p>
            </div>

            <form className="flex flex-col">
              <CustomInput
                label="E-mail / Phone Number"
                type="email"
                name="email"
                value={formData.emailOrPhone}
                error={touched.emailOrPhone && errors.emailOrPhone}
                onChange={(e) =>
                  handleInputChange("emailOrPhone", e.target.value)
                }
                onBlur={() => handleBlur("emailOrPhone", formData.emailOrPhone)}
                onFocus={() => clearError("emailOrPhone")}
                labelStyle="font-inter font-medium sm:text-[16px] text-dark mt-14"
                className="h-[54px] px-3 rounded-xl border border-gray-300 bg-primary-light/30 text-content"
              />

              <div className="flex flex-col">
                <CustomButton
                  type="submit"
                  onClick={handleSubmit}
                  loading={isResettingPassword}
                  className="h-[60px] bg-primary font-inter font-semibold text-[20px] mt-[100px] md:mt-[148px] text-tertiary rounded-xl text-xl w-full"
                  buttonText="Request Password"
                />

                <div className="flex justify-center mt-2 ">
                  <p className="text-gray-500 font-inter sm:text-[14px] text-[12px]">
                    Remember Password?{" "}
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
        </div>
        <div className="hidden lg:flex lg:w-1/2">
          <ImageSection img={Image} imgLq={Image_LQ}/>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
