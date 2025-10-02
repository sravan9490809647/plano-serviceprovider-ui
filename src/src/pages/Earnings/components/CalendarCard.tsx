import React from "react";
import { Paper } from "@mui/material";
import InlineCalendar from "./InlineCalendar";

interface CalendarCardProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  selectedDate,
  setSelectedDate
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <InlineCalendar value={selectedDate} onChange={handleDateChange} maxDate={new Date()} />
    </Paper>
  );
};

export default CalendarCard;
