import React from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import BasePopover from "../../../components/BasePopover";

interface OrderActionsMenuProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onViewDetails?: () => void;
    onEditOrder?: () => void;
    onCopyOrderId?: () => void;
    onDeleteOrder?: () => void;
}

const OrderActionsMenu: React.FC<OrderActionsMenuProps> = ({
    open,
    anchorEl,
    onClose,
    onViewDetails,
    onEditOrder,
    onCopyOrderId,
    onDeleteOrder,
}) => {
    return (
        <BasePopover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <List sx={{ width: 200 }}>
                <ListItem button onClick={onViewDetails}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                </ListItem>
                <ListItem button onClick={onEditOrder}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit Order" />
                </ListItem>
                <ListItem button onClick={onCopyOrderId}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy Order ID" />
                </ListItem>
                <ListItem button onClick={onDeleteOrder}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete Order" />
                </ListItem>
            </List>
        </BasePopover>
    );
};

export default OrderActionsMenu; 