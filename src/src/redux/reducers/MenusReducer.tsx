import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import type { CategoryWithItems, MenuItem } from "../../types";
import { toast } from "react-toastify";
import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

interface MenuState {
  categoryWithItems: CategoryWithItems[];
  items: MenuItem[];
  itemDetails: MenuItem | null;
  loading: boolean;
  menuLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categoryWithItems: [],
  items: [],
  itemDetails: null,
  loading: false,
  menuLoading: false,
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

// Thunk to add a new menu item
export const addMenuItem = createAsyncThunk(
  "menus/addMenuItem",
  async (menuItem: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.MENUS.ADD_ITEM,
        menuItem
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Item adding failed.");
      }

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to add menu item.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Unexpected error while adding menu item.");
    }
  }
);
export const editMenuItem = createAsyncThunk(
  "menus/editMenuItem",
  async (menuItem: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.MENUS.EDIT_ITEM,
        menuItem
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Failed to edit menu item.");
      }

      return response; // Return the added menu item
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to edit menu item";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to edit menu item.");
    }
  }
);
export const updateMenuItemStockAvailability = createAsyncThunk(
  "menus/updateMenuItemStockAvailability",
  async (
    { id, inStock }: { id: string; inStock: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.request(
        "GET",
        `${ENDPOINTS.MENUS.STOCK_AVAILABILITY_UPDATE}/?Id=${id}&InStock=${inStock}`
      );
      if (response.status !== 1) {
        return rejectWithValue(
          response.message || "Item status update failed."
        );
      }
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete menu item.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to delete menu item.");
    }
  }
);
export const deleteMenuItem = createAsyncThunk(
  "menus/deleteMenuItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "DELETE",
        `${ENDPOINTS.MENUS.DELETE_ITEM}${itemId}`
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Item delete failed.");
      }
      return { status: response.status, itemId }; // Send back deleted ID
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete menu item.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to delete menu item.");
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
export const processMenuFiles = async (
  files: File[],
  businessId: string,
  navigate: NavigateFunction
) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    // delay toast by 3 seconds
    setTimeout(() => {
      toast.info(
        "Your menu is being prepared. This may take a few minutes. You’ll receive an email when it’s ready."
      );
      navigate(-1);
    }, 3000);
    await ApiService.request(
      "POST",
      `${ENDPOINTS.MENUS.MENU_UPLOAD}${businessId}`,
      formData
    );
  } catch (err) {
    // toast.error("Failed to upload menu files.");
    console.error(err);
  }
};
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // use correct key
    const response = await ApiService.request(
      "POST",
      `${ENDPOINTS.UPLOAD_IMAGE}`,
      formData
    );
    return response; // assume response has { status, data: { url } }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image.";
      throw new Error(message);
    }
    throw new Error("Unexpected error during image upload.");
  }
};

export const swapCategoryOrder = createAsyncThunk(
  "menus/swapCategoryOrder",
  async (
    { id, rearrangeOrderNumber }: { id: string; rearrangeOrderNumber: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.CATEGORIES.SWAP_CATEGORY_ORDER,
        {
          id,
          rearrangeOrderNumber: rearrangeOrderNumber + 1,
        }
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Failed to swap category order.");
      }

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to swap category order.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to swap category order.");
    }
  }
);

