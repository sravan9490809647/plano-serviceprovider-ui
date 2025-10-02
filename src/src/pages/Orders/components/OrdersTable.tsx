import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import type { Order } from "../../../redux/reducers/OrdersReducer";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableRow from "./OrderTableRow";
import OrderActionsMenu from "./OrderActionsMenu";
import Pagination from "../../../components/Pagination";
import { useOrderTable } from "../hooks/useOrderTable";

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  handleOrderClick: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
  handleOrderStatusUpdate: (id: string, status: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  handleOrderClick,
  onViewDetails,
  handleOrderStatusUpdate,
}) => {
  const {
    anchorEl,
    open,
    handleActionsClick,
    handleActionsClose,
    handleViewDetails,
    handleEditOrder,
    handleCopyOrderId,
    handleDeleteOrder,
  } = useOrderTable(onViewDetails);

  return (
    <Paper sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
      {/* Single Table with Fixed Header and Scrollable Body */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <TableContainer sx={{ height: '100%' }}>
          <Table stickyHeader>
            <OrderTableHeader />
            <TableBody>
              {orders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onOrderClick={() => handleOrderClick(order.id)}
                  onActionsClick={(event) => handleActionsClick(event, order.id)}
                  handleOrderStatusUpdate={handleOrderStatusUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Fixed Pagination */}
      <Box sx={{ flexShrink: 0 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </Box>

      <OrderActionsMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleActionsClose}
        onViewDetails={handleViewDetails}
        onEditOrder={handleEditOrder}
        onCopyOrderId={handleCopyOrderId}
        onDeleteOrder={handleDeleteOrder}
      />
    </Paper>
  );
};

export default OrdersTable;
