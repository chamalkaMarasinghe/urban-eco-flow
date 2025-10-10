import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { roles } from "../../constants/commonConstants";
import showToast from "../../utils/toastNotifications";
import { useEffect, useState } from "react";
import {
  checkAndSwitchRoleByPath,
  closeSignInModal,
  openSignInModal,
  switchRole,
} from "../../store"
import AuthenticationSkeleton from ".././skeletons/pagesSpecific/Login/AuthenticationSkeleton";

// NOTE: Component to protect client routes
export const ProtectedClientRoute = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);  

  // If not authenticated, show sign-in modal
  if (!isAuthenticated) {
    // Open the sign-in modal
    dispatch(openSignInModal());

    // Render a blank outlet that will show the current route's UI
    // in the background while the modal is displayed on top
    return <AuthenticationSkeleton />;
  }

  return <Outlet />;
};

// NOTE: Handle Public Routes
export const PublicRoute = () => {
  
  const { isSignInModalOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Check wether signin model is open, if it is open then close it, beacuse we are in public route
  // useEffect(() => {
  //   if (isSignInModalOpen) {
  //     dispatch(closeSignInModal());
  //   }
  // }, [isSignInModalOpen]);

  return <Outlet />;
};

// NOTE: Updated ProtectedRedirect to handle landing page routing
export const ProtectedClientRedirect = () => {
    return (
      <Navigate to="/kidsplan-client" replace />
    );
};