import React from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Chip,
  type SxProps,
  type Theme,
} from "@mui/material";

type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type SelectProps<T extends string | number> = {
  label: string;
  value: T | T[] | null;
  onChange: (event: React.SyntheticEvent, value: T | T[]) => void;
  options: SelectOption<T>[];
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiple?: boolean;
  sx?: SxProps<Theme>;
};

function AutoCompleteSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  error = false,
  helperText = "",
  fullWidth = true,
  multiple = false,
  sx = {},
}: SelectProps<T>) {
  const getSelectedOptions = () => {
    if (multiple && Array.isArray(value)) {
      return options.filter((opt) => value.includes(opt.value));
    } else if (!multiple && value != null) {
      return options.find((opt) => opt.value === value) || null;
    }
    return multiple ? [] : null;
  };

  return (
    <Autocomplete
      multiple={multiple}
      fullWidth={fullWidth}
      options={options}
      value={getSelectedOptions()}
      onChange={(event, newValue) => {
        if (multiple) {
          const vals = (newValue as Array<SelectOption<T>>).map(
            (opt) => opt.value
          );
          onChange(event, vals);
        } else {
          const val = (newValue as SelectOption<T> | null)?.value ?? ("" as T);
          onChange(event, val);
        }
      }}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          sx={sx}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {multiple && (
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
          )}
          {option.label}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            key={option.value}
          />
        ))
      }
    />
  );
}

export default AutoCompleteSelect;
