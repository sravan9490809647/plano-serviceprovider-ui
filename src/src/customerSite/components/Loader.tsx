import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
