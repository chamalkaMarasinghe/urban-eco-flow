import React from "react";
import ImageSection from "../../components/pagesSpecific/Login/ImageSection";
import SignInForm from "../../components/pagesSpecific/Login/SignInForm";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { closeSignInModal } from "../../store";
import { AUTH_POPUP_VARIANTS } from "../../constants/commonConstants";
import KidsSignUpForm from "../pagesSpecific/Login/KidsSignUpForm";

export const AuthModelBaseComp = ({
  isOpen,
  variant,
  handlers
}) => {
  const dispatch = useDispatch();

  // Define different heights for different form variants
  const modalHeightMap = {
    [AUTH_POPUP_VARIANTS.REGISTER]: "min-h-[401px] max-h-[90vh] overflow-y-auto overflow-x-hidden", // Taller for registration form
    [AUTH_POPUP_VARIANTS.SIGNIN]: "min-h-[400px]", // Medium height for sign in
    [AUTH_POPUP_VARIANTS.FORGOT_PASSWORD]: "min-h-[311px]", // Shorter for forgot password
    [AUTH_POPUP_VARIANTS.RESET_PASSWORD]: "min-h-[400px]", // Medium height for reset password
  };

  // Get the appropriate height class, fallback to default if variant not found
  const modalHeight = modalHeightMap[variant] || "min-h-[497px]";

  const handleClose = () => {
    dispatch(closeSignInModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white relative shadow-lg rounded-2xl w-[88%] md:max-w-[638px] lg:max-w-[638px] flex justify-center items-start ${modalHeight}`}>
        <div className="h-full w-full md:w-[638px] px-6 py-8 md:p-12 flex flex-col md:flex-row gap-5 ">
          <button
            onClick={handleClose}
            className="absolute z-50 right-4 top-4 w-[24px] flex items-center justify-center h-[24px] cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <IoCloseOutline size={28} />
          </button>

          {/* Form Section */}
          <div className="flex items-center justify-center w-full ">
            <KidsSignUpForm
              isModel={true}
              variant={variant}
              handlers={handlers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};