import { use, useEffect, useState } from "react";
import CustomInput from "../../components/Form/Input";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ImageSection from "../../components/Login/ImageSection";
import CustomButton from "../../components/Form/CustomButton";
import Image from "../../assets/login/setnewpassword.webp";
import Image_LQ from "../../assets/login/setnewpassword_lq.webp";
import { useNavigate, useSearchParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { COMMON_FIELD_TYPES } from "../../constants/fieldTypes";
import { useThunk } from "../../hooks/useThunk";
import { updatePassword, validateToken } from "../../store";
import showToast from "../../utils/toastNotifications";
import { errorMessages } from "../../constants/frontendErrorMessages";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [linkVerified, setLinkVerified] = useState(true);
  const [verifyError, setVerifyError] = useState(null);
  const [doVerifyPasswordForgot, isVerifying] = useThunk(validateToken);
  const [doChangePassword, isPasswordChanging] = useThunk(updatePassword);
  const [searchParams, setSearchParam] = useSearchParams();

  const token = searchParams.get("token");
  const id = searchParams.get("id");

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
      password: "",
      confirmPassword: "",
    },
    {
      password: true,
      confirmPassword: true,
    },
    {
      password: COMMON_FIELD_TYPES.PASSWORD_FIELD,
      confirmPassword: COMMON_FIELD_TYPES.CONFIRM_PASSWORD,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirmPassword: true,
    });

    if (validateForm()) {
      //form submission

      const result = await doChangePassword({ token, id, data: formData });

      if (result.success) {
        navigate("/signin", { replace: true });
        showToast("success", result.response?.message);
      } else {
        showToast("error", result.error?.message);
      }
    }
  };

  useEffect(() => {
    if (!token || !id) {
      setLinkVerified(false);
      setVerifyError(errorMessages.FAILED_RESET_PASSWORD);
      return;
    }
    // check if user has valid link to change the password with a backend call
    doVerifyPasswordForgot({ id, token }).then((result) => {
      if (result?.success) {
        setLinkVerified(true);
      } else {
        setLinkVerified(false);
        setVerifyError(result?.error?.message);
      }
    });
  }, [id, token, doVerifyPasswordForgot]);

  const handleOkayButton = () => {
    navigate("/forgot-password", { replace: true });
  };

  return (
    <div>
      {/* <<<=== spinner with loading dialog box while link is verifying ===>>> */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-5 bg-white rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-blue-shades font-inter">
              Verifying Link...
            </h2>
            <div className="flex items-center justify-center mt-4">
              <div className="w-10 h-10 border-t-4 rounded-full loader border-blue-shades animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-700 font-inter">
              Please wait while we verify your password reset link.
            </p>
          </div>
        </div>
      )}

      {/* Invalid Link notify Dialog Box */}
      {!linkVerified && !isVerifying && (
        <div>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-inter">
            <div className="p-5 bg-white rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold text-primary">Invalid Link</h2>
              <p className="mt-2 text-gray-700">
                {verifyError}. Please request a new Link.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 rounded bg-primary text-tertiary hover:bg-blue-shades"
                  onClick={handleOkayButton}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center min-w-[320px] justify-center w-full h-screen px-[30px] md:px-[100px] bg-light">
        <div className="container max-w-[1240px] lg:max-h-[714px] flex flex-col md:flex-row justify-center items-center gap-[50px]">
          <div className="flex justify-center w-full lg:w-1/2 lg:px-6 xl:px-0 ">
            <div className="w-full md:w-[512px] md:flex md:flex-col md:my-auto ">
              <div className="flex flex-col gap-[6px] ">
                <h1 className="text-3xl  md:text-[48px] font-bold text-primary font-nonito_sans leading-[48px] ">
                  Set New Password
                </h1>
                <p className="text-[#83899F] text-[14px] sm:text-[16px] font-inter leading-[150%] mt-2">
                  Please Enter Your New Password
                </p>
              </div>

              <form className="flex flex-col mt-14">
                <div className="flex flex-col gap-3">
                  <CustomInput
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    error={touched.password && errors.password}
                    onBlur={() => handleBlur("password", formData.password)}
                    onFocus={() => clearError("password")}
                    outerContainerStyle="mb-[24px]"
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    isRequired={true}
                    labelStyle="font-inter font-medium  sm:text-[16px] text-dark"
                    className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
                    icon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute border-l-2 pl-3 border-[#CFD9E0] right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <AiFillEye size={24} className="text-gray-500" />
                        ) : (
                          <AiFillEyeInvisible
                            size={24}
                            className="text-gray-500"
                          />
                        )}
                      </button>
                    }
                  />
                  <CustomInput
                    label="Re-Enter Password "
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    error={touched.confirmPassword && errors.confirmPassword}
                    onBlur={() =>
                      handleBlur("confirmPassword", formData.confirmPassword)
                    }
                    onFocus={() => clearError("confirmPassword")}
                    isRequired={true}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="h-[44px] sm:h-[54px] px-3 rounded-lg border border-gray-300 bg-primary-light/30 text-gray-600"
                    labelStyle="font-inter font-medium  sm:text-[16px] text-dark"
                    icon={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute border-l-2 pl-3 border-[#CFD9E0] right-4 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <AiFillEye size={24} className="text-gray-500" />
                        ) : (
                          <AiFillEyeInvisible
                            size={24}
                            className="text-gray-500"
                          />
                        )}
                      </button>
                    }
                  />
                </div>

                <div className=" flex flex-col gap-2 mt-[48px] lg:mt-[48px] ">
                  <CustomButton
                    type="submit"
                    className="h-[50px] sm:h-[60px] font-inter bg-primary text-tertiary rounded-xl text-xl font-semibold mt-[44px]"
                    buttonText="Update Password"
                    onClick={handleSubmit}
                    loading={isPasswordChanging}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-1/2">
            <ImageSection img={Image} imgLq={Image_LQ}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SetNewPassword;
