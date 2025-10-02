// components/DateRangePicker.tsx
import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FONT_FAMILY } from "../../Constants";

interface Props {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateRangePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        format="dd/MM/yyyy"
        maxDate={maxDate}
        minDate={minDate}
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="dd/mm/yyyy"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontFamily: FONT_FAMILY.REGULAR },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: FONT_FAMILY.REGULAR,
                },
              }}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
