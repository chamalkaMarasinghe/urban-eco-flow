import { createSlice } from "@reduxjs/toolkit";
import {
    createRaiseComplaint,
    fetchComplaints,
    fetchComplaintById,
    createResolveComplaint,
    deleteComplaint,
} from "../thunks/eventThunks";

const eventSlice = createSlice({
    name: "event",
    initialState: {
        complaints: [],
        currentComplaint: null,
        loading: false,
        error: null,
    },
    extraReducers(builder) {
        builder
            // Raise complaint for event
            .addCase(createRaiseComplaint.pending, (state) => {
                state.loading = true; 
                state.error = null; 
            })
            .addCase(createRaiseComplaint.fulfilled, (state, action) => {
                state.loading = false; 
            })
            .addCase(createRaiseComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch all complaints
            .addCase(fetchComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = action.payload.data;
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.loading = false;  
                state.error = action.payload; 
            })

            // Fetch complaint by ID
            .addCase(fetchComplaintById.pending, (state) => {
                state.loading = true; 
                state.error = null;
            })
            .addCase(fetchComplaintById.fulfilled, (state, action) => {
                state.loading = false; 
                state.currentComplaint = action.payload.data; 
            })
            .addCase(fetchComplaintById.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.payload; 
            })

            // Resolve complaint
            .addCase(createResolveComplaint.pending, (state) => {
                state.loading = true; 
                state.error = null; 
            })
            .addCase(createResolveComplaint.fulfilled, (state, action) => {
                state.loading = false; 
                if (state.currentComplaint && state.currentComplaint._id === action.payload.data.complaints[0]._id) {
                    state.currentComplaint.status = action.payload.data.complaints[0].status; 
                }
                state.complaints = state.complaints.map((complaint) =>
                    complaint._id === action.payload.data.complaints[0]._id
                        ? { ...complaint, status: action.payload.data.complaints[0].status }
                        : complaint
                );
            })
            .addCase(createResolveComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete complaint
            .addCase(deleteComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = state.complaints.filter(
                    (complaint) => complaint._id !== action.meta.arg
                );  
                if (state.currentComplaint && state.currentComplaint._id === action.meta.arg) {
                    state.currentComplaint = null; 
                }
            })
            .addCase(deleteComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default eventSlice;