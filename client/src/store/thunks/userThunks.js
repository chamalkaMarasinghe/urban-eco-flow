import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import { generateQueryParams } from "../../utils/generateQueryParams";

// NOTE: Fetch tasker profiles
export const fetchTaskerProfiles = createAsyncThunk(
  "client/fetch/taskerProfiles",
  async (arg) => {
    const query = generateQueryParams(arg);
    const response = await api.get(`user/tasker?${query}`);
    // delay for testing
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return response.data;
  }
);

// NOTE: Get Tasker Details
export const getTaskerDetails = createAsyncThunk(
  "auth/get/tasker/details",
  async (userId) => {
    const response = await api.get(`user/tasker?limit=1&userId=${userId}&withReviewedOrdersCount=true&withTotalOrdersCount=true`);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    return response.data;
  }
);

// NOTE: Get Tasker Profile
export const getTaskerProfile = createAsyncThunk(
  "auth/get/tasker/profile",
  async () => {
    const response = await api.get("user/tasker/self");
    // delay for testing
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    return response.data;
  }
);

// NOTE: Contact Us
export const contactUs = createAsyncThunk("/user/inquiry", async (data) => {
  const response = await api.post("user/inquiry", data);
  return response.data;
});

// ----------------------------------- KIDSPLAN USER THUNKS --------------------------------------------------------------------------

// NOTE: Get Client Profile
export const getClientProfile = createAsyncThunk(
    "user/profile",
    async () => {
        const response = await api.get("/user/profile/");
        return response.data;
    }
);

// NOTE: Edit Client Profile Details
export const editClientProfile = createAsyncThunk(
    "user/editProfile",
    async (payload) => {
        const response = await api.put("/user/edit-profile/", payload);
        return response.data;
    }
);

// NOTE: Get Service Provider Profile
export const getServiceProviderProfileById = createAsyncThunk(
    "user/serviceProviderProfile",
    async (serviceProId) => {
        const response = await api.get(`/servicepro/profile/service-pro/${serviceProId}`);
        return response.data;
    }
);

// NOTE: Send message from contact form
export const submitContactForm = createAsyncThunk("user/contact", async (data) => {
    const response = await api.post("user/contact", data);
    return response.data;
});