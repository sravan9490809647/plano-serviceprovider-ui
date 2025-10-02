import React from "react";
import { Typography, Paper, useTheme } from "@mui/material";
import { FONT_FAMILY } from "../../../Constants";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendColor?: "success" | "error" | "text.secondary";
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendColor = "text.secondary",
  bgColor,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        // minWidth: 220,
        // maxWidth: 240,
        flex: "0 0 auto",
        bgcolor: bgColor || theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        mr: 2,
      }}
      elevation={0}
    >
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {trend && (
        <Typography
          variant="body2"
          color={
            trendColor === "success"
              ? "success.main"
              : trendColor === "error"
                ? "error.main"
                : "text.secondary"
          }
          mt={0.5}
        >
          {trend}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;
