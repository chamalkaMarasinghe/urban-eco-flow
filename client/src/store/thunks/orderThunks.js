import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import { generateQueryParams } from "../../utils/generateQueryParams";
import { roles } from "../../constants/commonConstants";

// EXAMPLE: Expected Orders Query Parameters
// userId: 64f1a2b3c4d5e6f7g8h9i0j1
// type: USER / TASKER
// offset: 0
// limit: 10
// searchTerm: order123
// status: PENDING
// multipleStatus: PENDING,DELIVERED

// NOTE: Get Client Orders
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (arg) => {
    const query = generateQueryParams(arg, {
      type: roles.USER,
    });
    const response = await api.get(`order/user?${query}`);
    return response.data;
  }
);

// NOTE: Get Tasker Orders
export const getTaskerOrders = createAsyncThunk(
  "order/getTaskerOrders",
  async (arg) => {
    const query = generateQueryParams(arg, {
      type: roles.TASKER,
    });
    const response = await api.get(`order/user?${query}`);
    return response.data;
  }
);

// NOTE: Get All Orders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (arg) => {
    console.log("getAllOrders Thunk Hit");
    const query = generateQueryParams(arg, {
      type: roles.TASKER,
    });
    const response = await api.get(`order?${query}`);
    return response.data;
  }
);

// NOTE: Create Raist Complaint
export const createRaistComplaint = createAsyncThunk(
  "order/raist-complaint",
  async (complaint) => {
    const response = await api.post("order/complaint", complaint);
    return response.data;
  }
);

// NOTE: Fetch user/tasker order by ID
export const getUserOrderById = createAsyncThunk(
  "order/getUserOrderById",
  async (orderId) => {
    const response = await api.get(`order/user/${orderId}`);
    return response.data;
  }
);

// NOTE: complete an delivered user order
export const acceptOrder = createAsyncThunk(
  "order/acceptOrder",
  async (orderId) => {
    console.log("accepte Order thunk Hit");
    const response = await api.post("order/complete", orderId);
    return response.data;
  }
);

// NOTE: Create Request Revision
export const createRequestRevision = createAsyncThunk(
  "order/request-revision",
  async (revision) => {
    const response = await api.post("order/request-revision", revision);
    return response.data;
  }
);

// NOTE: Submit Order Issue on Tasker side
export const createRaiseIssue = createAsyncThunk(
  "order/createRaiseIssue",
  async (data) => {
    console.log('data to issue', data)
    const response = await api.post("order/issue", data);
    return response.data;
  }
);

// NOTE: Tasker Side Deliver Job
export const createDeliverJob = createAsyncThunk(
  "order/deliver",
  async (data) => {
    const response = await api.post("order/deliver", data);
    return response.data;
  }
);

// NOTE: add Order Review
export const addOrderReview = createAsyncThunk("order/addReview", async (orderId) => {
  const response = await api.post("order/review", orderId);
  return response.data;
});

// NOTE: Get Payment History details
export const fetchPaymentHistoryTasker = createAsyncThunk(
  "/history/getTaskerPaymentHistory",
  async (arg) => {
    const query = generateQueryParams(arg, { type: roles.TASKER, });
    const response = await api.get(`payment/history/tasker?${query}`);
    return response.data;
  }
)

export const createPaymentCheckout = createAsyncThunk("order/createPaymentCheckout", async ({eventId}) => {
  const response = await api.post("order/create-payment-intent", {eventId});
  console.log("ressss", response)
  return response.data;
});

export const createSubscriptionCheckout = createAsyncThunk("order/createSubscriptionCheckout", async ({eventId}) => {
  const response = await api.post("order/create-payment-intent-subscription", {eventId});
  console.log("ressss", response)
  return response.data;
});