import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import BasePopover from "../../../components/BasePopover";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const OrderActionsPopover: React.FC<Props> = ({
  anchorEl,
  open,
  onClose,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <BasePopover open={open} anchorEl={anchorEl} onClose={onClose}>
      <List dense>
        <ListItem
          button
          onClick={() => {
            onView?.();
            onClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            onEdit?.();
            onClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            onDuplicate?.();
            onClose();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Duplicate" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            onDelete?.();
            onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItem>
      </List>
    </BasePopover>
  );
};

export default OrderActionsPopover;
