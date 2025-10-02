import React from "react";
import { Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Input from "../../../components/Input";
import DateRangeFilter from "../../../components/DateRangeFilter";
import type { DateRangeSelection } from "../../../types";

interface ReceiptFiltersProps {
    searchTerm: string;
    dateRange?: DateRangeSelection | null;
    onDateApply: (range: DateRangeSelection) => void;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReceiptFilters: React.FC<ReceiptFiltersProps> = ({
    searchTerm,
    onDateApply,
    onSearchChange,
    dateRange,
}) => {
    return (
        <Grid container spacing={2} alignItems="center" mt={0} mb={2} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={6} lg={4}>
                <DateRangeFilter
                    onApply={onDateApply}
                    gridSize={{ xs: 12 }}
                    currentDateRange={dateRange || undefined}
                />
            </Grid>
            <Grid item xs={12} sm={6} lg={8} display="flex" justifyContent="flex-end">
                <Grid item xs={12} lg={4} />
                <Grid item xs={12} lg={8}>
                    <Input
                        fullWidth
                        placeholder={"Search by table name"}
                        startIcon={<SearchIcon color="action" />}
                        inputStyles={{ padding: "12px" }}
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                </Grid>

            </Grid>
        </Grid>
    );
};

export default ReceiptFilters; 