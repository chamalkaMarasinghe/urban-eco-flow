import { Outlet, useSearchParams } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Header/Footer";
import SignInModel from "../pages/SignInModel";
import { useDispatch, useSelector } from "react-redux";
import useSessionMonitor from "../hooks/useSessionMonitor";
import GlobalAuthLoader from "../components/pagesSpecific/Login/GlobalAuthLoader";
import ScrollToTop from "../components/Reusable/ScrollToTop";
import AuthModelHOC from "../components/Reusable/AuthModelHOC";
import {AuthModelBaseComp} from "../components/Reusable/AuthModelBaseComp";
import { APIProvider } from '@vis.gl/react-google-maps';
import { CONFIGURATIONS } from "../config/envConfig";
import { openSignInModal } from "../store";
import { useEffect, useState } from "react";
import { AUTH_POPUP_VARIANTS } from "../constants/commonConstants";
import {setResetCredentials} from "../store/slices/authSlice";

const Root = () => {

  const { isSignInModalOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

   // Initialize the session monitor
  useSessionMonitor();
  
  const isReset  = searchParams.get("isReset") === "true";
  const resetId = searchParams.get("id");
  const resetToken = searchParams.get("token");

  const [variant, setVariant] = useState(isReset ? AUTH_POPUP_VARIANTS.RESET_PASSWORD : AUTH_POPUP_VARIANTS.SIGNIN);

  const AuthPopUp = AuthModelHOC(AuthModelBaseComp, setVariant, variant);

  useEffect(() => {
      if (isReset && resetId && resetToken) {
          dispatch(setResetCredentials({ id: resetId, token: resetToken }));
          dispatch(openSignInModal());
      }
    // setSearchParams({});
  },[]);

  return (
    <div className="flex flex-col min-h-screen min-w-[320px]">
      <GlobalAuthLoader />
      <div className="mt-6">
        <Navbar />
      </div>
      <main className="flex flex-col flex-grow mt-7 w-full max-w-[1560px] px-[20px] sm:px-[35px] md:px-[50px] lg:px-[70px] custom-w-br-1600:px-[0px] mx-auto">
        {/* Handle Sign In Modal */}
        <AuthPopUp isOpen={isSignInModalOpen} />
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Root;
