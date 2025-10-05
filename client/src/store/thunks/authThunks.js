import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

// SECTION: AUTH THUNKS

// NOTE: User / Tasker Signin
export const signin = createAsyncThunk("auth/signin/user", async (data) => {
  const response = await api.post("auth/signin/user", data);
  return response.data;
});

// NOTE: User Signup
export const signup = createAsyncThunk("auth/signup/user", async (data) => {
  const response = await api.post("auth/signup/user", data);
  return response.data;
});

// NOTE: Tasker Signup
export const taskerSignup = createAsyncThunk(
  "auth/signup/tasker",
  async (data) => {
    const response = await api.post("user/signup/tasker", data);
    return response.data;
  }
);

// NOTE: Authenticated link for resetting password
export const resetPassword = createAsyncThunk(
  "auth/reset/password",
  async (data) => {
    const response = await api.post("auth/forgot-password/user", data);
    return response.data;
  }
);

// NOTE: Validating the generated authenticaion token for password reset
export const validateToken = createAsyncThunk(
  "auth/validate/token",
  async ({ id, token }) => {
    const response = await api.get(`auth/verify-forgot/user/${id}/${token}`);
    return response.data;
  }
);

// NOTE: Resetting the password
export const updatePassword = createAsyncThunk(
  "auth/update/password",
  async ({ id, token, data }) => {
    const response = await api.post(
      `auth/change-password/user/${id}/${token}`,
      data
    );
    return response.data;
  }
);


// SECTION: USER THUNKS

// NOTE: Edit Client Profile
export const updateUserProfile = createAsyncThunk(
  "auth/update/user/profile",
  async (data) => {
    const response = await api.put("user/profile", data);
    return response.data;
  }
);