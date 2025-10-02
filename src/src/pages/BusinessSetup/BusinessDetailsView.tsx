import type React from "react";
import BusinessSetupForm from "./BusinessDetails";
import { Box, Typography } from "@mui/material";

const BusinessDetailsView: React.FC = () => {
  return (
    <Box>
      <Typography variant="h3" sx={{ textAlign: "center", mt: 2 }}>
        Business Details
      </Typography>
      <BusinessSetupForm disableHeading={true} showBusinessName={true} />
    </Box>
  );
};

export default BusinessDetailsView;
