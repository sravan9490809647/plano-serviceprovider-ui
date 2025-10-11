import React from "react";
import { Grid } from "@mui/material";
import CalendarCard from "./CalendarCard";
import DailyEarningsDetailCard from "./DailyEarningsDetailCard";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";

interface DashboardStatsProps {
  dayEarnings?: any;
  weekEarnings?: any;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDateRangeApply: (range: { startDate: Date; endDate: Date; key: string }) => void;
  currentDateRange?: { startDate: Date; endDate: Date };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ dayEarnings, selectedDate, setSelectedDate }) => {
  return (
    <CustomPaperWrapper sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <CalendarCard selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <DailyEarningsDetailCard periodEarnings={dayEarnings} selectedDate={selectedDate} />
        </Grid>
      </Grid>
    </CustomPaperWrapper>
  );
};

export default DashboardStats;
