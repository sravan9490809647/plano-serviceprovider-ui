import React from "react";
import { Typography } from "@mui/material";
import { ORDER_STATUS } from "../../../Constants";
import { themeColors, statusColors } from "../../../utils/colors";

interface StatusTextProps {
    status: string;
}

const StatusText: React.FC<StatusTextProps> = ({ status }) => {
    return (
        <Typography variant="body2" sx={{
            color: statusColors[status as keyof typeof statusColors]?.color || themeColors.black,
        }}>
            {status === ORDER_STATUS.ORDERED ? "New" : status}
        </Typography>
    );
};

export default StatusText; 