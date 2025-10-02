import React from "react";
import {
    Box,
    Typography,
    Stack,
} from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import type { ReservedTableOrder } from "../../../types";
import { CURRENCY, DEFAULT_TIME_FORMAT } from "../../../Constants";
import { formatDateTime } from "../../../utils/dateUtils";
import DialogWrapper from "./DialogWrapper";

interface TableOrderDetailsProps {
    orderDetails: ReservedTableOrder[];
    onClose: () => void;
}

const TableOrderDetails: React.FC<TableOrderDetailsProps> = ({
    orderDetails,
    onClose
}) => {
    // Filter out orders with null orderDetails and calculate total
    const validOrders = Array.isArray(orderDetails)
        ? orderDetails.filter(order => order.orderDetails !== null)
        : [];

    const totalAmount = validOrders.reduce((sum, order) => {
        return sum + (order.orderDetails?.totalPrice || 0);
    }, 0);

    return (
        <DialogWrapper
            title={`Order Details`}
            onClose={onClose}
            open={validOrders.length > 0}
        >
            <CustomPaperWrapper sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
                {/* Orders List */}
                <Box sx={{ overflow: "auto", flex: 1 }}>
                    {validOrders.length > 0 && (
                        <Stack spacing={3}>
                            {validOrders.map((order) => (
                                <Box key={order.orderDetails?.id || Math.random()}>
                                    {/* Order Header */}
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Typography variant="body1" sx={{ color: "#666" }}>
                                                {order.orderDetails?.createdOn &&
                                                    formatDateTime(order.orderDetails.createdOn, DEFAULT_TIME_FORMAT)
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Order Items */}
                                    <Box sx={{ pl: 2 }}>
                                        {order.orderedItems && order.orderedItems.map((item, itemIndex) => (
                                            <Box key={itemIndex} mb={1}>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                                            {item.quantity} x {item.title}
                                                        </Typography>
                                                        {item.removeIngredients && item.removeIngredients !== "[]" && (
                                                            <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                                                                Customizations: {item.removeIngredients}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: "medium", ml: 2 }}>
                                                        {CURRENCY.symbol}{item.totalPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                        {order.orderDetails?.totalPrice && (
                                            <Typography variant="h5" sx={{ textAlign: "right", borderTop: "0.5px solid #666", pt: 1 }}>
                                                {CURRENCY.symbol}{order.orderDetails.totalPrice.toFixed(2)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Typography variant="h5" sx={{ textAlign: "right", borderTop: "0.5px solid #666", pt: 1 }}>
                        Total:  {CURRENCY.symbol}{totalAmount.toFixed(2)}
                    </Typography>
                </Box>
            </CustomPaperWrapper>
        </DialogWrapper>
    );
};

export default TableOrderDetails; 