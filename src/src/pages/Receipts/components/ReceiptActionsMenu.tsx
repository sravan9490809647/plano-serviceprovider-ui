import React from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import BasePopover from "../../../components/BasePopover";

interface ReceiptActionsMenuProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onEmailReceipt?: () => void;
    onDownloadReceipt?: () => void;
    onPrintReceipt?: () => void;
    printing?: boolean;
    downloading?: boolean;
}

const ReceiptActionsMenu: React.FC<ReceiptActionsMenuProps> = ({
    open,
    anchorEl,
    onClose,
    onEmailReceipt,
    onDownloadReceipt,
    onPrintReceipt,
    printing = false,
    downloading = false,
}) => {
    const isLoading = printing || downloading;

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
                <ListItem button onClick={onEmailReceipt} disabled={isLoading}>
                    <ListItemIcon>
                        <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Email Receipt" />
                </ListItem>
                <ListItem button onClick={onDownloadReceipt} disabled={isLoading}>
                    <ListItemIcon>
                        {downloading ? (
                            <CircularProgress size={16} />
                        ) : (
                            <DownloadIcon fontSize="small" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={downloading ? "Downloading..." : "Download PDF"} />
                </ListItem>
                <ListItem button onClick={onPrintReceipt} disabled={isLoading}>
                    <ListItemIcon>
                        {printing ? (
                            <CircularProgress size={16} />
                        ) : (
                            <PrintIcon fontSize="small" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={printing ? "Printing..." : "Print Receipt"} />
                </ListItem>
            </List>
        </BasePopover>
    );
};

export default ReceiptActionsMenu; 