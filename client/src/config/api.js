import axios from "axios";
import { CONFIGURATIONS } from "./envConfig";
import { errorMessages } from "../constants/frontendErrorMessages";
import store from "../store";

export const api = axios.create({
  baseURL: `${CONFIGURATIONS.API_BASE_URL}/`,
  withCredentials: true, // Ensures cookies are included in all requests
});

// NOTE: Store pending requests with their cancel tokens
let pendingRequests = [];

// NOTE: Listen for auth state changes
window.addEventListener("auth-state-changed", () => {


  // Cancel any pending requests
  pendingRequests.forEach((request) => {
    try {
      request.cancel();
    } catch (err) {
      console.error("Error canceling request:", err);
    }
  });

  // Clear the pending requests array
  pendingRequests = [];

   window.location.reload();
});

// NOTE: Request interceptor
api.interceptors.request.use(

  (config) => {
    // Create a cancel token for this request
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // Track this request (only for non-auth requests)
    // Skip tracking for auth-related endpoints like login/logout
    const isAuthEndpoint = config.url.includes("/auth/", "/user/inquiry");
    
    if (!isAuthEndpoint) {
      pendingRequests.push({
        url: config.url,
        cancel: () =>
          source.cancel("Request canceled due to auth state change"),
      });
    }

    // Add auth token
    if (!config?.voidAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      delete config.voidAuth;
    }

    return config;
  },

  (error) => {
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }

);

// NOTE: response inteceptor
api.interceptors.response.use(

  // NOTE: in success
  async (response) => {
    // Remove the request from pending requests list
    const index = pendingRequests.findIndex(
      (req) => req.url === response.config.url
    );
    if (index > -1) {
      pendingRequests.splice(index, 1);
    }
    return response;
  },

  // NOTE: in failure
  async (error) => {
    // Remove from pending even on error
    if (error.config) {
      const index = pendingRequests.findIndex(
        (req) => req.url === error.config.url
      );
      if (index > -1) {
        pendingRequests.splice(index, 1);
      }
    }

    // Check if this error was caused by cancellation due to auth change
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      
      // Check if this is an auth endpoint (like login)
      const isAuthEndpoint = error.config.url.includes("/auth/");
      
      if (!isAuthEndpoint) {
        // For non-auth endpoints, handle with modal instead of reload
        
        // Don't clear localStorage here, just show the modal
        const authAction = require("../store/slices/authSlice");
        // store.dispatch(authAction.handleSessionExpiration());
        store.dispatch(authAction.openSignInModal())

        // Update error details
        error.message = "Authentication required. Please sign in.";
        error.code = "401";
        error.name = "AuthError";
      } else {
        // For auth endpoints themselves (like failed login attempts),
        // just pass through the error normally
        if (error.response) {
          const data = error.response.data;
          error.message = data?.message || errorMessages.ERROR_OCCURRED;
          error.code = `${error.response?.status}` || "500";
          error.name = data?.statusCode || "Axios Error";
        }
      }
    } else if (error.response) {
      // Existing response with error status
      const data = error.response.data;
      error.message = data?.message || errorMessages.ERROR_OCCURRED;
      error.code = `${error.response?.status}` || "500";
      error.name = data?.statusCode || "Axios Error";
    } else {
      // Error setting up the request
      error.message = error.message || errorMessages.UNKNOWN_ERROR_OCCURRED;
      error.code = "500";
    }

    return Promise.reject(error);
  }
);