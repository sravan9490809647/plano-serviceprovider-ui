import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface DraggableMenuItemProps {
  id: string;
  children: React.ReactNode;
}

const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        position: "relative",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 10,
          cursor: "grab",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          marginRight: 0.5,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          },
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 16 }} color="action" />
      </Box>
      {children}
    </Box>
  );
};

export default DraggableMenuItem; 