import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

// SECTION: THREAD THUNKS

// NOTE: creating a thread between two different users
export const createThread = createAsyncThunk("thread/create", async (userID) => {
    const response = await api.post(`thread/${userID}`);
    return response.data;
});

// NOTE: fetching threads of an user
export const fetchThreads = createAsyncThunk(`thread/fetch`, async (data) => {
    const response = await api.get(`thread?offset=${data?.offset}&limit=${data?.limit}&userName=${data?.searchTerm}`);
    return response.data;
});

// NOTE: fetching single threads of an user
export const fetchSingleThread = createAsyncThunk(`thread/fetch/single`, async (id) => {
    const response = await api.get(`thread/${id}`);
    return response.data;
});

// NOTE: fetching chats of a threads of an user
export const fetchChats = createAsyncThunk(`thread/chat`, async (data) => {
    const response = await api.get(`thread/${data?.thread}/chats/user?offset=${data?.offset}&limit=${data?.limit}`);
    return response.data;
});

// NOTE: fetch unread Thread count
export const fetchUnreadThreadCount = createAsyncThunk("thread/unread", async () => {
    const response = await api.get('thread/unread');
    return response.data;
});

// NOTE: user accept the offer
// export const acceptOffer = createAsyncThunk("offer/accept", async (data) => {
//     const response = await api.post(`offer/${data?.thread}/${data?.offer}/${data?.user}`);
//     return response.data;
// });

// NOTE: fetch details of selected offer 
// export const fetchOfferDetails = createAsyncThunk("offer/details", async (id) => {
//     const response = await api.get(`offer/${id}`);
//     return response.data;
// });
