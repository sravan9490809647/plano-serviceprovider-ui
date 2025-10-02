import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

type CustomInputProps = TextFieldProps & {
  startIcon?: React.ReactNode;
  inputStyles?: React.CSSProperties;
};

const Input: React.FC<CustomInputProps> = ({
  placeholder = "Enter text...",
  startIcon,
  sx,
  onChange,
  error,
  helperText,
  fullWidth = false,
  inputStyles,
  multiline,
  maxRows,
  ...props
}) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        startAdornment: startIcon ? startIcon : undefined,
        sx: {
          "& input": inputStyles
            ? inputStyles
            : {
              padding: "16px",
            },
        },
      }}
      sx={{
        // minHeight: 30,
        borderRadius: 2,
        ...(fullWidth ? {} : { minWidth: 250 }),
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          fontSize: 14,
          "&.Mui-error": {
            borderColor: "red",
          },
        },
        "& .MuiFormHelperText-root": {
          color: error ? "red" : "inherit",
        },
        ...sx,
      }}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={maxRows}
      {...props}
    />
  );
};

export default Input;
