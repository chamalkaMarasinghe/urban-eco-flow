import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import { generateQueryParams } from "../../utils/generateQueryParams";
import { roles } from "../../constants/commonConstants";

// NOTE: Create collection request
export const purchaseSensor = createAsyncThunk(
    "sensor/purchase",
    async (data) => {
        const response = await api.post("sensors/purchase", data);
        return response.data;
    }
);

export const getAllSensors = createAsyncThunk("sensor/getAll", async () => {
    const response = await api.get("sensors?page=1&limit=1000");
    return response.data;
});

//sensors/purchased of specif user
export const getAllPurchasedSensors = createAsyncThunk(
    "sensor/getAllPurchased",
    async () => {
        const response = await api.get("sensors/purchased");
        return response.data;
    }
);

// NOTE: bins
export const createBin = createAsyncThunk(
    "bin/create",
    async (data) => {
        const response = await api.post("bins", data);
        return response.data;
    }
);

//created bins of specifi user
export const getAllCreatedBins = createAsyncThunk(
    "bin/getAllCreated",
    async () => {
        const response = await api.get("bins/my-bins?page=1&limit=1000");
        return response.data;
    }
);