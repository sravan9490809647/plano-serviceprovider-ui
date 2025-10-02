import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import DateRangeFilter from "../../../components/DateRangeFilter";
import EarningsBarChart from "./EarningsBarChart";
import { formatPrice } from "../../../utils/common";

const data = [
  { name: "Mon", earnings: 50 },
  { name: "Tue", earnings: 120 },
  { name: "Wed", earnings: 80 },
  { name: "Thu", earnings: 130 },
  { name: "Fri", earnings: 180 },
  { name: "Sat", earnings: 160 },
  { name: "Sun", earnings: 90 },
];

// Sample data for weekly earnings

interface WeeklyEarningsCardProps {
  periodEarnings?: any;
  onDateRangeApply: (range: { startDate: Date; endDate: Date; key: string }) => void;
  currentDateRange?: { startDate: Date; endDate: Date };
}

const WeeklyEarningsCard: React.FC<WeeklyEarningsCardProps> = ({
  periodEarnings,
  onDateRangeApply,
  currentDateRange
}) => {
  // Get formatted date range string - using same format as DateRangeFilter
  const getDateRangeString = () => {
    if (!currentDateRange) {
      return "Select date range";
    }
    const startDate = currentDateRange.startDate.toLocaleDateString();
    const endDate = currentDateRange.endDate.toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={6} md={4}>
          <DateRangeFilter
            currentDateRange={currentDateRange}
            onApply={onDateRangeApply}
            gridSize={{ xs: 12, sm: 8, md: 8 }}
          />
        </Grid>

        <Grid item>
          <Box textAlign="right">
            <Typography variant="body2">
              {formatPrice(periodEarnings?.earnings || 0)}
              {" "}

              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
                sx={{ ml: 0.5 }}
              >
                Earned
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <EarningsBarChart data={data} />
      </Box>
    </Paper>
  );
};

export default WeeklyEarningsCard;
