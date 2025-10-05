import { createSlice } from "@reduxjs/toolkit";
import { fetchBanks, verifyBankAccount } from "../thunks/payStackThunks";

const payStackSlice = createSlice({
  name: "payStack",
  initialState: {
    // Ghana banks
    ghanaBanks: [],
    // Bank account verification
    bankAccountVerification: {},
  },
  extraReducers: (builder) => {
    // fetch banks
    builder.addCase(fetchBanks.fulfilled, (state, action) => {
      state.ghanaBanks = action.payload.data;
    });

    // verify bank account
    builder.addCase(verifyBankAccount.fulfilled, (state, action) => {
      state.bankAccountVerification = action.payload;
    });
  },
});

export default payStackSlice.reducer;
