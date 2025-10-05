import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import orderSlice from "./slices/orderSlice";
import payStackSlice from "./slices/payStackSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    order: orderSlice,
    payStack: payStackSlice,
  },
});

export default store;

// INFO: Exporting auth actions and thunks
export {
  logout,
  switchRole,
  checkAndSwitchRoleByPath,
  openSignInModal, 
  closeSignInModal,
  handleSessionExpiration,
  endDataRefresh,
  startDataRefresh,
  updateAuth,
  addWishListedEvent,
  removeWishListedEvent
} from "./slices/authSlice";

export * from "./thunks/authThunks";
export * from "./thunks/userThunks";
export * from "./thunks/orderThunks";
export * from "./thunks/payStackThunks";
export * from "./thunks/threadThunks";