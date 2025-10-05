import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTaskerProfiles,
  getTaskerDetails,
  getTaskerProfile,
  contactUs,
  submitContactForm,
  getClientProfile,
  editClientProfile
} from "../thunks/userThunks";

const userSlice = createSlice({
  name: "user",
  initialState: {
    taskerProfiles: {
      profiles: [],
      pagination: {},
    },
    taskerProfile: {
      profile: {},
    },
    clientProfile: {
      profile: {},
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTaskerProfiles.fulfilled, (state, action) => {
      state.taskerProfiles.profiles = action.payload.data?.data || [];
      state.taskerProfiles.pagination = action.payload.data?.pagination || {};
    });

    builder.addCase(getTaskerDetails.fulfilled, (state, action) => {
      state.taskerProfile.profile = action.payload.data?.data[0] || {};
    });

    builder.addCase(getTaskerProfile.fulfilled, (state, action) => {
    });

    builder.addCase(contactUs.fulfilled, (state, action) => {
    });

    // -----------------------KIDSPLAN-----------------------------------------------

    builder.addCase(getClientProfile.fulfilled, (state, action) => {
      state.clientProfile.profile = action.payload.data || {};
    });

    builder.addCase(editClientProfile.fulfilled, (state, action) => {
      state.clientProfile.profile = action.payload.data || {};
    });

    builder.addCase(submitContactForm.fulfilled, (state, action) => {
    });
  },
});

export default userSlice.reducer;
