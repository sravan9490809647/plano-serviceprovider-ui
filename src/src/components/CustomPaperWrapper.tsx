import React from "react";
import { Paper, type PaperProps } from "@mui/material";

interface CustomPaperWrapperProps extends PaperProps {
  children: React.ReactNode;
}

const CustomPaperWrapper: React.FC<CustomPaperWrapperProps> = ({
  children,
  sx,
  ...rest
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid #F3F4F6",
        borderRadius: 3,
        p: 1,
        bgcolor: "#fff",
        boxShadow: "0 0 0 1px #F0F0F0",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default CustomPaperWrapper;
