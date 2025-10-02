import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "absolute", // Absolute positioning
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // width: "100vw",
        height: "100vh",
        zIndex: 9999, // Ensure it appears above other elements
        color: "#000",
      }}
    >
      <CircularProgress size={40} thickness={4} sx={{ color: "#000" }} />
      {/* <Typography variant="h6" mt={2}>
        {message}
      </Typography> */}
    </Box>
  );
};

export default Loader;
