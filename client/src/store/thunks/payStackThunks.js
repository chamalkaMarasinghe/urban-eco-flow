import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateQueryParams } from "../../utils/generateQueryParams";
// import { payStackApi } from "../../config/payStackApi";
import { api } from "../../config/api";

// NOTE: Retrieves a list of supported banks in Ghana
export const fetchBanks = createAsyncThunk("payStack/fetchBanks", async () => {
  const response = await api.get("payment/paystack/banks");
  return response.data;
});

// NOTE: Verify bank account number
export const verifyBankAccount = createAsyncThunk(
  "payStack/verifyBankAccount",
  async (data) => {
    const response = await api.post("user/signup/tasker/verify/bank", data);
    return response.data;
  }
);

// NOTE: Verify mobile money
export const verifyMobileMoney = createAsyncThunk(
  "payStack/verifyMobileMoney",
  async (data) => {
    const response = await api.post("user/signup/tasker/verify/mobile-money", data);
    return response.data;
  }
);
