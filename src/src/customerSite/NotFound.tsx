import { Box, Typography } from "@mui/material";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <Box
      display={"flex"}
      width={"100vw"}
      height={"100vh"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography variant="h2" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1">
        Sorry, the page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFound;
