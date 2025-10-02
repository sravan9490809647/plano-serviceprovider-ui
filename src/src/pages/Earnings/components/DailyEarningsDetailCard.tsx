import React from "react";
import { Paper, Typography, Divider, Grid } from "@mui/material";
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
    <Paper elevation={0} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" color="text.secondary">
        Daily Earnings Detail
      </Typography>
      <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        {selectedDate?.toLocaleDateString()}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={6} textAlign="center">
          <Typography variant="h5" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
            {formatPrice(periodEarnings?.earnings || 0)}

          </Typography>
          <Typography variant="h6" color="text.secondary">
            Total Earnings
          </Typography>
        </Grid>

        <Grid item xs={6} textAlign="center">
          <Typography variant="h5" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
            {periodEarnings?.totalOrders}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Total Orders
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
    </Paper>
  );
};

export default DailyEarningsDetailCard;
