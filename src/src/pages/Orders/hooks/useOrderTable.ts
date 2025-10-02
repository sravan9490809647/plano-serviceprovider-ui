import { useState } from "react";
import ApiService from "../../../services/ApiService";
import { ENDPOINTS } from "../../../Constants";

export const useOrderTable = (onViewDetails?: (orderId: string) => void) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleActionsClick = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleActionsClose = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };

    const handleViewDetails = async () => {
        if (selectedOrderId) {
            if (onViewDetails) {
                onViewDetails(selectedOrderId);
            } else {
                try {
                    const response = await ApiService.request('GET', `${ENDPOINTS.ORDERS.GET_ORDER_DETAIL_BY_ID}${selectedOrderId}`);
                    // Here you can handle the order details response
                    // For example, open a modal, navigate to detail page, etc.
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            }
        }
        handleActionsClose();
    };

    const handleEditOrder = () => {
        // TODO: Implement edit order functionality
        handleActionsClose();
    };

    const handleCopyOrderId = () => {
        if (selectedOrderId) {
            navigator.clipboard.writeText(selectedOrderId);
            // You could add a toast notification here
        }
        handleActionsClose();
    };

    const handleDeleteOrder = () => {
        // TODO: Implement delete order functionality
        handleActionsClose();
    };

    return {
        anchorEl,
        open: Boolean(anchorEl),
        handleActionsClick,
        handleActionsClose,
        handleViewDetails,
        handleEditOrder,
        handleCopyOrderId,
        handleDeleteOrder,
    };
}; 