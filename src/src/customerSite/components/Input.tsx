import React from "react";
import { TextField, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

type CustomInputProps = TextFieldProps & {
  startIcon?: React.ReactNode; // Optional icon
};

const Input: React.FC<CustomInputProps> = ({
  placeholder = "Enter text...",
  startIcon,
  sx,
  onChange, // Ensure onChange is passed as a prop
  error, // Error state
  helperText, // Helper text for validation messages
  fullWidth = false, // Default fullWidth to false
  ...props
}) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        startAdornment: startIcon ? (
          <Typography variant="body2">{startIcon}</Typography>
        ) : undefined, // Render only if startIcon is provided
      }}
      sx={{
        minHeight: 30,
        borderRadius: 2,
        ...(fullWidth ? {} : { minWidth: 250 }), // Apply minWidth only if fullWidth is false
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          fontSize: 14,
          "&.Mui-error": {
            borderColor: "red", // Red border when error is true
          },
        },
        "& .MuiFormHelperText-root": {
          color: error ? "red" : "inherit", // Red helper text when error is true
        },
        mb: 1,
        ...sx,
      }}
      onChange={onChange} // Pass the onChange prop to the TextField
      error={error} // Pass error state to TextField
      helperText={helperText} // Pass helper text to TextField
      fullWidth={fullWidth} // Ensure fullWidth is passed to TextField
      {...props}
    />
  );
};

export default Input;
