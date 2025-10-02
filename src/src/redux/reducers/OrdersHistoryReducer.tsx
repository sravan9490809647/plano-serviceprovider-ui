import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import Storage from "../../utils/Storage";

// Define the Order interface based on the actual API response
export interface Customer {
    id: string;
    fullName: string;
    lastName: string;
    email: string;
    mobile: string;
}

export interface OrderHistory {
    id: string;
    userId: string;
    bId: string;
    orderCode: string;
    totalPrice: number;
    note: string;
    appliedOffers: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    tId: string;
    tableName: string;
    createdOn: string;
    updatedOn: string;
    customer: Customer;
}

interface OrdersHistoryState {
    orders: OrderHistory[];
    loading: boolean;
    error: string | null;
}

// Async thunk to fetch all orders for history
export const fetchOrdersHistory = createAsyncThunk(
    'ordersHistory/fetchOrdersHistory',
    async (_, { rejectWithValue }) => {
        try {
            const businessId = Storage.getItem("businessId");
            if (!businessId) {
                throw new Error('Business ID not found');
            }

            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.ORDERS.GET_ORDERS}${businessId}`
            );

            if (response.status === 0) {
                return rejectWithValue(response.message || 'Failed to fetch orders history');
            }
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders history');
        }
    }
);

const initialState: OrdersHistoryState = {
    orders: [],
    loading: false,
    error: null,
};

const ordersHistorySlice = createSlice({
    name: "ordersHistory",
    initialState: initialState,
    reducers: {
        clearOrdersHistory: (state) => {
            state.orders = [];
            state.error = null;
        },
        updateOrdersHistory: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.orders = action.payload;
                state.error = null;
            }
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const orderIndex = state.orders.findIndex(order => order.id === id);
            if (orderIndex !== -1) {
                state.orders[orderIndex].orderStatus = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(fetchOrdersHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch orders history';
            });
    },
});

export const { clearOrdersHistory, updateOrdersHistory, updateOrderStatus } = ordersHistorySlice.actions;
export default ordersHistorySlice.reducer; 