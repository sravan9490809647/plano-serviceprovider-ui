import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { COLORS } from "../Constants";

type CustomInputProps = TextFieldProps & {
  startIcon?: React.ReactNode;
  inputStyles?: React.CSSProperties;
  sx?: any;
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
          "& fieldset": {
            borderColor: sx?.borderColor || COLORS.BLACK,
            borderWidth: sx?.borderWidth || "1px",
          },
          "&.Mui-error fieldset": {
            borderColor: "red",
          },
          "&.Mui-focused fieldset": {
            borderColor: sx?.borderColor || COLORS.BLACK,
            borderWidth: sx?.borderWidth || "1px"
          },
          "&:hover fieldset": {
            borderColor: sx?.borderColor || COLORS.BLACK,
            borderWidth: sx?.borderWidth || "1px"
          }
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
