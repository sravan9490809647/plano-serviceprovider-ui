import React from "react";
import {
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
  type SxProps,
  type Theme,
} from "@mui/material";

type SelectProps = {
  label: string;
  value: string | number | Array<string | number>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string | number; label: string }[];
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiple?: boolean;
  sx?: SxProps<Theme>;
  selectSx?: React.CSSProperties; // 🎯 custom styles applied to select element
};

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error = false,
  helperText = "",
  fullWidth = true,
  multiple = false,
  sx = {},
  selectSx = {},
}) => {
  const isSelected = (val: string | number) =>
    Array.isArray(value) ? value.includes(val) : value === val;

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      size="medium"
      sx={{
        ...sx,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          height: "48px",
          ...selectSx, // you can override height, padding, etc.
        },
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          padding: "12px",
        },
      }}
      SelectProps={{
        multiple,
        renderValue: (selected) => {
          if (Array.isArray(selected)) {
            return selected
              .map((v) => {
                const match = options.find((opt) => opt.value === v);
                return match ? match.label : String(v);
              })
              .join(", ") as React.ReactNode;
          } else {
            const match = options.find((opt) => opt.value === selected);
            return (match ? match.label : String(selected)) as React.ReactNode;
          }
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {multiple ? (
            <>
              <Checkbox checked={isSelected(option.value)} />
              <ListItemText primary={option.label} />
            </>
          ) : (
            option.label
          )}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Select;