// Add this new async thunk after the swapCategoryOrder thunk
export const swapItemOrder = createAsyncThunk(
  "menus/swapItemOrder",
  async (
    { id, rearrangeOrderNumber }: { id: string; rearrangeOrderNumber: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.MENUS.SWAP_ITEM_ORDER,
        {
          id,
          rearrangeOrderNumber: rearrangeOrderNumber + 1,
        }
      );

      if (response.status !== 1) {
        return rejectWithValue(response.message || "Failed to swap item order.");
      }

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to swap item order.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to swap item order.");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "menus/deleteCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.request(
        "DELETE",
        `${ENDPOINTS.CATEGORIES.DELETE_CATEGORY}${categoryId}`
      );
      if (response.status !== 1) {
        return rejectWithValue(response.message || "Failed to delete category.");
      }

      return { status: response.status, categoryId };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete category.";
        return rejectWithValue(message);
      }
      return rejectWithValue("Failed to delete category.");
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
    reorderCategories(state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) {
      const { oldIndex, newIndex } = action.payload;
      const categories = [...state.categoryWithItems];
      const [movedCategory] = categories.splice(oldIndex, 1);
      categories.splice(newIndex, 0, movedCategory);

      // Update order property for all categories
      categories.forEach((categoryWithItems, index) => {
        categoryWithItems.category.order = index;
      });

      state.categoryWithItems = categories;
    },
    reorderItemsInCategory(state, action: PayloadAction<{
      categoryId: string;
      oldIndex: number;
      newIndex: number
    }>) {
      const { categoryId, oldIndex, newIndex } = action.payload;
      const categoryIndex = state.categoryWithItems.findIndex(
        cat => cat.category.id === categoryId
      );

      if (categoryIndex !== -1) {
        const items = [...state.categoryWithItems[categoryIndex].items];
        const [movedItem] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, movedItem);

        // Update order property for all items in the category
        items.forEach((item, index) => {
          item.order = index;
        });

        state.categoryWithItems[categoryIndex].items = items;
      }
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
      .addCase(addMenuItem.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 1) {
          toast.success(`Item added successfully`);
        } else {
          toast.error(`Item adding failed`);
          state.error = "";
        }
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to add menu item.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to add menu item.");
        }
      })
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
      .addCase(editMenuItem.pending, (state) => {
        state.error = null;
        state.menuLoading = true;
      })
      .addCase(
        editMenuItem.fulfilled,
        (state, action: PayloadAction<{ status: number; data: MenuItem }>) => {
          state.menuLoading = false;
          if (action.payload.status === 1) {
            toast.success("Menu item updated successfully");
          } else {
            toast.error("Failed to update menu item");
            state.error = "Failed to update menu item.";
          }
        }
      )
      .addCase(editMenuItem.rejected, (state, action) => {
        state.menuLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to edit menu item.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to edit menu item.");
        }
      })
      .addCase(updateMenuItemStockAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMenuItemStockAvailability.fulfilled,
        (state, action: PayloadAction<{ status: number; data: MenuItem }>) => {
          state.menuLoading = false;
          state.loading = false;
          if (action.payload.status === 1) {
            const updatedItem = action.payload.data;

            // Update in items array
            state.items = state.items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            );

            // Update in categoryWithItems
            const categoryIndex = state.categoryWithItems.findIndex(
              (cat) => cat.category.id === updatedItem.cId
            );
            if (categoryIndex !== -1) {
              const itemIndex = state.categoryWithItems[
                categoryIndex
              ].items.findIndex((item) => item.id === updatedItem.id);
              if (itemIndex !== -1) {
                state.categoryWithItems[categoryIndex].items[itemIndex] =
                  updatedItem;
              }
            }

            toast.success("Menu item status updated successfully");
          } else {
            toast.error("Failed to update menu item status");
            state.error = "Failed to update menu item status.";
          }
        }
      )
      .addCase(updateMenuItemStockAvailability.rejected, (state, action) => {
        state.menuLoading = false;
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update menu item status.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to update menu item status.");
        }
      })
      .addCase(deleteMenuItem.pending, (state) => {
        // Don't set loading = true to avoid screen reload effect
        state.error = null;
      })
      .addCase(
        deleteMenuItem.fulfilled,
        (state, action: PayloadAction<{ status: number; itemId: string }>) => {
          // Don't set loading = false since we didn't set it to true
          if (action.payload.status === 1) {
            const itemId = action.payload.itemId;

            // Remove from items array
            state.items = state.items.filter((item) => item.id !== itemId);

            // Remove from categoryWithItems
            state.categoryWithItems = state.categoryWithItems.map((cat) => ({
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
            }));

            toast.success("Menu item deleted successfully");
          } else {
            toast.error("Failed to delete menu item");
          }
        }
      )
      .addCase(deleteMenuItem.rejected, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        toast.error("Failed to delete menu item");
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to delete menu item.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to delete menu item.");
        }
      })
      .addCase(getItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.id) {
          state.itemDetails = action.payload;
        }
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.loading = false;
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
      })
      .addCase(swapCategoryOrder.pending, (state) => {
        // Don't set loading = true to avoid screen reload effect
        state.error = null;
      })
      .addCase(swapCategoryOrder.fulfilled, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        if (action.payload.status === 1) {
          toast.success(action.payload.message || "Category order updated successfully");
        } else {
          toast.error("Failed to update category order");
          state.error = "Failed to update category order.";
        }
      })
      .addCase(swapCategoryOrder.rejected, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to swap category order.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to swap category order.");
        }
      })
      .addCase(swapItemOrder.pending, (state) => {
        // Don't set loading = true to avoid screen reload effect
        state.error = null;
      })
      .addCase(swapItemOrder.fulfilled, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        if (action.payload.status === 1) {
          toast.success(action.payload.message || "Item order updated successfully");
        } else {
          toast.error("Failed to update item order");
          state.error = "Failed to update item order.";
        }
      })
      .addCase(swapItemOrder.rejected, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to swap item order.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to swap item order.");
        }
      })
      .addCase(deleteCategory.pending, (state) => {
        // Don't set loading = true to avoid screen reload effect
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        if (action.payload.status === 1) {
          const categoryId = action.payload.categoryId;

          // Remove the category from categoryWithItems
          state.categoryWithItems = state.categoryWithItems?.filter(
            cat => cat.category.id !== categoryId
          );

          toast.success("Category deleted successfully");
        } else {
          toast.error("Failed to delete category");
          state.error = "Failed to delete category.";
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        // Don't set loading = false since we didn't set it to true
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to delete category.";
        if (typeof action.payload === "string") {
          toast.error(action.payload);
        } else {
          toast.error("Failed to delete category.");
        }
      });
  },
});

export const {
  fetchMenusRequest,
  fetchMenusSuccess,
  fetchMenusFailure,
  reorderCategories,
  reorderItemsInCategory,
} = menusSlice.actions;

export default menusSlice.reducer;
