import React from "react";
import { Chip } from "@mui/material";
import { FONT_FAMILY } from "../../../Constants";

interface OrderStatusChipProps {
    status: { label: string; value: string };
    selectedFilter: string;
    onClick?: () => void;
}

const statusColors: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    Ordered: {
        label: "Ordered",
        color: "#92400E",
        bg: "#FEF3C7",
    },
    Preparing: {
        label: "Preparing",
        color: "#92400E",
        bg: "#FEF3C7",
    },
    Ready: {
        label: "Ready",
        color: "#065F46",
        bg: "#D1FAE5",
    },
    Delivered: {
        label: "Delivered",
        color: "#1E3A8A",
        bg: "#DBEAFE",
    },
    Cancelled: {
        label: "Cancelled",
        color: "#991B1B",
        bg: "#FECACA",
    },
    Completed: {
        label: "Completed",
        color: "#065F46",
        bg: "#D1FAE5",
    },
};

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ status, selectedFilter, onClick }) => {
    return (
        <Chip
            label={status.label}
            sx={{
                backgroundColor: (theme) => selectedFilter === status.value ? theme.palette.common.black : theme.palette.common.white,
                color: (theme) => selectedFilter === status.value ? theme.palette.common.white : theme.palette.common.black,
                borderRadius: 2,
                cursor: "pointer",
                paddingX: 1,
                paddingY: 2,
                fontSize: 14,
                fontFamily: `${FONT_FAMILY.BOLD} !important`,
                "&:hover": {
                    backgroundColor: (theme) => selectedFilter === status.value ? theme.palette.common.black : theme.palette.common.white,
                    color: (theme) => selectedFilter === status.value ? theme.palette.common.white : theme.palette.common.black,
                },
                border: (theme) => `1px solid ${theme.palette.common.black}`,
            }}
            onClick={onClick ? onClick : undefined}
        />
    );
};

export default OrderStatusChip; 