import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // Use type-only import for PayloadAction

import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import type { MenuCategory } from "../../types";
import { toast } from "react-toastify";
import axios from "axios";

interface CategoryState {
  categoriesList: MenuCategory[];
  loading?: boolean;
  error?: string | null;
}

const initialState: CategoryState = {
  categoriesList: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.categoriesList.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.categoriesList = state.categoriesList.filter(
        (category) => category !== action.payload
      );
    },
    getCategories: (state, action: PayloadAction<MenuCategory[]>) => {
      state.categoriesList = action.payload; // Replace the current categories with the new ones
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesByBusinessId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoriesByBusinessId.fulfilled,
        (state, action: PayloadAction<MenuCategory[]>) => {
          state.loading = false;
          state.categoriesList = action.payload; // Update categories with fetched data
        }
      )
      .addCase(fetchCategoriesByBusinessId.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to fetch menus.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch menus.";
      })
      .addCase(onAddCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(onAddCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesList.push(action.payload.data); // Add the new category to the list
      })
      .addCase(onAddCategory.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to add category.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to add category.";
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCategories.fulfilled,
        (state, action: PayloadAction<MenuCategory[]>) => {
          state.loading = false;
          state.categoriesList = action.payload; // Update categories with fetched data
        }
      )
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to fetch all categories.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch all categories.";
      })
      .addCase(onEditCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(
        onEditCategory.fulfilled,
        (
          state,
          action: PayloadAction<{ status: number; data: MenuCategory }>
        ) => {
          state.loading = false;
          if (action.payload.status === 1) {
            toast.success("Category updated successfully.");
            const updatedCategory = action.payload.data;
            const index = state.categoriesList.findIndex(
              (c) => c.id === updatedCategory.id
            );
            if (index !== -1) {
              state.categoriesList[index] = updatedCategory;
            }
          }
        }
      )
      .addCase(onEditCategory.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to update category.");
        }
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update category.";
      });
  },
});

// Thunk to fetch menus by category
export const fetchCategoriesByBusinessId = createAsyncThunk(
  "menus/fetchCategoriesByBusinessId",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.CATEGORIES.BY_BUSINESS_ID}${businessId}`
      );
      return response;
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
export const onAddCategory = createAsyncThunk(
  "category/addCategory",
  async (category: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.CATEGORIES.ADD_CATEGORY,
        category
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Failed to add category.");
      }
      return response; // Return the added category
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to add category.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to add category.");
    }
  }
);
export const onEditCategory = createAsyncThunk(
  "category/editCategory",
  async (category: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.CATEGORIES.EDIT_CATEGORY,
        category
      );
      if (response.status !== 1) {
        return rejectWithValue(
          response.message || "Failed to update category."
        );
      }
      return response; // Return the added category
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to update category.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to update category.");
    }
  }
);
export const fetchAllCategories = createAsyncThunk(
  "category/fetchCategories",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.CATEGORIES.ALL_CATEGORIES}${businessId}`
      );
      return response; // Return the fetched items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to fetch categories.");
    }
  }
);

export const { addCategory, removeCategory, getCategories } =
  categorySlice.actions;

export default categorySlice.reducer;
