import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ItemVariation, OptionGroup } from "../../types";

export interface CartItem {
  itemId: string;
  title: string; // 🔷 title should always be present
  quantity: number;
  price: number;
  thumbnailImage?: string | null; // 🔷 thumbnailImage can be null if not applicable
  totalPrice?: number; // 🔷 totalPrice is derived from quantity * price
  variation?: ItemVariation | null; // 🔷 variations can be null if not applicable
  optionGroups?: OptionGroup[];
  removedIngredients?: string[]; // 🔷 ingredients can be null if not applicable
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.itemId === action.payload.itemId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        // Update totalPrice if provided in the new item
        if (action.payload.totalPrice !== undefined) {
          existingItem.totalPrice = action.payload.totalPrice;
        }
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ itemId: string; quantity?: number }>
    ) => {
      const { itemId, quantity = 1 } = action.payload;
      const index = state.items.findIndex((item) => item.itemId === itemId);
      if (index !== -1) {
        if (state.items[index].quantity > quantity) {
          state.items[index].quantity -= quantity;
        } else {
          state.items.splice(index, 1);
        }
      }
    },
    deleteFromCart: (state, action: PayloadAction<{ itemId: string }>) => {
      state.items = state.items.filter(
        (item) => item.itemId !== action.payload.itemId
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
