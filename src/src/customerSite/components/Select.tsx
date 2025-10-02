import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  FormHelperText,
} from "@mui/material";

type SelectProps = {
  label: string; // Label for the select
  value: string | number; // Selected value
  onChange: (
    event: React.ChangeEvent<{ value: string | number }>,
    child?: React.ReactNode
  ) => void; // Change handler
  options: { value: string | number; label: string }[]; // Options for the select
  error?: boolean; // Error state
  helperText?: string; // Helper text for validation messages
  fullWidth?: boolean; // Full width option
};

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error = false,
  helperText = "",
  fullWidth = true,
  ...props
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      sx={{
        minWidth: 250,
        "& .MuiFormHelperText-root": {
          color: error ? "red" : "inherit", // Red helper text when error is true
        },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        onChange={(event, child) =>
          onChange(
            event as React.ChangeEvent<{ value: string | number }>,
            child
          )
        } // Cast event to the expected type
        label={label}
        sx={{
          borderRadius: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
