import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

// NOTE: Get all events
export const getAllEvents = createAsyncThunk(
    "event/all",
    async (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();

        // Always include offset and limit
        queryParams.set('offset', params?.offset || 0);
        queryParams.set('limit', params?.limit || 20);

        // Add optional filters
        if (params?.heroSearchTerm) {
            queryParams.set('heroSearchTerm', params?.heroSearchTerm)
        }

        if (params?.searchTerm) {
            queryParams.set('title', params?.searchTerm)
        }
        if (params?.status) {
            queryParams.set('status', params?.status)
        }
        if (params?.category) {
            queryParams.set('category', params?.category);
        }
        if (params?.payment_status) {
            queryParams.set('payment_status', params?.payment_status);
        }
        if (params?.location) {
            queryParams.set('location', params?.location);
        }
        if (params?.locationLatitude) {
            queryParams.set("locationLatitude", params?.locationLatitude);
        }
        if (params?.locationLongitude) {
            queryParams.set("locationLongitude", params?.locationLongitude);
        }
        if (params?.date) {
            queryParams.set('date', params?.date);
        }
        if(params?.isOrders){
            queryParams.set('isOrders', params?.isOrders)
        }
        if(params?.serviceProviderId){
            queryParams.set('serviceProviderId', params?.serviceProviderId);
        }
        if(params?.longitude){
            queryParams.set("longitude", params?.longitude);
        }
        if(params?.latitude){
            queryParams.set("latitude", params?.latitude);
        }
        if(params?.isNearbyEvents){
            queryParams.set("isNearbyEvents", params?.isNearbyEvents);
        }

        const response = await api.get(`/event/all?${queryParams.toString()}`, {headers: {clientRoute: params?.clientRoute}});
        return response.data;
    }
);

// NOTE: Get event by ID /event/edit-event/{id}
export const getEventById = createAsyncThunk("event/getById",
    async (eventId) => {
        //manual sleep to simulate loading time
        // await new Promise(r => setTimeout(r, 5000));

        const queryParams = new URLSearchParams();

        if(eventId?.longitude){
            queryParams.set("longitude", eventId?.longitude);
        }
        if(eventId?.latitude){
            queryParams.set("latitude", eventId?.latitude);
        }


        const response = await api.get(`/event/user/${eventId?.eventId}?${queryParams.toString()}`, {headers: {clientRoute: eventId?.clientRoute}});
        return response.data;
    }
);

export const bookEvent = createAsyncThunk("event/book-event",
    async (eventData) => {        
        // manual sleep to simulate loading time
        // await new Promise(resolve => setTimeout(resolve, 5000));
        const response = await api.post("/event/book-event", {
            eventId: eventData?.eventId,
        });
        return response.data;
    }
);

export const unsubscribeEvent = createAsyncThunk("order/cancelSubscription",
    async (eventData) => {        
        const response = await api.post("/order/cancelSubscription", {
            subscriptionId: eventData?.subscriptionId,
        });
        return response.data;
    }
);

//! NOTE: Create Raise Complaint
export const createRaiseComplaint = createAsyncThunk(
    "event/raise-complaint",
    async (complaint, { rejectWithValue }) => {
        try {
            const response = await api.post("/event/complaint", complaint, {
                headers: { "Content-Type": "application/json" }, // Adjusted for JSON payload
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//! NOTE: Fetch All Complaints
export const fetchComplaints = createAsyncThunk(
    "event/fetch-complaints",
    async (filters, { rejectWithValue }) => {
        try {
            const response = await api.get("/event/complaint", {
                params: filters,
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); //! Added for fetching all complaints

//! NOTE: Fetch Complaint by ID
export const fetchComplaintById = createAsyncThunk(
    "event/fetch-complaint-by-id",
    async (complaintId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/event/complaint/${complaintId}`, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); //! Added for fetching a single complaint

//! NOTE: Create Resolve Complaint (Updated for correct endpoint)
export const createResolveComplaint = createAsyncThunk(
    "event/resolve-complaint",
    async ({ complaintId }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                "/event/complaint/resolve",
                { complaintId }, //! Updated to use complaintId
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); //! Updated to use correct endpoint and complaintId

//! NOTE: Delete Complaint
export const deleteComplaint = createAsyncThunk(
    "event/delete-complaint",
    async (complaintId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/event/complaint/${complaintId}`, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); //! Added for deleting a complaint