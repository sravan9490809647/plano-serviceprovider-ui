import React from "react";
import { Paper } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

interface Props {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const InlineCalendar: React.FC<Props> = ({
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={0}
        sx={{
          width: "100%", // take full width of parent Grid
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            actionBar: { actions: [] },
          }}
        />
      </Paper>
    </LocalizationProvider>
  );
};

export default InlineCalendar;
