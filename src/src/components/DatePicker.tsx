import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface Props {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const CustomDatePicker: React.FC<Props> = ({
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
                startAdornment: <CalendarTodayIcon fontSize="small" />,
              }}
              InputLabelProps={{
                sx: { fontFamily: "GolosText" },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "GolosText",
                },
              }}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
