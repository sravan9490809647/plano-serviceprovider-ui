import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import type { Table } from "../../types";

interface TablesState {
    tables: Table[];
    unseenMessagesCount: number;
    loading: boolean;
    error: string | null;
}

// Async thunk for fetching tables
export const fetchTables = createAsyncThunk(
    "tables/fetchTables",
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLES}?BusinessId=${businessId}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState: TablesState = {
    tables: [],
    unseenMessagesCount: 0,
    loading: false,
    error: null,
};

const tablesSlice = createSlice({
    name: "tables",
    initialState: initialState,
    reducers: {
        silentUpdateTables: (state, action) => {
            // Silent update without triggering loading states
            if (Array.isArray(action.payload)) {
                state.tables = action.payload;
                state.error = null;
            }
        },
        setUnseenMessagesCount: (state, action) => {
            state.unseenMessagesCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.tables = action.payload;
                } else {
                    state.error = 'Invalid response format';
                }
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch tables';
            });
    },
});

export const { silentUpdateTables, setUnseenMessagesCount } = tablesSlice.actions;
export default tablesSlice.reducer; 