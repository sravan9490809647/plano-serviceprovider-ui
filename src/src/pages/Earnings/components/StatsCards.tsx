import { Grid, Box } from "@mui/material";
import StatCard from "./StatCard";
import { formatPrice } from "../../../utils/common";

interface StatsCardsProps {
  earnings?: any;
}

const StatsCards: React.FC<StatsCardsProps> = ({ earnings }) => {
  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Earnings"
            value={earnings ? formatPrice(earnings.todaysEarnings) : formatPrice(0)}
            trendColor="success"
            bgColor="#fff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Week"
            value={earnings ? formatPrice(earnings.weeklyEarnings) : formatPrice(0)}
            trendColor="success"
            bgColor="#fff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value={earnings ? formatPrice(earnings.monthlyEarnings) : formatPrice(0)}
            trendColor="error"
            bgColor="#fff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="All Time"
            value={earnings ? formatPrice(earnings.lifeTimeEarnings) : formatPrice(0)}
            trendColor="error"
            bgColor="#fff"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsCards;
