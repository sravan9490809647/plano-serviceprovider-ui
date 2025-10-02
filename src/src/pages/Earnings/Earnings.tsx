import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import StatsCards from "./components/StatsCards";
import DashboardStats from "./components/DashboardStats";
import CustomButton from "../../components/Button";
import { Refresh } from "@mui/icons-material";
import { StickyBox } from "../../Styles";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import {
  fetchMainEarnings,
  fetchDayEarnings,
  fetchWeekEarnings,
  type MainEarningsData,
  type DayEarningsData,
  type WeekEarningsData
} from "../../services/Earnings";

const Earnings: React.FC = () => {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDateRange, setCurrentDateRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: new Date(),
    endDate: new Date()
  });
  const [dayEarnings, setDayEarnings] = useState<DayEarningsData | null>(null);
  const [weekEarnings, setWeekEarnings] = useState<WeekEarningsData | null>(null);
  const [mainEarnings, setMainEarnings] = useState<MainEarningsData | null>(null);
  const [mainEarningsLoading, setMainEarningsLoading] = useState(false);
  const [mainEarningsError, setMainEarningsError] = useState<string | null>(null);

  // Function to fetch main earnings
  const handleFetchMainEarnings = async () => {
    try {
      setMainEarningsLoading(true);
      setMainEarningsError(null);

      const result = await fetchMainEarnings();
      setMainEarnings(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch earnings';
      setMainEarningsError(errorMessage);
    } finally {
      setMainEarningsLoading(false);
    }
  };

  // Function to fetch day earnings
  const handleFetchDayEarnings = async (date: Date) => {
    try {
      const result = await fetchDayEarnings(date);
      setDayEarnings(result);
    } catch (error) {
    }
  };

  // Function to fetch week earnings
  const handleFetchWeekEarnings = async (startDate: Date, endDate: Date) => {
    try {
      const result = await fetchWeekEarnings(startDate, endDate);
      setWeekEarnings(result);
    } catch (error) {
      console.error('Error fetching week earnings:', error);
    }
  };

  useEffect(() => {
    // Get current date
    const currentDate = new Date();

    // Get current week (Monday to Sunday)
    const currentWeekStart = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday is 0, so we need to go back 6 days
    currentWeekStart.setDate(currentDate.getDate() - daysToMonday);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    // Ensure the end date doesn't exceed today's date
    if (currentWeekEnd > currentDate) {
      currentWeekEnd.setTime(currentDate.getTime());
    }

    // Set initial date range
    setCurrentDateRange({
      startDate: currentWeekStart,
      endDate: currentWeekEnd
    });

    // Call functions initially
    handleFetchMainEarnings();
    handleFetchDayEarnings(currentDate);
    handleFetchWeekEarnings(currentWeekStart, currentWeekEnd);
  }, []);

  const handleDateChange = (date: Date) => {
    const today = new Date();

    // Ensure the selected date doesn't exceed today
    const selectedDate = date > today ? today : date;

    setSelectedDate(selectedDate);
    handleFetchDayEarnings(selectedDate);
  };

  const handleDateRangeApply = (range: { startDate: Date; endDate: Date; key: string }) => {
    const today = new Date();

    // Ensure dates don't exceed today
    const startDate = range.startDate > today ? today : range.startDate;
    const endDate = range.endDate > today ? today : range.endDate;

    setCurrentDateRange({
      startDate: startDate,
      endDate: endDate
    });
    handleFetchWeekEarnings(startDate, endDate);
  };
  if (mainEarningsLoading) {
    return <Loader />;
  }
  if (mainEarningsError) {
    return <ErrorMessage title="Earnings" message={`Error: ${mainEarningsError}`} />;
  }

  return (
    <Box>
      <StickyBox justifyContent="space-between">
        <Typography variant="h3">Earnings</Typography>
        <CustomButton
          startIcon={<Refresh />}
          onClick={handleFetchMainEarnings}
        >
          Refresh
        </CustomButton>
      </StickyBox>

      <Box sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
        <StatsCards earnings={mainEarnings} />
        <DashboardStats
          dayEarnings={dayEarnings}
          weekEarnings={weekEarnings}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          onDateRangeApply={handleDateRangeApply}
          currentDateRange={currentDateRange}
        />
      </Box>
    </Box>
  );
};

export default Earnings;
