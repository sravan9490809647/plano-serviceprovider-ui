import React from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { formatPrice } from "../../../utils/common";
import { FONT_FAMILY } from "../../../Constants";


interface DailyEarningsDetailCardProps {
  periodEarnings: any;
  selectedDate?: Date;
}

const DailyEarningsDetailCard: React.FC<DailyEarningsDetailCardProps> = ({
  periodEarnings,
  selectedDate
}) => {
  return (
    <Paper elevation={0} sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Daily Earnings Detail
        </Typography>
        <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
          {selectedDate?.toLocaleDateString()}
        </Typography>
      </Box>
      <Grid container spacing={2} mt={6}>
        <Grid item xs={6} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            Total Orders
          </Typography>
          <Typography variant="h1">
            {periodEarnings?.totalOrders}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            Total Earnings
          </Typography>
          <Typography variant="h1">
            {formatPrice(periodEarnings?.earnings || 0)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DailyEarningsDetailCard;
