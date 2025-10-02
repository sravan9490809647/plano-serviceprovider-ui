import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  startIcon,
  endIcon,
  sx,
  onClick,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: 14,
        borderRadius: 2,
        height: 40,
        py: 1,
        px: 3,
        whiteSpace: "nowrap", // Prevent text wrapping
        overflow: "hidden", // Hide overflow
        textOverflow: "ellipsis",
        boxShadow: "none", // Remove box shadow effect
        "&:hover": {
          boxShadow: "none !important", // Remove box shadow on hover
        },
        "&:active": {
          boxShadow: "none", // Remove box shadow when pressed
        },
        "&:focus": {
          boxShadow: "none", // Remove box shadow on focus
        },
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
