import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import { toast } from "react-toastify";
import axios from "axios";
import type { Offer } from "../../types";

interface OffersState {
  offersList: object[];
  loading?: boolean;
  error?: string | null;
}

const initialState: OffersState = {
  offersList: [],
  loading: false,
  error: null,
};

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOffers.fulfilled,
        (state, action: PayloadAction<Offer[]>) => {
          state.loading = false;
          state.offersList =
            action.payload.length > 0 ? [action.payload[0]] : [];
        }
      )
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to fetch offers.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch offers.";
      });
  },
});

// Thunk to fetch menus by category
export const fetchAllOffers = createAsyncThunk(
  "category/fetchAllOffers",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.OFFERS.ALL_OFFERS}${businessId}`
      );
      return response; // Return the fetched items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch offers.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to fetch offers.");
    }
  }
);

export default offerSlice.reducer;
