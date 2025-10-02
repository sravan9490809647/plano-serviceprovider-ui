import React from "react";
import { Box, Typography } from "@mui/material";

interface NoDataFoundProps {
  message: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 100px)",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">{message}</Typography>
    </Box>
  );
};

export default NoDataFound;
