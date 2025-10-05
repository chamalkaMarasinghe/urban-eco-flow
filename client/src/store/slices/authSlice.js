import { createSlice } from "@reduxjs/toolkit";
import { roles } from "../../constants/commonConstants";
import {
  signin,
  signup,
  taskerSignup,
  updateUserProfile,
} from "../thunks/authThunks";
import showToast from "../../utils/toastNotifications";
import {editClientProfile} from "../thunks/userThunks";

// Load authentication state from localStorage (if exists)
const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};

const initialState = {
  isAuthenticated: storedAuth.isAuthenticated || false,
  user: storedAuth.user || null,
  role: storedAuth.role || roles.USER,
  availableRoles: storedAuth.availableRoles || [], // Track available roles for the user
  isSignInModalOpen: false,
  isRefreshingData: false,
  resetId: null,
  resetToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // switch role
    switchRole: (state, action) => {
      state.role = action.payload;

      const auth = JSON.parse(localStorage.getItem("auth")) || {};
      auth.role = action.payload;
      localStorage.setItem("auth", JSON.stringify(auth));

      if ([roles.USER, roles.TASKER].includes(action.payload)) {
        document.documentElement.classList.remove(roles.USER, roles.TASKER);
        document.documentElement.classList.add(action.payload);
      }
    },
    // update role based on pathname
    checkAndSwitchRoleByPath: (state) => {
      const pathname = window.location.pathname;

      if (pathname.includes("/service-pro") && state.role !== roles.TASKER) {
        state.role = roles.TASKER;

        const auth = JSON.parse(localStorage.getItem("auth")) || {};
        auth.role = roles.TASKER;
        localStorage.setItem("auth", JSON.stringify(auth));

        document.documentElement.classList.remove(roles.USER);
        document.documentElement.classList.add(roles.TASKER);
      } else if (pathname.includes("/client") && state.role !== roles.USER) {
        state.role = roles.USER;

        const auth = JSON.parse(localStorage.getItem("auth")) || {};
        auth.role = roles.USER;
        localStorage.setItem("auth", JSON.stringify(auth));

        document.documentElement.classList.remove(roles.TASKER);
        document.documentElement.classList.add(roles.USER);
      }
    },
    // logout
    logout: (state) => {
      const currentLocalRole = state.role;

      state.isAuthenticated = false;
      state.user = null;
      state.role = currentLocalRole || roles.USER;
      state.availableRoles = [];
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify({ role: currentLocalRole }));
      localStorage.setItem("kidsplan_location_enabled", "false");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");

      // Reset theme
      // document.documentElement.classList.remove(roles.USER, roles.TASKER);
      // document.documentElement.classList.add(roles.USER);
    },
    //signin modal
    setResetCredentials(state, action) {
      state.resetId    = action.payload.id;
      state.resetToken = action.payload.token;
      localStorage.setItem("kidsplan_location_enabled", "false");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
    },
    openSignInModal: (state) => {
      state.isSignInModalOpen = true;
    },
    closeSignInModal: (state) => {
      state.isSignInModalOpen = false;
      const currentPath = window.location.pathname;

      // Check if the current path is exactly "/service-pro" or "/client"
      if (
        currentPath !== "/about-us" &&
        currentPath !== "/contact-us" &&
        currentPath !== "/terms-and-condition" &&
        currentPath !== "/privacy-policise" &&
        currentPath?.toString()?.split("/")?.[1] !== "events"
      ) {
        window.location.href = "/"; // Redirect to home
        // window.location.reload();
      }
    },
    // handle session expiration
    handleSessionExpiration: (state) => {
      const currentLocalRole = state.role;

      state.isAuthenticated = false;
      state.user = null;
      state.role = currentLocalRole || roles.USER;
      state.availableRoles = [];
      state.isSignInModalOpen = true; // Open the modal

      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify({ role: currentLocalRole }));
      localStorage.setItem("kidsplan_location_enabled", "false");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");

      window.location.reload();
    },
    startDataRefresh: (state) => {
      state.isSignInModalOpen = false;
      state.isRefreshingData = true;
    },
    endDataRefresh: (state) => {
      state.isRefreshingData = false;
    },
    updateAuth: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (key === "user" && typeof action.payload.user === "object") {
          state.user = { ...state.user, ...action.payload.user };
        } else if (state.hasOwnProperty(key)) {
          state[key] = action.payload[key];
        }
      });
    },
    addWishListedEvent: (state,action) =>{
      let storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
      storedAuth.user.wishList?.push(action.payload);
      localStorage.setItem("auth", JSON.stringify(storedAuth));
      state.user.wishList?.push(action.payload)
    },
    removeWishListedEvent:(state,action)=>{         
              state.user.wishList = state.user.wishList?.filter(
                (item) => item._id !== action.payload._id
              ); 
         let storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
          const updatedAuth = {
      ...storedAuth,
      user: {
        ...storedAuth.user,
        wishList: storedAuth.user.wishList?.filter(
          item => item._id !== action.payload._id
        ) || [],
      },
    };
    localStorage.setItem("auth", JSON.stringify(updatedAuth));

    }
  },
  
  extraReducers: (builder) => {
    builder.addCase(signin.fulfilled, (state, action) => {
      handleAuthSuccess(state, action.payload.data);
      state.isSignInModalOpen = false; // Close modal on successful login
    });

    builder.addCase(signup.fulfilled, (state, action) => {
      handleAuthSuccess(state, action.payload.data);
      state.isSignInModalOpen = false; // Close modal on successful login
    });

    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePicture,
        jobTitle,
        location,
      } = action.payload.data;

      if (state.user) {
        Object.assign(state.user, {
          firstName,
          lastName,
          email,
          phoneNumber,
          profilePicture,
          jobTitle,
          location,
        });
      } else {
        state.user = {
          firstName,
          lastName,
          email,
          phoneNumber,
          profilePicture,
          jobTitle,
          location,
        };
      }

      // Update localStorage efficiently
      const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
      storedAuth.user = {
        ...(storedAuth.user || {}),
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePicture,
        jobTitle,
        location,
      };
      localStorage.setItem("auth", JSON.stringify(storedAuth));
    });

    builder.addCase(editClientProfile.fulfilled, (state, action) => {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePicture,
        jobTitle,
        location,
      } = action.payload.data;

      if (state.user) {
        Object.assign(state.user, {
          firstName,
          lastName,
          email,
          phoneNumber,
          profilePicture,
          jobTitle,
          location,
        });
      } else {
        state.user = {
          firstName,
          lastName,
          email,
          phoneNumber,
          profilePicture,
          jobTitle,
          location,
        };
      }

      // Update localStorage efficiently
      const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
      storedAuth.user = {
        ...(storedAuth.user || {}),
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePicture,
        jobTitle,
        location,
      };
      localStorage.setItem("auth", JSON.stringify(storedAuth));
    });

    builder.addCase(taskerSignup.fulfilled, (state, action) => {
      handleAuthSuccess(state, action.payload.data);
      state.isSignInModalOpen = false; // Close modal on successful login
    });
  },
});

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Error decoding token:", error);
    return {};
  }
};

// handle authentication success
const handleAuthSuccess = (state, data) => {
  const { userData, token } = data;

  const decodedToken = decodeToken(token);
  const userRoles = decodedToken?.roles || [];

  state.isAuthenticated = true;
  state.user = userData;
  state.availableRoles = userRoles;
  state.role = state.role || roles.USER;
  state.isSignInModalOpen = false; // Close modal on successful login

  localStorage.setItem(
    "auth",
    JSON.stringify({
      isAuthenticated: true,
      user: userData,
      role: state.role,
      availableRoles: userRoles,
    })
  );
};

export const {
  logout,
  switchRole,
  checkAndSwitchRoleByPath,
    setResetCredentials,
  openSignInModal,
  closeSignInModal,
  handleSessionExpiration,
  startDataRefresh,
  endDataRefresh,
  updateAuth,
  addWishListedEvent,
  removeWishListedEvent
} = authSlice.actions;
export default authSlice.reducer;
