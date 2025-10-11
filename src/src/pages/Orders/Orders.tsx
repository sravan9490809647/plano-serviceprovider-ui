import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { StickyBox } from "../../Styles";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import OrdersTable from "./components/OrdersTable";
import OrderFilters from "./components/OrderFilters";
import { useOrders } from "./hooks/useOrders";

import OrderDetailsDialog from "./components/OrderDetailsDialog";
import { FONT_FAMILY } from "../../Constants";

const Orders: React.FC = () => {
  const {
    orders,
    filteredOrders,
    loading,
    error,
    searchTerm,
    filters,
    hasActiveFilters,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    orderStatusFilter,
    statusLoading,
    detailLoading,
    orderDetails,
    dialogOpen,
    setSearchTerm,
    handleDateApply,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleOrderStatusChange,
    handleOrderStatusUpdate,
    handleOrderClick,
    handleCloseDialog
  } = useOrders();

  // Calculate ordered count
  const orderedCount = React.useMemo(() => {
    return filteredOrders.filter(order => order.orderStatus === 'Ordered').length;
  }, [filteredOrders]);

  // Event handlers
  const handleDateApplyWithRange = (range: any) => {
    handleDateApply(range);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // // Loading state
  // if (loading) {
  //   return <Loader />;
  // }

  // Error state
  if (error) {
    return <ErrorMessage title="Orders" message={`Error: ${error}`} />;
  }

  return (
    <Box>
      <StickyBox sx={{ alignItems: "center", gap: 2 }}>
        <Typography variant="h3">Orders</Typography>
        <Chip
          label={`${orderedCount}`}
          color="primary"
          variant="filled"
          sx={{
            backgroundColor: orderedCount > 0 ? '#1976d2' : '#e0e0e0',
            color: orderedCount > 0 ? 'white' : '#666',
            fontFamily: FONT_FAMILY.SEMI_BOLD
          }}
        />
      </StickyBox>

      <Box px={2}>
        <OrderFilters
          searchTerm={searchTerm}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          orderStatusFilter={orderStatusFilter}
          onDateApply={handleDateApplyWithRange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          showDateFilter={false}
          onOrderStatusChange={handleOrderStatusChange}
        />

        {orders.length > 0 ? (
          <>
            {(statusLoading || detailLoading) && <Loader />}
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
            title={`No orders found ${searchTerm ? `for "${searchTerm}"` : ""}`}
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

export default Orders;
