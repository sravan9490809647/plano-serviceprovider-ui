import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import axios from "axios";

interface TableDetails {
    id: string;
    sId: string;
    bId: string;
    tableNumber: number;
    tableName: string;
    capacity: number | null;
    tableType: string | null;
    description: string | null;
    image: string | null;
    isOccupied: boolean;
    note: string | null;
    rtId: string;
    waiterRequest: boolean;
    checkOutRequest: boolean;
    createdById: string;
    createdOn: string;
    modifiedById: string;
    modifiedOn: string;
    status: boolean;
}

interface TableState {
    tableDetails: TableDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: TableState = {
    tableDetails: null,
    loading: false,
    error: null,
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTableDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchTableDetails.fulfilled,
                (state, action: PayloadAction<TableDetails>) => {
                    state.loading = false;
                    state.tableDetails = action.payload;
                }
            )
            .addCase(fetchTableDetails.rejected, (state, action) => {
                state.loading = false;
                if (typeof action.payload === "string") {
                    toast.error(action.payload);
                } else {
                    toast.error("Failed to fetch table details.");
                }
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : "Failed to fetch table details.";
            });
    },
});

export const fetchTableDetails = createAsyncThunk(
    "table/fetchTableDetails",
    async (tableId: string, { rejectWithValue }) => {
        try {
            const response = await ApiService.request(
                "GET",
                `${ENDPOINTS.TABLES.GET_TABLE_DETAILS}${tableId}`
            );
            if (response.status === 0) {
                return rejectWithValue(response.message || "Table not found.");
            }
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to get table details.";
                return rejectWithValue(message);
            }
            return rejectWithValue("Failed to get table details.");
        }
    }
);

export default tableSlice.reducer; 