import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import { generateQueryParams } from "../../utils/generateQueryParams";
import { roles } from "../../constants/commonConstants";

// NOTE: Create collection request
export const createCollectionRequest = createAsyncThunk(
  "collectionRequest/create",
  async (data) => {
    const response = await api.post("collection-requests", data);
    return response.data;
  }
);

export const getMyCollectionRequests = createAsyncThunk(
  "collectionRequest/getMyCollectionRequests",
  async () => {
    const response = await api.get("collection-requests/my-requests");
    return response.data;
  }
);

export const getMyCollectionRequestsAnalytics = createAsyncThunk(
  "collectionRequest/getMyCollectionRequestsAnalytics",
  async () => {
    const response = await api.get("collection-requests/analytics");
    return response.data;
  }
);