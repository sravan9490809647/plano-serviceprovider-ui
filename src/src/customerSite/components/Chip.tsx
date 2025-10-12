import React from "react";
import { Chip, useTheme } from "@mui/material";
import { FONT_FAMILY } from "../../Constants";

interface CategoryChipProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

const CustomChip: React.FC<CategoryChipProps> = ({
  label,
  selected,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      clickable
      onClick={onClick}
      variant={selected ? "filled" : "outlined"}
      sx={{
        borderRadius: 2,
        border: "none",
        p: 2,
        fontSize: "14px",
        fontFamily: FONT_FAMILY.BOLD,
        "&.MuiChip-root": {
          backgroundColor: selected ? theme.palette.tertiary.main : "#FFFFFF",
          color: selected ? "#FFFFFF" : theme.palette.tertiary.main,
          transition: "all 0.2s ease",
        },
        "&.MuiChip-root:hover": {
          backgroundColor: theme.palette.tertiary.main,
          color: "#FFFFFF",
        },
      }}
    />
  );
};

export default CustomChip;
