import React, { useState, useEffect } from "react";
import { Box, Typography, Popover, Grid } from "@mui/material";
import MyDateRangePicker from "./DateRangePicker";
import type { DateRangeSelection } from "../types";

interface DateRangeFilterProps {
    label?: string;
    placeholder?: string;
    onApply: (range: DateRangeSelection) => void;
    currentDateRange?: { startDate: Date; endDate: Date };
    gridSize?: {
        xs?: number;
        sm?: number;
        md?: number;
    };
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    onApply,
    currentDateRange,
    gridSize = { xs: 12, sm: 6, md: 6 },
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [dateRange, setDateRange] = useState<string | null>(
        currentDateRange ? `${new Date(currentDateRange.startDate).toLocaleDateString()} - ${new Date(currentDateRange.endDate).toLocaleDateString()}` : null
    );

    // Update dateRange when currentDateRange changes
    useEffect(() => {
        if (currentDateRange) {
            const formattedRange = `${new Date(currentDateRange.startDate).toLocaleDateString()} - ${new Date(currentDateRange.endDate).toLocaleDateString()}`;
            setDateRange(formattedRange);
        } else {
            setDateRange(null);
        }
    }, [currentDateRange]);

    const open = Boolean(anchorEl);

    const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDateClose = () => {
        setAnchorEl(null);
    };

    const handleDateApply = (range: DateRangeSelection) => {
        const start = range.startDate.toLocaleDateString();
        const end = range.endDate.toLocaleDateString();
        setDateRange(`${start} - ${end}`);
        onApply(range);
        setAnchorEl(null);
    };

    return (
        <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md}>
            <Box
                onClick={handleDateClick}
                sx={{
                    border: "1px solid #000",
                    borderRadius: "8px",
                    background: "#fff",
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                📅
                <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                >
                    {dateRange || "Pick a date range"}
                </Typography>
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleDateClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <MyDateRangePicker
                    onApply={handleDateApply}
                    onCancel={handleDateClose}
                    initialRange={currentDateRange ? {
                        startDate: currentDateRange.startDate,
                        endDate: currentDateRange.endDate,
                        key: "selection"
                    } : null}
                />
            </Popover>
        </Grid>
    );
};

export default DateRangeFilter; 