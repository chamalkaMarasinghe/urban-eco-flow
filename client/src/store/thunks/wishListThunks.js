import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../config/api";


export const addWishListedEventThunk =  createAsyncThunk(
  "user/wishlist/add",
  async(data) =>{
     const response = await api.patch("user/wishlist/add/",data);
  }
);

export const removeWishListedEventThunk = createAsyncThunk(
    "user/wishlist/remove",
    async(data) => {
        const response = await api.patch("user/wishlist/remove",data);
    }
);