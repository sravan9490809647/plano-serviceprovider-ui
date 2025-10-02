import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import { toast } from "react-toastify";
import axios from "axios";
import Storage from "../../utils/Storage";

interface Receipt {
    rtId: string;
    bId: string;
    tId: string;
    start: string;
    end: string;
    tableName: string;
    tableNumber: number;
    createdOn: string;
}

interface ReceiptsState {
    receipts: Receipt[];
    loading: boolean;
    error: string | null;
}

const initialState: ReceiptsState = {
    receipts: [],
    loading: false,
    error: null,
};

// Thunk to fetch all receipts
export const fetchAllReceipts = createAsyncThunk(
    "receipts/fetchAllReceipts",
    async (_, { rejectWithValue }) => {
        try {
            const businessId = Storage.getItem("businessId");
            if (!businessId) {
                return rejectWithValue("Business ID not found");
            }

            const response = await ApiService.request(
                "GET",
                `${ENDPOINTS.RECEIPTS.ALL}${businessId}`
            );

            if (Array.isArray(response)) {
                return response;
            } else {
                return rejectWithValue("Invalid response format");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch receipts.";
                return rejectWithValue(message);
            }
            return rejectWithValue("Failed to fetch receipts.");
        }
    }
);

// Thunk to fetch receipts with date filters
export const fetchReceiptsWithFilters = createAsyncThunk(
    "receipts/fetchReceiptsWithFilters",
    async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const businessId = Storage.getItem("businessId");
            if (!businessId) {
                return rejectWithValue("Business ID not found");
            }

            const { startDate, endDate } = params;
            const url = `${ENDPOINTS.RECEIPTS.WITH_DATE_FILTERS}${businessId}&Start=${startDate}&End=${endDate}`;

            const response = await ApiService.request("GET", url);

            if (Array.isArray(response)) {
                return response;
            } else {
                return rejectWithValue("Invalid response format");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch filtered receipts.";
                return rejectWithValue(message);
            }
            return rejectWithValue("Failed to fetch filtered receipts.");
        }
    }
);

const receiptsSlice = createSlice({
    name: "receipts",
    initialState,
    reducers: {
        clearReceipts: (state) => {
            state.receipts = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReceipts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReceipts.fulfilled, (state, action: PayloadAction<Receipt[]>) => {
                state.loading = false;
                state.receipts = action.payload;
            })
            .addCase(fetchAllReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to fetch receipts.";
                if (typeof action.payload === "string") {
                    toast.error(action.payload);
                } else {
                    toast.error("Failed to fetch receipts.");
                }
            })
            .addCase(fetchReceiptsWithFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReceiptsWithFilters.fulfilled, (state, action: PayloadAction<Receipt[]>) => {
                state.loading = false;
                state.receipts = action.payload;
            })
            .addCase(fetchReceiptsWithFilters.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to fetch filtered receipts.";
                if (typeof action.payload === "string") {
                    toast.error(action.payload);
                } else {
                    toast.error("Failed to fetch filtered receipts.");
                }
            });
    },
});

export const { clearReceipts, clearError } = receiptsSlice.actions;
export default receiptsSlice.reducer; 