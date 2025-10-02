import React from "react";
import { Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Input from "../../../components/Input";
import DateRangeFilter from "../../../components/DateRangeFilter";
import type { DateRangeSelection } from "../../../types";
import OrderStatusChip from "./OrderStatusChip";
import { ORDER_STATUS_CHIPS } from "../../../Constants";

interface OrderFiltersProps {
    searchTerm: string;
    filters: Record<string, string[]>;
    dateRange?: DateRangeSelection | null;
    hasActiveFilters: boolean;
    orderStatusFilter: string;
    onDateApply?: (range: DateRangeSelection) => void;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFilterChange?: (section: string, value: string) => void;
    onClearFilters: () => void;
    showDateFilter?: boolean;
    source?: string;
    onOrderStatusChange: (status: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
    searchTerm,
    orderStatusFilter,
    hasActiveFilters,
    onDateApply,
    onSearchChange,
    dateRange,
    onClearFilters,
    showDateFilter = false,
    source = "orders",
    onOrderStatusChange
}) => {
    return (
        <Grid container spacing={2} alignItems="center" mt={0} mb={2}>
            {showDateFilter && onDateApply && (
                <Grid item xs={12} sm={6} lg={3}>
                    <DateRangeFilter
                        onApply={onDateApply}
                        gridSize={{ xs: 12, sm: 12, md: 12 }}
                        currentDateRange={dateRange || undefined}
                    />
                </Grid>
            )}

            <Grid item xs={12} sm={6} lg={3}>
                <Input
                    fullWidth
                    placeholder={source === "orders" ? "Search by customer name" : "Search by table name"}
                    startIcon={<SearchIcon color="action" />}
                    inputStyles={{ padding: "12px" }}
                    value={searchTerm}
                    onChange={onSearchChange}
                />
            </Grid>
            <Grid item xs={12} sm={12} lg={showDateFilter ? 6 : 9} display="flex" gap={1} justifyContent="flex-end">
                {ORDER_STATUS_CHIPS.map((status: any) => (
                    <OrderStatusChip status={status} selectedFilter={orderStatusFilter} onClick={() => onOrderStatusChange(status.value)} />
                ))}
            </Grid>
        </Grid>
    );
};

export default OrderFilters; 