import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { formatDateTime } from "../../../utils/dateUtils";
import { DEFAULT_DATE_TIME_FORMAT, FONT_FAMILY } from "../../../Constants";
import CustomButton from "../../../components/Button";
import StatusText from "./StatusText";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import OrderStatusButtons from "./OrderStatusButtons";
import { formatPrice } from "../../../utils/common";

interface OrderItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
    totalPrice: number;
    removeIngredients: string;
    itemVariations: any;
    optionGroups: string;
    thumbnailImage: string | null;
}

interface ItemVariation {
    id: string;
    title: string;
    price: number;
}

interface OptionGroup {
    id: string;
    title: string;
    required: boolean;
    allowMultiple: boolean;
    maxSelections: number;
    options: Array<{
        id: string;
        title: string;
        price: number;
    }>;
}

interface Customer {
    id: string;
    fullName: string;
    lastName: string;
    email: string;
    mobile: string;
}

interface OrderDetails {
    id: string;
    orderCode: string;
    totalPrice: number;
    note: string;
    appliedOffers: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    tableName: string;
    createdOn: string;
    updatedOn: string;
    customer: Customer;
    items: OrderItem[];
}

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    orderDetails: OrderDetails | null;
    onOrderStatusUpdate: (orderId: string, status: string) => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
    open,
    onClose,
    orderDetails,
    onOrderStatusUpdate
}) => {
    if (!orderDetails) return null;

    const parseRemovedIngredients = (removeIngredients: string): string[] => {
        try {
            return JSON.parse(removeIngredients);
        } catch {
            return [];
        }
    };

    const parseItemVariations = (itemVariations: any): ItemVariation | null => {
        if (!itemVariations) return null;
        try {
            if (typeof itemVariations === 'string') {
                return JSON.parse(itemVariations);
            }
            return itemVariations;
        } catch {
            return null;
        }
    };

    const parseOptionGroups = (optionGroups: string): OptionGroup[] => {
        try {
            return JSON.parse(optionGroups);
        } catch {
            return [];
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5">
                            {orderDetails.orderCode}
                        </Typography>
                        <StatusText status={orderDetails.orderStatus} />
                    </Stack>
                    <CustomButton
                        onClick={onClose}
                        variant="text"
                        startIcon={<Close />}
                    >
                        Close
                    </CustomButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 0 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <CustomPaperWrapper>
                            <Typography variant="h2" fontSize={18} gutterBottom>
                                Order Information
                            </Typography>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Order Date:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>
                                        {formatDateTime(orderDetails.createdOn, DEFAULT_DATE_TIME_FORMAT)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Table:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>
                                        {orderDetails.tableName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CustomPaperWrapper>
                    </Grid>

                    {/* Customer Information */}
                    <Grid item xs={12} md={6}>
                        <CustomPaperWrapper>
                            <Typography variant="h2" fontSize={18} gutterBottom>
                                Customer Information
                            </Typography>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Avatar sx={{ bgcolor: '#2563EB', mr: 2, width: 25, height: 25, fontSize: 14 }}>
                                    {orderDetails.customer.fullName.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>
                                    {orderDetails.customer.fullName} {orderDetails.customer.lastName}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important`, display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                📧 {orderDetails.customer.email}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important`, display: 'flex', alignItems: 'center' }}>
                                📱 {orderDetails.customer.mobile}
                            </Typography>
                        </CustomPaperWrapper>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                        <CustomPaperWrapper>
                            <Typography variant="h2" fontSize={18} gutterBottom>
                                Order Items
                            </Typography>
                            <List>
                                {orderDetails.items.map((item) => {
                                    const removedIngredients = parseRemovedIngredients(item.removeIngredients);
                                    const itemVariation = parseItemVariations(item.itemVariations);
                                    const optionGroups = parseOptionGroups(item.optionGroups);

                                    return (
                                        <React.Fragment key={item.id}>
                                            <ListItem sx={{ py: 0 }}>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="bold" color="#EA580C">
                                                                {formatPrice(item.totalPrice)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box mt={0.5}>
                                                            <Typography variant="body2" color="text.secondary" mb={1}>
                                                                Quantity: {item.quantity} × {formatPrice(item.price)}
                                                            </Typography>

                                                            {/* Item Variation */}
                                                            {itemVariation && (
                                                                <Box mb={1}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Size: {itemVariation.title} (+{formatPrice(itemVariation.price)})
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Removed Ingredients */}
                                                            {removedIngredients.length > 0 && (
                                                                <Box mb={1}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Removed: {removedIngredients.join(', ')}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Option Groups */}
                                                            {optionGroups.length > 0 && (
                                                                <Box>
                                                                    {optionGroups.map((group, groupIndex) => (
                                                                        <Box key={group.id} mb={groupIndex < optionGroups.length - 1 ? 1 : 0}>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {group.title}:
                                                                            </Typography>
                                                                            {group.options.map((option) => (
                                                                                <Typography
                                                                                    key={option.id}
                                                                                    variant="body2"
                                                                                    color="text.secondary"
                                                                                    sx={{ ml: 2 }}
                                                                                >
                                                                                    • {option.title} (+{formatPrice(option.price)})
                                                                                </Typography>
                                                                            ))}
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </React.Fragment>
                                    );
                                })}
                                <Divider />
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="h5">
                                        Total Amount:
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }} color="#EA580C">
                                        {formatPrice(orderDetails.totalPrice)}
                                    </Typography>
                                </Stack>
                            </List>
                        </CustomPaperWrapper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ borderTop: "1px solid #F0F0F0" }}>
                <OrderStatusButtons
                    orderId={orderDetails.id}
                    orderStatus={orderDetails.orderStatus}
                    onStatusUpdate={onOrderStatusUpdate}
                    size="medium"
                    variant="dialog"
                />
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog; 