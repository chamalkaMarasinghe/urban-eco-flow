import React from "react";
import ImageSection from "../components/pagesSpecific/Login/ImageSection";
import SignInForm from "../components/pagesSpecific/Login/SignInForm";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { closeSignInModal } from "../store";

const SignInModel = ({ isOpen = false }) => {// note: need to be removed
  
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeSignInModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg md:rounded-[26px] w-[92%] lg:w-full max-w-[1000px] flex justify-center items-center h-[540px] md:h-[600px]">
        <div className=" md:h-[570px] w-full px-6 md:pr-6 md:w-[920px] flex flex-col md:flex-row gap-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-0 z-50 right-6 w-[30px] flex items-center justify-center h-[30px] md:top-4 md:right-0 cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <IoCloseOutline size={24} />
          </button>

          {/* Form Section */}
          <div className="w-full md:w-[calc(100%-440px)] flex justify-center items-center">
            <SignInForm isModel={true} />
          </div>

          {/* Image Section (Hidden on small screens) */}
          <div className="items-center justify-center hidden md:flex md:w-[440px] lg:w-[490px] xl:w-1/2 overflow-hidden">
            {/* <ImageSection img={Image} imgLq={Image_LQ} fromPopUp={true}/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModel;
