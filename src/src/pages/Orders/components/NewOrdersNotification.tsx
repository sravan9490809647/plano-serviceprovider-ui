import React from "react";
import { Box, Badge, IconButton, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface NewOrdersNotificationProps {
    newOrderCount: number;
    onClearNotification?: () => void;
}

const NewOrdersNotification: React.FC<NewOrdersNotificationProps> = ({
    newOrderCount,
    onClearNotification,
}) => {
    const handleClick = () => {
        if (onClearNotification) {
            onClearNotification();
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {newOrderCount > 0 && (
                <Tooltip title={`${newOrderCount} new order${newOrderCount > 1 ? 's' : ''} - Click to dismiss`}>
                    <IconButton onClick={handleClick} sx={{ p: 0.5 }}>
                        <Badge badgeContent={newOrderCount} color="error">
                            <NotificationsIcon sx={{ color: '#2563EB', fontSize: 24 }} />
                        </Badge>
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};

export default NewOrdersNotification; 