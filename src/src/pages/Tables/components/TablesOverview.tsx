import React, { useMemo } from "react";
import {
    Box,
    Typography,
    Avatar,
    Grid,
} from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import type { Table } from "../../../types";
import { FONT_FAMILY, TABLE_STATUS_COLORS, TABLE_STATUS_LABELS } from "../../../Constants";
import { formatPrice } from "../../../utils/common";

interface TablesOverviewProps {
    tables: Table[];
    onTableClick: (table: Table) => void;
    fullWidth?: boolean;
}

const STATUS_COLOR_MAP = {
    available: TABLE_STATUS_COLORS.AVAILABLE,
    occupied: TABLE_STATUS_COLORS.OCCUPIED,
    waiter: TABLE_STATUS_COLORS.WAITER,
    checkout: TABLE_STATUS_COLORS.CHECKOUT
} as const;

const LEGEND_ITEMS = [
    { label: TABLE_STATUS_LABELS.AVAILABLE, color: TABLE_STATUS_COLORS.AVAILABLE, border: "2px solid #000" },
    { label: TABLE_STATUS_LABELS.WAITER, color: TABLE_STATUS_COLORS.WAITER },
    { label: TABLE_STATUS_LABELS.OCCUPIED, color: TABLE_STATUS_COLORS.OCCUPIED },
    { label: TABLE_STATUS_LABELS.CHECKOUT, color: TABLE_STATUS_COLORS.CHECKOUT }
];

const TablesOverview: React.FC<TablesOverviewProps> = ({ tables, onTableClick, fullWidth }) => {
    const getStatusColor = (status: keyof typeof STATUS_COLOR_MAP) => {
        return STATUS_COLOR_MAP[status] || TABLE_STATUS_COLORS.OCCUPIED;
    };

    const EmptyTableMessage = () => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flexDirection: "column",
                gap: 2
            }}
        >
            <Typography variant="h5">
                No tables found
            </Typography>
            <Typography variant="body2">
                Tables will appear here once they are added
            </Typography>
        </Box>
    );

    const TableCircle = ({ table }: { table: Table }) => {
        const isAvailable = table.status === "available";
        return (
            <Box
                onClick={() => onTableClick(table)}
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: getStatusColor(table.status),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    border: isAvailable ? "2px solid #cecece" : "none",
                    "&:hover": {
                        border: isAvailable ? "2px solid #cecece" : "none",
                    },
                }}
            >
                <Typography variant="h5" sx={{ lineHeight: 1, color: isAvailable ? "#cecece" : "#fff", fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
                    {table.tableNumber}
                </Typography>
            </Box>
        );
    };

    const gridItemSize = useMemo(() => ({
        xs: 2.4,
        sm: fullWidth ? 2 : 2.4,
        lg: fullWidth ? 1 : 1.5
    }), [fullWidth]);

    return (
        <CustomPaperWrapper sx={{ height: { lg: "calc(100vh - 120px)" }, display: "flex", flexDirection: "column" }}>
            <Box display="flex" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                <Avatar
                    sx={{
                        bgcolor: "#000",
                        width: 32,
                        height: 32,
                        mr: 1,
                        borderRadius: "20%",
                    }}
                >
                    <Typography variant="body2">T</Typography>
                </Avatar>
                <Typography variant="h4">Tables Overview</Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={1.5} mb={3} sx={{ flexShrink: 0 }}>
                {LEGEND_ITEMS.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={0.5}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: item.color,
                                border: item.border
                            }}
                        />
                        <Typography variant="h5">{item.label}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ overflow: "auto", flex: 1 }}>
                {tables.length === 0 ? (
                    <EmptyTableMessage />
                ) : (
                    <Grid container spacing={1.5}>
                        {tables.map((table: Table) => (
                            <Grid item {...gridItemSize} key={table.id}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.5,
                                    }}
                                >
                                    <TableCircle table={table} />
                                    <Typography variant="h5">
                                        {table.sessionTableAmount ? formatPrice(table.sessionTableAmount) : "-"}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </CustomPaperWrapper>
    );
};

export default TablesOverview;