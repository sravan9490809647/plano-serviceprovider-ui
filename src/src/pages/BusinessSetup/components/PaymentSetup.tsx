import React from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { CustomSwitch } from "../../../Styles";

interface PaymentSetupProps {
  payments: Record<string, boolean>;
  onChange: (method: string, value: boolean) => void;
}

const paymentMethods = [
  "Cash",
  "Card",
  "Pay Online",
  "Google Pay",
  "Apple Pay",
  "UPI / Wallets",
  "PayPal",
];

const PaymentSetup: React.FC<PaymentSetupProps> = ({ payments, onChange }) => {
  return (
    <CustomPaperWrapper>
      <Box display="flex" gap={1} alignItems="center">
        <CreditCardIcon />
        <Typography variant="h5" mb={1}>Payment Setup</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
        Configure how customers can pay you
      </Typography>

      <FormControlLabel
        control={<Checkbox checked disabled />}
        label={
          <Typography variant="body1">
            Enable or disable the payment methods you accept at your venue. You
            can update these anytime.
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      {paymentMethods.map((method) => (
        <Box
          key={method}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={2}
        >
          <Typography variant="h5">{`Accept ${method}:`}</Typography>
          <CustomSwitch
            checked={payments[method] || false}
            onChange={(e) => onChange(method, e.target.checked)}
          />
        </Box>
      ))}
    </CustomPaperWrapper>
  );
};

export default PaymentSetup;
