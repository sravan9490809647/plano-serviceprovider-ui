import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import axios from "axios";

interface BusinessDetails {
  // define properly or use `any` for now
  [key: string]: unknown;
}

interface BusinessState {
  businessDetails: BusinessDetails | null;
  loading: boolean;
  error: string | null;
}
const initialState: BusinessState = {
  businessDetails: null,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onFetchBusinessDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        onFetchBusinessDetails.fulfilled,
        (state, action: PayloadAction<BusinessDetails>) => {
          state.loading = false;
          state.businessDetails = action.payload;
        }
      )
      .addCase(onFetchBusinessDetails.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to business details.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch business details.";
      });
  },
});

export const onFetchBusinessDetails = createAsyncThunk(
  "business/fetchBusiness",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.BUSINESS.GET_BUSINESS}${businessId}`
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to get business.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to get business.");
    }
  }
);
export default businessSlice.reducer;
