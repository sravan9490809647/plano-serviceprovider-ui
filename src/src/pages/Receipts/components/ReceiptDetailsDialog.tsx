import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Divider,
    IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { DATE_TIME_FORMAT, formatDateTime } from "../../../utils/dateUtils";
import { formatPrice } from "../../../utils/common";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { ORDER_STATUS } from "../../../Constants";
import StorageService from "../../../../services/StorageService";

interface ReceiptDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    receiptData: any;
    tableName: string;
}

const ReceiptDetailsDialog: React.FC<ReceiptDetailsDialogProps> = ({
    open,
    onClose,
    receiptData,
    tableName,
}) => {
    const businessName = StorageService.getItem("businessName");
    if (!receiptData || !Array.isArray(receiptData) || receiptData.length === 0) {
        return null;
    }

    // Filter out declined orders
    const nonDeclinedOrders = receiptData.filter(order =>
        order.orderDetails && order.orderDetails.orderStatus !== ORDER_STATUS.DECLINED
    );

    // Group all items by name and sum quantities (only from non-declined orders)
    const itemGroups = new Map();
    nonDeclinedOrders.forEach(order => {
        order.orderedItems.forEach((item: any) => {
            const key = item.title;
            if (itemGroups.has(key)) {
                const existing = itemGroups.get(key);
                existing.quantity += item.quantity;
                existing.totalPrice += item.totalPrice;
            } else {
                itemGroups.set(key, {
                    title: item.title,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    customizations: item.removeIngredients && item.removeIngredients !== "[]" ? item.removeIngredients : null
                });
            }
        });
    });

    // Calculate total amount (only from non-declined orders)
    const totalAmount = nonDeclinedOrders.reduce((sum, order) => {
        return sum + (order.orderDetails?.totalPrice || 0);
    }, 0);

    // Get the order date and time from the orderDetails in the array
    const validOrderDetails = receiptData.find(order => order.orderDetails)?.orderDetails;
    const orderDate = validOrderDetails?.createdOn || "";
    const orderDateString = formatDateTime(orderDate, DATE_TIME_FORMAT);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ alignSelf: 'center' }}>
                    Order ID: {validOrderDetails?.orderCode || 'N/A'}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <CustomPaperWrapper>
                    {/* Header */}
                    <Box textAlign="center" mb={1}>
                        <Typography variant="subtitle1" mb={1}>
                            Business: {businessName || "Restaurant"}
                        </Typography>
                        <Typography variant="subtitle1" mb={1}>
                            Table: {validOrderDetails?.tableName || tableName || "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Date: {orderDateString}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 1 }} />

                    {/* Items */}
                    <Box mb={2}>
                        {Array.from(itemGroups.values()).map((item, index) => (
                            <Box key={`${item.title}-${index}`} mb={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2">
                                            {item.quantity}x {item.title}
                                        </Typography>
                                        {item.customizations && (
                                            <Typography variant="body2" color="text.secondary">
                                                {item.customizations}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography variant="body1" fontWeight="bold" color="#EA580C">
                                        {formatPrice(item.totalPrice)}
                                    </Typography>
                                </Box>
                                {index < Array.from(itemGroups.values()).length - 1 && <Divider sx={{ mt: 0.5 }} />}
                            </Box>
                        ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Total */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            TOTAL
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="#EA580C">
                            {formatPrice(totalAmount)}
                        </Typography>
                    </Box>
                </CustomPaperWrapper>
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptDetailsDialog; 