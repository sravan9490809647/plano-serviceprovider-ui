import React from "react";
import { Box, Typography } from "@mui/material";
import { StickyBox } from "../../Styles";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import OrdersTable from "../Orders/components/OrdersTable";
import OrderFilters from "../Orders/components/OrderFilters";
import { useOrdersHistory } from "./hooks/useOrdersHistory";

import OrderDetailsDialog from "../Orders/components/OrderDetailsDialog";
import type { DateRangeSelection } from "../../types";

const OrdersHistory: React.FC = () => {
    const {
        orders,
        loading,
        error,
        searchTerm,
        filters,
        hasActiveFilters,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        dateRange,
        orderStatusFilter,
        statusLoading,
        orderDetails,
        dialogOpen,
        detailLoading,
        handleOrderClick,
        handleCloseDialog,
        setSearchTerm,
        handleDateApply,
        handleClearFilters,
        handleFilterChange,
        handlePageChange,
        handleItemsPerPageChange,
        handleOrderStatusChange,
        handleOrderStatusUpdate
    } = useOrdersHistory();

    // Event handlers
    const handleDateApplyWithRange = (range: any) => {
        handleDateApply(range);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Loading state
    if (loading) {
        return <Loader />;
    }

    // Error state
    if (error) {
        return <ErrorMessage title="Orders History" message={`Error: ${error}`} />;
    }


    return (
        <Box>
            <StickyBox sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h3">Orders History</Typography>
            </StickyBox>

            <Box px={2}>
                <OrderFilters
                    searchTerm={searchTerm}
                    filters={filters}
                    orderStatusFilter={orderStatusFilter}
                    dateRange={dateRange as unknown as DateRangeSelection | null}
                    hasActiveFilters={hasActiveFilters as boolean}
                    onDateApply={handleDateApplyWithRange}
                    onSearchChange={handleSearchChange}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    showDateFilter={true}
                    onOrderStatusChange={handleOrderStatusChange}
                />

                {orders.length > 0 ? (
                    <>
                        {statusLoading || detailLoading && <Loader />}
                        <OrdersTable
                            orders={orders}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            handleOrderClick={handleOrderClick}
                            onViewDetails={handleOrderClick}
                            handleOrderStatusUpdate={handleOrderStatusUpdate}
                        />
                    </>
                ) : (
                    <EmptyState
                        title={`No orders found ${searchTerm ? `for "${searchTerm}"` : ''}`}
                    />
                )}
            </Box>

            <OrderDetailsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                orderDetails={orderDetails}
                onOrderStatusUpdate={handleOrderStatusUpdate}
            />
        </Box>
    );
};

export default OrdersHistory; 