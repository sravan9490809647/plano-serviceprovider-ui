import { Box, Grid, Typography, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Mock data
const hours = [
  { day: "Monday", open: "11:00", close: "22:00" },
  { day: "Tuesday", open: "11:00", close: "22:00" },
  { day: "Wednesday", open: "11:00", close: "22:00" },
  { day: "Thursday", open: "11:00", close: "22:00" },
  { day: "Friday", open: "11:00", close: "23:00" },
  { day: "Saturday", open: "11:00", close: "23:00" },
  { day: "Sunday", open: "12:00", close: "21:00" },
];

const OpeningHoursDisplay = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <AccessTimeIcon sx={{ color: "#F97316", mr: 1 }} />
        <Typography variant="h5" fontWeight={600}>
          Opening Hours
        </Typography>
      </Box>

      {/* Hours Grid */}
      <Grid container spacing={2}>
        {hours.map(({ day, open, close }) => (
          <Grid key={day} item xs={12} sm={6} md={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: "#F9FAFB",
                borderRadius: 2,
                px: 3,
                py: 2,
              }}
            >
              <Typography fontWeight={600}>{day}</Typography>
              <Typography fontWeight={500} color="text.secondary">
                {open} - {close}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default OpeningHoursDisplay;
