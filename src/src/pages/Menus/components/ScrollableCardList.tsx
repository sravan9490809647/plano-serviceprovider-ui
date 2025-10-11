import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import MenuCard from "./MenuCard";
import CustomButton from "../../../components/Button";
import { Add, Delete } from "@mui/icons-material";
import type { MenuItem } from "../../../types";
import DraggableMenuItem from "./DraggableMenuItem";
import { TEXT_COLORS } from "../../../Constants";
import RoundBadge from "../../../components/RoundBadge";

interface ScrollableCardListProps {
  category: {
    title: string;
    order: number;
  };
  items: MenuItem[];
  onAddItem?: () => void;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onEditCategory?: () => void; // Added callback for category edit
  onDeleteCategory?: () => void;
}

const ScrollableCardList: React.FC<ScrollableCardListProps> = ({
  category,
  items,
  onAddItem = () => { },
  onDelete,
  onEdit,
  onEditCategory,
  onDeleteCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(false);

  const updateScrollIcons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftIcon(scrollLeft > 0);
      setShowRightIcon(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300;
      updateScrollIcons();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300;
      updateScrollIcons();
    }
  };

  useEffect(() => {
    updateScrollIcons();
    const handleResize = () => updateScrollIcons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        m: 2,
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 3 }} // Add left padding to make room for the drag handle
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h4" sx={{ color: TEXT_COLORS.PRIMARY, marginLeft: 10 }}>{category.title}</Typography>
          <RoundBadge
            size={28}
            sx={{ position: "relative", top: 0, left: 0 }}
          >
            {category.order}
          </RoundBadge>

          <IconButton
            size="small"
            onClick={onEditCategory}
            sx={{
              backgroundColor: "#000",
              "&:hover": {
                backgroundColor: "#000",
              },
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
            onClick={onDeleteCategory}
          >
            <Delete fontSize="small" sx={{ color: "#fff" }} />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h5" sx={{ marginRight: 10 }}>Total Items: <span style={{ fontWeight: 600, color: TEXT_COLORS.PRIMARY }}>{items.length}</span></Typography>
          <CustomButton
            startIcon={<Add fontSize="small" />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={onAddItem}
          >
            Add New
          </CustomButton>
        </Stack>
      </Stack>

      {showLeftIcon && (
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {showRightIcon && (
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}

      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 3,
          py: 2,
          px: 1,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: 5,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E5E7EB",
            borderRadius: 4,
          },
        }}
        onScroll={updateScrollIcons}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              flex: "0 0 auto",
              width: 250,
            }}
          >
            <DraggableMenuItem id={item.id}>
              <MenuCard
                item={item}
                onDelete={() => onDelete(item.id)}
                onEdit={() => onEdit(item)}
              />
            </DraggableMenuItem>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ScrollableCardList;
