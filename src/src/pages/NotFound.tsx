import { Box, Typography } from "@mui/material";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      position="fixed"
      top={0}
      left={0}
      bgcolor="background.default"
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Sorry, the page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFound;
