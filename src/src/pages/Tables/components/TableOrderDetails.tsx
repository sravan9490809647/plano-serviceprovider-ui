import React from "react";
import {
    Box,
    Typography,
    Avatar,
    Stack,
    IconButton,
    Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import CustomButton from "../../../components/Button";
import type { ReservedTableOrdersResponse } from "../../../types";
import { DEFAULT_TIME_FORMAT, FONT_FAMILY, ORDER_STATUS } from "../../../Constants";
import Storage from "../../../utils/Storage";
import { formatDateTime } from "../../../utils/dateUtils";
import { formatPrice } from "../../../utils/common";
import { themeColors } from "../../../utils/colors";

interface TableOrderDetailsProps {
    orderDetails: ReservedTableOrdersResponse | null;
    onClose: () => void;
    onTerminateSession: () => Promise<void>;
    terminating: boolean;
    tableData?: any;
    onConfirmRequest?: (tableId: string, requestType: 'waiter' | 'checkout') => Promise<void>;
    confirmingRequest?: boolean;
    onHandlePrintBill?: () => void;
    printingBill?: boolean;
}

const TableOrderDetails: React.FC<TableOrderDetailsProps> = ({
    orderDetails,
    onClose,
    onTerminateSession,
    terminating,
    tableData,
    onConfirmRequest,
    confirmingRequest = false,
    onHandlePrintBill,
    printingBill
}) => {
    // Filter out orders with null orderDetails or empty orderedItems
    const validOrders = Array.isArray(orderDetails)
        ? orderDetails.filter(order =>
            order?.orderDetails &&
            order?.orderedItems &&
            order.orderedItems.length > 0
        )
        : [];

    // Get the first valid order details for header info
    const firstOrder = validOrders?.[0];
    const tableName = firstOrder?.orderDetails?.tableName || tableData?.tableName || "Unknown Table";
    const tableId = firstOrder?.orderDetails?.tId || tableData?.id || "Unknown Table";

    // Calculate total from all valid orders
    const totalAmount = validOrders.reduce((sum, order) => {
        return sum + (order?.orderDetails?.totalPrice || 0);
    }, 0);

    const businessId = Storage.getItem("businessId");

    const handleLinkClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (!businessId || !tableId) {
            return;
        }
        window.open(`/${businessId}?tableId=${tableId}`, '_blank');
    };
    return (
        <CustomPaperWrapper sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} sx={{ flexShrink: 0 }}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: "#000",
                            width: 25,
                            height: 25,
                            mr: 1,
                            borderRadius: "20%",
                        }}
                    >
                        <Typography variant="body1">
                            T
                        </Typography>
                    </Avatar>
                    <Typography variant="h5">
                        {tableName}
                        <Link
                            // href={generateCustomerSiteUrl()}
                            onClick={handleLinkClick}
                            sx={{
                                fontSize: '0.8rem',
                                color: '#2563EB',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#1D4ED8',
                                },
                                fontFamily: `${FONT_FAMILY.MEDIUM} !important`,
                                ml: 2,
                            }}
                        >
                            Table Order Link
                        </Link>
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" color="#EA580C">
                        {formatPrice(totalAmount)}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Request Confirmation Buttons */}
            {(tableData?.waiterRequest || tableData?.checkOutRequest) && onConfirmRequest && (
                <Box display="flex" gap={2} mb={3} sx={{ flexShrink: 0 }}>
                    {/* Waiter Request Button */}
                    {tableData?.waiterRequest && (
                        <CustomButton
                            onClick={() => onConfirmRequest(tableData.id, 'waiter')}
                            disabled={confirmingRequest}
                            sx={{
                                backgroundColor: '#F44336',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#F44336',
                                },
                                '&:disabled': {
                                    backgroundColor: '#e0e0e0',
                                    color: '#9e9e9e',
                                }
                            }}
                        >
                            {confirmingRequest ? 'Confirming...' : 'Confirm Waiter'}
                        </CustomButton>
                    )}

                    {/* Checkout Request Button */}
                    {tableData?.checkOutRequest && (
                        <CustomButton
                            onClick={() => onConfirmRequest(tableData.id, 'checkout')}
                            disabled={confirmingRequest}
                        >
                            {confirmingRequest ? 'Confirming...' : 'Confirm Checkout'}
                        </CustomButton>
                    )}
                </Box>
            )}

            {/* Orders List */}
            <Box sx={{ overflow: "auto", flex: 1 }}>
                {validOrders.length > 0 ? (
                    <Stack spacing={3}>
                        {validOrders.map((order) => {
                            const isDeclined = order?.orderDetails?.orderStatus === ORDER_STATUS.DECLINED;
                            return (
                                <Box key={order.orderDetails.id} sx={{
                                    ...(isDeclined && {
                                        backgroundColor: '#FEF2F2',
                                        border: `1px solid ${themeColors.decline}`,
                                        p: 2
                                    })
                                }}>
                                    {/* Order Header */}
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Typography variant="h5">
                                                {formatDateTime(order.orderDetails.createdOn, DEFAULT_TIME_FORMAT)}
                                            </Typography>
                                            {isDeclined && (
                                                <Typography variant="body1" sx={{ color: themeColors.decline }}>
                                                    {order.orderDetails.orderStatus}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Order Items */}
                                    <Box sx={{ pl: 2 }}>
                                        {order.orderedItems.map((item, itemIndex) => {
                                            return (
                                                <Box key={itemIndex} mb={1}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2">
                                                                {item.quantity} x {item.title}
                                                            </Typography>
                                                            {item.removeIngredients && item.removeIngredients !== "[]" && (
                                                                <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                                                                    Customizations: {item.removeIngredients}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2">
                                                            {formatPrice(item.totalPrice)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        })}
                                        <Typography variant="h5" sx={{ textAlign: "right", borderTop: "0.5px solid #666", pt: 1 }}>
                                            {formatPrice(order.orderDetails.totalPrice)}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Stack>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                        <Typography variant="h6" color="text.secondary">
                            No orders available for this table
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Action Buttons */}
            {validOrders.length > 0 && (
                <Box display="flex" gap={2} mt={3} sx={{ flexShrink: 0 }}>
                    <CustomButton
                        fullWidth
                        onClick={onTerminateSession}
                        disabled={terminating}
                    >
                        {terminating ? 'Processing...' : 'Paid'}
                    </CustomButton>
                    <CustomButton
                        variant="text"
                        fullWidth
                        startIcon={<PrintIcon />}
                        disabled={printingBill}
                        onClick={onHandlePrintBill}
                    >
                        Print Receipt
                    </CustomButton>
                </Box>
            )}
            {validOrders?.length === 0 && tableData?.isOccupied && (
                <CustomButton
                    fullWidth
                    onClick={onTerminateSession}
                    disabled={terminating}
                >
                    Clear Table
                </CustomButton>
            )}
        </CustomPaperWrapper>
    );
};

export default TableOrderDetails; 