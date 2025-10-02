import { Paper, Typography } from "@mui/material";

const BusinessDescription = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        sx={{ fontFamily: "GolosText" }}
      >
        Restaurant Description
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#374151", // Tailwind's gray-700
          fontSize: 18,
          fontWeight: 500,
          fontFamily: "GolosText",
        }}
      >
        Authentic cuisine served fresh daily with the finest ingredients.
      </Typography>
    </Paper>
  );
};

export default BusinessDescription;
