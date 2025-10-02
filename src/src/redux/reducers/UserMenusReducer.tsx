import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import type { CategoryWithItems, MenuItem } from "../../types";
import axios from "axios";
import { toast } from "react-toastify";

interface MenuState {
  categoryWithItems: CategoryWithItems[];
  items: MenuItem[];
  loading: boolean;
  menuLoading: boolean;
  itemDetails: MenuItem | null;
  error: string | null;
}

const initialState: MenuState = {
  categoryWithItems: [],
  items: [],
  loading: false,
  menuLoading: false,
  itemDetails: null,
  error: null,
};

// Thunk to fetch menus by category
export const fetchGetCategoryAndItemsByBusinessId = createAsyncThunk(
  "menus/fetchGetCategoryAndItemsByBusinessId",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.MENUS.BY_BUSINESS_ID}${businessId}`
      );
      return response; // Return the fetched menus
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch menus.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to fetch menus.");
    }
  }
);
// Thunk to fetch all items
export const fetchAllItems = createAsyncThunk(
  "menus/fetchAllItems",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.MENUS.ALL_ITEMS}${businessId}`
      );
      return response; // Return the fetched items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all items.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to fetch all items.");
    }
  }
);
export const fetchItemsByCategoryId = createAsyncThunk(
  "menus/fetchItemsByCategoryId",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.MENUS.BY_CATEGORY}${categoryId}`
      );
      return response; // Return the fetched items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch items.";
        return rejectWithValue(message);
      }
      return rejectWithValue("");
    }
  }
);
export const getItemById = createAsyncThunk(
  "menus/getItemById",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.MENUS.ITEM_BY_ID}${itemId}`
      );
      if (!response.id) {
        return rejectWithValue(
          response?.message || "Item details fetching failed."
        );
      }
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Item details fetching failed.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Item details fetching failed.");
    }
  }
);
const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    fetchMenusRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMenusSuccess(state, action: PayloadAction<CategoryWithItems[]>) {
      state.loading = false;
      state.categoryWithItems = action.payload;
    },
    fetchMenusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearMenuItems(state) {
      state.items = [];
    },
    clearItemDetails(state) {
      state.itemDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetCategoryAndItemsByBusinessId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGetCategoryAndItemsByBusinessId.fulfilled,
        (state, action: PayloadAction<CategoryWithItems[]>) => {
          state.loading = false;
          state.categoryWithItems = action.payload;
        }
      )
      .addCase(
        fetchGetCategoryAndItemsByBusinessId.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : "Failed to fetch menus.";
          if (typeof action.payload === "string") {
            toast.error(action.payload);
          } else {
            toast.error("Failed to fetch menus.");
          }
        }
      )
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllItems.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.loading = false;
          state.items = action.payload; // Update items with fetched data
        }
      )
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch all items.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to fetch all items.");
        }
      })
      .addCase(fetchItemsByCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchItemsByCategoryId.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchItemsByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch items.";
        if (typeof action.payload === "string") {
          // toast.error(action.payload);
        } else {
          // toast.error("Failed to fetch items.");
        }
      })
      .addCase(getItemById.pending, (state) => {
        state.menuLoading = true;
        state.error = null;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.menuLoading = false;
        if (action.payload.id) {
          state.itemDetails = action.payload;
        }
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.menuLoading = false;
        toast.error("Failed to fetch item details");
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch item details";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to fetch item details.");
        }
      });
  },
});

export const {
  fetchMenusRequest,
  fetchMenusSuccess,
  fetchMenusFailure,
  clearMenuItems,
  clearItemDetails,
} = menusSlice.actions;

export default menusSlice.reducer;
