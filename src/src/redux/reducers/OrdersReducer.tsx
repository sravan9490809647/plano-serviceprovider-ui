import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import Storage from "../../utils/Storage";
import { ENDPOINTS } from "../../Constants";

// Define the Order interface based on the actual API response
export interface Customer {
    id: string;
    fullName: string;
    lastName: string;
    email: string;
    mobile: string;
}

export interface Order {
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

interface OrdersState {
    orders: Order[];
    orderedCount: number;
    loading: boolean;
    error: string | null;
}

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
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
                return rejectWithValue(response.message || 'Failed to fetch orders');
            }
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
        }
    }
);

// Async thunk to fetch orders with date filters
export const fetchOrdersWithFilters = createAsyncThunk(
    'orders/fetchOrdersWithFilters',
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const businessId = Storage.getItem("businessId");
            if (!businessId) {
                throw new Error('Business ID not found');
            }

            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.ORDERS.GET_ORDERS_WITH_FILTERS}${businessId}&Start=${startDate}&End=${endDate}`
            );
            if (response.status === 0) {
                return rejectWithValue(response.message || 'Failed to fetch orders');
            }
            return response;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders with filters');
        }
    }
);

const initialState: OrdersState = {
    orders: [],
    orderedCount: 0,
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState: initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
        silentUpdateOrders: (state, action) => {
            // Silent update without triggering loading states
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
        },
        setOrderedCount: (state, action) => {
            state.orderedCount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.orders = action.payload;
                }
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch orders';
            })
            .addCase(fetchOrdersWithFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersWithFilters.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.orders = action.payload;
                } else {
                    state.error = 'Invalid response format';
                }
            })
            .addCase(fetchOrdersWithFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch orders with filters';
            });
    },
});

export const { clearOrders, silentUpdateOrders, updateOrderStatus, setOrderedCount } = ordersSlice.actions;
export default ordersSlice.reducer; 