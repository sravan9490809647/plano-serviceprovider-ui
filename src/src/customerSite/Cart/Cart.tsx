import { Box, Typography, Divider } from "@mui/material";
import DialogWrapper from "../components/DialogWrapper";
import CustomButton from "../components/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CURRENCY, FONT_FAMILY } from "../../Constants";
import { clearCart, type CartItem } from "../../redux/reducers/Cart";
import SelectedMenuList from "./SelectedMenuList";

interface CartListProps {
  cartItems: CartItem[];
  setCartOpen: (open: boolean) => void;
  opencart: boolean;
  businessId: string; // Added businessId prop
}

const CartList: React.FC<CartListProps> = ({
  cartItems,
  setCartOpen,
  opencart,
  businessId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, cartItem) => {
      // Calculate base price (use variation price if available)
      const basePrice = cartItem.variation ? cartItem.variation.price : cartItem.price;

      // Calculate options price
      const optionsPrice = cartItem.optionGroups?.reduce((sum, group) => {
        return sum + group.options.reduce((groupSum, option) => groupSum + option.price, 0);
      }, 0) || 0;

      // Calculate total price per item
      const pricePerItem = basePrice + optionsPrice;

      // Calculate total for this item (price per item * quantity)
      const itemTotal = pricePerItem * cartItem.quantity;
      return acc + itemTotal;
    },
    0
  );

  const handleCheckout = () => {
    navigate(`/${businessId}/checkout`);
    setCartOpen(false);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <DialogWrapper
      title={`🛒 Your Cart (${cartItems.length} items)`}
      onClose={() => setCartOpen(false)}
      open={opencart}
    >
      {cartItems.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>Your cart is empty</Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          sx={{ height: "100%", minHeight: 400 }}
        >
          {/* Scrollable list */}
          <Box flex={1} overflow="auto" pr={1}>
            <SelectedMenuList cartItems={cartItems} from="cart" />
          </Box>

          {/* Sticky footer */}
          <Box
            mt={1}
            sx={{
              position: "sticky",
              bottom: 0,
              background: "#fff",
              pt: 1,
              zIndex: 1,
            }}
          >
            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>
                Total
              </Typography>
              <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>
                {CURRENCY.symbol} {total.toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" gap={1}>
              <CustomButton variant="text" fullWidth onClick={handleClearCart}>
                Clear Cart
              </CustomButton>
              <CustomButton fullWidth onClick={handleCheckout}>
                Checkout
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}
    </DialogWrapper>
  );
};

export default CartList;
