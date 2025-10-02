import { Box, Grid, Typography, Paper, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import RoomIcon from "@mui/icons-material/Room";
import CustomButton from "../../../components/Button";
import { Edit } from "@mui/icons-material";

const RestaurantInfoCard = () => {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Restaurant Information</Typography>
        <CustomButton startIcon={<Edit />}>Edit Info</CustomButton>
      </Box>

      <Grid container spacing={3}>
        {/* Contact Details */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Contact Details
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h5" gutterBottom>
                  Restaurant Name
                </Typography>
                <Typography variant="h5">Just Eat Restaurant</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h5" gutterBottom>
                  Phone Number
                </Typography>
                <Typography variant="h5">+44 20 1234 5678</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="h5" gutterBottom>
                  Email
                </Typography>
                <Typography variant="h5">
                  info@justeatrestaurant.co.uk
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Website
                </Typography>
                <Link
                  href="https://www.justeatrestaurant.co.uk"
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  fontWeight={500}
                >
                  www.justeatrestaurant.co.uk
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Location Details */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <RoomIcon sx={{ color: "#10B981", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Location Details
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography color="textSecondary">Full Address</Typography>
                <Typography fontWeight={500}>
                  123 High Street, London, SW1A 1AA
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">City</Typography>
                  <Typography fontWeight={500}>London</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Postcode</Typography>
                  <Typography fontWeight={500}>SW1A 1AA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Latitude</Typography>
                  <Typography fontWeight={500}>51.5074</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Longitude</Typography>
                  <Typography fontWeight={500}>-0.1278</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantInfoCard;
