import { useDispatch } from "react-redux";
import { handleSessionExpiration } from "../store";
import { useEffect } from "react";
import showToast from "../utils/toastNotifications";

/**
 * Custom hook to monitor session token and handle expiration
 * Uses Redux to manage session state and show/hide the sign-in modal
 */

const useSessionMonitor = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    const handleStorageChange = (e) => {
      // Check if token is removed
      if (e.key === "token" && !e.newValue) {
        dispatch(handleSessionExpiration());
      }
    };

    // Check if token is expired
    const checkTokenExpiration = () => {
      
      const token = localStorage.getItem("token");

      // If no token exists, return early
      if (!token) return;

      try {
        // Split the token and get the payload part
        const [, payloadBase64] = token.split(".");

        // Decode the base64 payload
        const decodedPayload = atob(payloadBase64);

        // Parse the JSON payload
        const tokenData = JSON.parse(decodedPayload);

        // Check expiration
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds

        if (Date.now() >= expirationTime) {
          localStorage.removeItem("token");
          // Show toast notification
          showToast("error", "Session Expired. Please Sign in again");
          setTimeout(() => {
            dispatch(handleSessionExpiration());
          }, 3000);
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
        // Handle invalid token by logging out
        localStorage.removeItem("token");
        dispatch(handleSessionExpiration());
      }
    };

    // Initial check with a slight delay to allow auth process to complete
    const initialCheckTimeout = setTimeout(() => {
      checkTokenExpiration();
    }, 500);

    // Set up periodic checks
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    // Set up storage event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
      clearTimeout(initialCheckTimeout); // Clear the timeout on unmount
    };
  }, [dispatch]);
};

export default useSessionMonitor;
