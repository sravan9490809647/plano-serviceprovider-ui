import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../redux/reducers/Cart";
import CustomButton from "../../../components/Button";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import HomeIcon from "@mui/icons-material/Home";
import type { BusinessDetails } from "../../../types";

interface Props {
  orderId: string;
}

const OrderConfirmation: React.FC<Props> = ({ orderId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { businessDetails } = useSelector(
    (state: {
      businessDetails: {
        businessDetails: BusinessDetails | null;
      };
    }) => state.businessDetails
  );
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const estimatedDelivery = `${Math.floor(30 + Math.random() * 5)}-${Math.floor(
    45 + Math.random() * 5
  )} minutes`;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      width="100%"
      bgcolor="#f9fafb"
      p={2}
    >
      <CustomPaperWrapper
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "green", mb: 1 }} />

        <Typography variant="h5" fontWeight={700} color="green" mb={1}>
          Order Confirmed!
        </Typography>

        <Typography variant="body2" mb={2}>
          Your order has been placed successfully
        </Typography>

        <Box
          sx={{
            bgcolor: "#f3f4f6",
            p: 1,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Order #{orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Estimated delivery: {estimatedDelivery}
          </Typography>
        </Box>

        <Typography variant="body2" mb={2}>
          We'll send you updates about your order status
        </Typography>

        <Box
          sx={{
            bgcolor: "#fff7ed",
            p: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#ea580c" mb={1}>
            Thank you for choosing {businessDetails?.businessName || ""}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your delicious meal is being prepared with care
          </Typography>
        </Box>

        <CustomButton
          fullWidth
          onClick={() => navigate(-1)}
          startIcon={<HomeIcon />}
        >
          Back to Menu
        </CustomButton>
      </CustomPaperWrapper>
    </Box>
  );
};

export default OrderConfirmation;
