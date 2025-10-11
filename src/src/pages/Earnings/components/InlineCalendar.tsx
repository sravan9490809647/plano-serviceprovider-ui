import React from "react";
import { Paper } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { FONT_FAMILY, FONT_SIZE } from "../../../Constants";

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
          "& .MuiYearCalendar-button": {
            padding: "0 !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "36px",
          },
          "& .MuiMonthCalendar-button": {
            padding: "0 !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "36px",
          },
          "& .MuiButtonBase-root-MuiPickersDay-root": {
            fontFamily: FONT_FAMILY.REGULAR,
            fontSize: FONT_SIZE.LARGE,
          },
        }}
      >
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          views={['year', 'month', 'day']}
          openTo="day"
          slotProps={{
            actionBar: { actions: [] },
          }}
        />
      </Paper>
    </LocalizationProvider>
  );
};

export default InlineCalendar;
