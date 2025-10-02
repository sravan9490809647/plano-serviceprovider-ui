import { Box, Divider, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Input from "../../components/Input";
import CustomButton from "../../components/Button";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";

import type { RootState } from "../../redux/store";
import OrderConfirmation from "./components/OrderConfirmation";
import { CURRENCY, ENDPOINTS, FONT_FAMILY } from "../../Constants";
import SelectedMenuList from "../Cart/SelectedMenuList";
import type { Offer } from "../../types";
import ApiService from "../../services/ApiService";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import StorageService from "../../../services/StorageService";
import { clearCart, type CartItem } from "../../redux/reducers/Cart";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { businessId } = useParams<{ businessId: string }>(); // ✅ Get from URL
  const { offersList } = useSelector(
    (state: { offers: { offersList: Offer[]; loading: boolean } }) =>
      state.offers
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved user details on component mount
  useEffect(() => {
    const savedUserDetails = StorageService.getItem('userDetails');
    if (savedUserDetails) {
      try {
        const parsedDetails = JSON.parse(savedUserDetails);
        setUserDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing saved user details:', error);
      }
    }
  }, []);

  const cartItems = useSelector<RootState, CartItem[]>(
    (state) => state.cart.items
  );

  const subtotal = cartItems.reduce(
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

      console.log('Checkout item total calculation:', {
        title: cartItem.title,
        basePrice,
        optionsPrice,
        pricePerItem,
        quantity: cartItem.quantity,
        itemTotal,
        variation: cartItem.variation?.title,
        optionGroups: cartItem.optionGroups?.map(g => ({
          title: g.title,
          options: g.options.map(o => ({ title: o.title, price: o.price }))
        }))
      });

      return acc + itemTotal;
    },
    0
  );
  const total = subtotal.toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      // Only allow digits on mobile
      const numericValue = value.replace(/\D/g, "");
      setUserDetails((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!userDetails.firstName.trim())
      errs.firstName = "First name is required.";
    if (!userDetails.lastName.trim()) errs.lastName = "Last name is required.";
    if (!userDetails.email.trim() || !/\S+@\S+\.\S+/.test(userDetails.email)) {
      errs.email = "Valid email is required.";
    }

    if (!userDetails.mobile || !/^\d{10,15}$/.test(userDetails.mobile)) {
      errs.mobile = "Valid mobile number (10–15 digits) is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const offerMap = offersList.reduce((acc, offer) => {
      (offer.qualifyingItems || []).forEach((itemId) => {
        acc[itemId] = offer;
      });
      return acc;
    }, {} as Record<string, Offer>);

    const orderPayload = {
      bId: businessId,
      totalPrice: parseFloat(total),
      customer: {
        fullName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        mobile: userDetails.mobile,
      },
      items: cartItems.map((item) => {
        const offer = offerMap[item.itemId];
        return {
          id: item.itemId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          itemVariations: JSON.stringify(item.variation),
          optionGroups: JSON.stringify(item.optionGroups || []),
          removeIngredients: JSON.stringify(item.removedIngredients || []),
          thumbnailImage: item?.thumbnailImage || null,
          appliedOffers: offer
            ? JSON.stringify({
              id: offer.id,
              title: offer.title,
              type: offer.type,
              ...(offer.type === "Buy1GetFreeItem" && {
                freeItems: offer.freeItems,
              }),
              ...(offer.type === "PercentageWholeOrder" && {
                percentage: offer.percentage,
              }),
            })
            : null,
        };
      }),
    };
    const tableId = StorageService.getItem('tableId');
    if (tableId) {
      (orderPayload as any).tableId = tableId;
    }
    try {
      setLoading(true);
      const response = await ApiService.request(
        "POST",
        `${ENDPOINTS.ORDERS.CREATE_ORDER}`,
        orderPayload
      );
      setLoading(false);
      if (response.status === 1) {
        // Save user details for future orders
        StorageService.setItem('userDetails', JSON.stringify(userDetails));

        dispatch(clearCart());
        setOrderId(response.orderCode);
        setShowConfirmation(true);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch {
      setLoading(false);
      toast.error("Failed to place order.");
    }
  };

  return (
    <Box p={2} display="flex" justifyContent="center">
      {loading && <Loader />}
      <Box>
        {showConfirmation ? <OrderConfirmation orderId={orderId} /> : (
          <>
            <CustomButton
              variant="text"
              sx={{ mb: 2 }}
              onClick={() => navigate(-1)}
            >
              &larr; Back to Cart
            </CustomButton>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CustomPaperWrapper>
                  <Typography variant="h5" sx={{ fontFamily: FONT_FAMILY.BOLD, mb: 2 }}>
                    Order Summary
                  </Typography>
                  <SelectedMenuList cartItems={cartItems} from="checkout" />
                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" justifyContent="space-between" mt={1} mb={1}>
                    <Typography variant="h6" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {CURRENCY.symbol}
                      {total}
                    </Typography>
                  </Box>
                </CustomPaperWrapper>
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomPaperWrapper sx={{ p: 2 }}>
                  <Typography variant="h5" sx={{ fontFamily: FONT_FAMILY.BOLD, mb: 2 }}>
                    Customer Details
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        fullWidth
                        label="First Name"
                        name="firstName"
                        placeholder="Enter first name"
                        value={userDetails.firstName}
                        onChange={handleInputChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter last name"
                        value={userDetails.lastName}
                        onChange={handleInputChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        fullWidth
                        label="Email"
                        name="email"
                        placeholder="Enter email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        fullWidth
                        label="Mobile Number"
                        name="mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={userDetails.mobile}
                        onChange={handleInputChange}
                        error={!!errors.mobile}
                        helperText={errors.mobile}
                      />
                    </Grid>
                  </Grid>

                  <CustomButton fullWidth sx={{ mt: 3 }} disabled={cartItems.length === 0} onClick={handlePlaceOrder}>
                    Place Order - {CURRENCY.symbol}
                    {total}
                  </CustomButton>
                </CustomPaperWrapper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CheckoutPage;
