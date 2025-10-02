import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >
      <Typography variant="h3" component="div">
        Dashboard
      </Typography>
    </Box>
  );
};

export default Dashboard;
