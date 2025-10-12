import React from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import type { MenuItem } from "../../types";
import type { RootState } from "../../redux/store";
import MenuItemCard from "./MenuItem";
import type { CartItem } from "../../redux/reducers/Cart";

interface IMenuListItems {
  items: MenuItem[];
  handleAdd: (item: MenuItem) => void;
  handleRemove: (itemId: string) => void;
  isCart?: boolean;
  onDelete?: (itemId: string) => void;
}

const MenuListItems: React.FC<IMenuListItems> = ({
  items,
  handleAdd,
  handleRemove,
  isCart = false,
  onDelete,
}) => {
  const cartItems = useSelector<RootState, CartItem[]>(
    (state) => state.cart.items
  );

  const getQuantity = (itemId: string): number => {
    const cartItem = cartItems.find((ci) => ci.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 1.5, md: 2 }}
      sx={{
        width: "100%",
        margin: 0,
      }}
    >
      {items.length > 0 && items.map((item) => (
        <Grid
          item
          xs={12}
          sm={isCart ? 12 : 6}
          md={isCart ? 12 : 4}
          lg={isCart ? 12 : 3}
          key={item.id}
        >
          <MenuItemCard
            item={item}
            quantity={getQuantity(item.id)}
            handleAdd={() => handleAdd(item)}
            handleRemove={() => handleRemove(item.id)}
            isCart={isCart}
            onDelete={onDelete ? () => onDelete(item.id) : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default MenuListItems;
