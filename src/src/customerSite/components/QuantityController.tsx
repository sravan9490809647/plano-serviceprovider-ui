import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FONT_FAMILY } from "../../Constants";

interface QuantityControllerProps {
  quantity: number;
  isCart?: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

const QuantityController: React.FC<QuantityControllerProps> = ({
  quantity,
  isCart,
  onAdd,
  onRemove,
}) => {
  return (
    <Box
      height={{ xs: 35, md: 40 }}
      display="flex"
      alignItems="center"
      justifyContent={isCart ? "flex-start" : "center"}
    >
      {quantity === 0 ? (
        <IconButton
          onClick={onAdd}
          size="small"
          sx={{
            border: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            borderRadius: 2,
            width: { xs: 31.5, md: 36 }, // 10% decrease from 35/40
            height: { xs: 31.5, md: 36 }, // 10% decrease from 35/40
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          border="none"
          borderRadius={3}
          px={1.5}
          height={{ xs: 31.5, md: 36 }} // 10% decrease from 35/40
          sx={{
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <IconButton onClick={onRemove} size="small" sx={{ p: 0.5 }}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 24, textAlign: "center", fontFamily: FONT_FAMILY.BOLD }}>
            {quantity}
          </Typography>
          <IconButton onClick={onAdd} size="small" sx={{ p: 0.5 }}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default QuantityController;
