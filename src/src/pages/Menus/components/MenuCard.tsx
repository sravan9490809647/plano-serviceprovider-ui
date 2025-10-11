import React from "react";
import {
  Box,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { MenuItem } from "../../../types";
import { elipsesText } from "../../../Styles";
import { AWS_BUCKET_BASE_URL, DEFAULT_IMAGE } from "../../../Constants";
import { formatPrice } from "../../../utils/common";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import RoundBadge from "../../../components/RoundBadge";

interface MenuCardProps {
  item: MenuItem;
  onDelete: () => void;
  onEdit: () => void; // New callback for editing
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onDelete, onEdit }) => {
  return (
    <CustomPaperWrapper sx={{
      p: 0,
      borderRadius: 2,
      border: "1px solid #e5e7eb",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.01)",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        "& .action-icons": {
          display: "flex",
        },
      },
    }}>
      {/* Order Badge */}
      <RoundBadge top={8} left={50}>
        {item.order}
      </RoundBadge>

      {/* Edit & Delete Icons */}
      <Box
        className="action-icons"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "none",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          sx={{
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <EditIcon fontSize="small" sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      <CardMedia
        component="img"
        height="150"
        sx={{ objectFit: "contain" }}
        image={
          item.thumbnailImage
            ? `${AWS_BUCKET_BASE_URL}${item.thumbnailImage}`
            : DEFAULT_IMAGE
        }
        alt={item.title}
      />

      <CardContent>
        <Typography variant="h4">{item.title}</Typography>
        <Typography variant="body2" mt={0.5} sx={elipsesText}>
          {item.description}
        </Typography>
        <Typography variant="h4" color="#F59E0B" mt={0.5}>
          {formatPrice(item.price)}
        </Typography>
      </CardContent>
    </CustomPaperWrapper>
  );
};

export default MenuCard;
