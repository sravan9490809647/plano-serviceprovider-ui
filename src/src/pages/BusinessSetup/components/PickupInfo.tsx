import React from "react";
import { Box } from "@mui/material";
import Input from "../../../components/Input";
import type { PickupInfoState } from "../../../types";

interface IPickupInfo {
  address: PickupInfoState;
  setAddress: React.Dispatch<React.SetStateAction<PickupInfoState>>;
  errors?: Record<string, string>;
  clearError: (field: string) => void;
}

const PickupInfo: React.FC<IPickupInfo> = ({
  address,
  setAddress,
  errors = {},
  clearError,
}) => {
  return (
    <Box>
      <Input
        label="Pickup Instructions *"
        placeholder="e.g., Wait by the red food truck near main entrance"
        fullWidth
        multiline
        minRows={3}
        value={address.instructions}
        onChange={(e) => {
          const val = e.target.value;
          setAddress((prev) => ({ ...prev, instructions: val }));
          if (errors.instructions) {
            clearError("instructions");
          }
        }}
        error={!!errors.instructions}
        helperText={errors.instructions}
      />
    </Box>
  );
};

export default PickupInfo;
