import React from "react";
import { Grid, Box } from "@mui/material";
import CalendarCard from "./CalendarCard";
// import WeeklyEarningsCard from "./WeeklyEarningsCard";
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
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%', height: '400px' }}>
            <CalendarCard selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%', height: '400px' }}>
            <DailyEarningsDetailCard periodEarnings={dayEarnings} selectedDate={selectedDate} />
          </Box>
        </Grid>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={8} mt={2}>
        <WeeklyEarningsCard
          periodEarnings={weekEarnings}
          onDateRangeApply={onDateRangeApply}
          currentDateRange={currentDateRange}
        />
      </Grid> */}
    </CustomPaperWrapper>
  );
};

export default DashboardStats;
