import { useState } from "react";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import StorageService from "../../../services/StorageService";

export const useActionHandlers = () => {
    const [waiterLoading, setWaiterLoading] = useState<boolean>(false);
    const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [messageDialogOpen, setMessageDialogOpen] = useState<boolean>(false);

    const handleWaiterRequest = async () => {
        try {
            setWaiterLoading(true);
            const tableId = StorageService.getItem('tableId');
            if (!tableId) {
                return;
            }

            const response = await ApiService.request(
                "GET",
                `${ENDPOINTS.TABLES.WAITER_REQUEST}?TableId=${tableId}`
            );
            if (response.status === 1) {
                toast.success(response.message || "Waiter requested successfully!");
            } else if (response?.status === 0) {
                toast.error(response.message);
            } else {
                toast.error("Failed to request waiter. Please try again.");
            }

        } catch (error) {
            if ((error as any).status === 0) {
                toast.info((error as any).message);
                return;
            } else {
                toast.error("Failed to request waiter. Please try again.");
            }
        } finally {
            setWaiterLoading(false);
        }
    };

    const handleCheckoutRequest = async () => {
        try {
            setCheckoutLoading(true);
            const tableId = StorageService.getItem('tableId');
            if (!tableId) {
                return;
            }

            const response = await ApiService.request(
                "GET",
                `${ENDPOINTS.TABLES.CHECKOUT_REQUEST}?TableId=${tableId}`
            );

            if (response.status === 1) {
                toast.success(response.message || "Checkout requested successfully!");
            } else if (response?.status === 0) {
                toast.error(response.message);
            } else {
                toast.error("Failed to request checkout. Please try again.");
            }

        } catch (error) {
            if ((error as any).status === 0) {
                toast.info((error as any).message);
                return;
            } else {
                toast.error("Failed to request checkout. Please try again.");
            }
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleMessageRequest = () => {
        setMessageDialogOpen(true);
    };

    const handleSendMessage = async (message: string) => {
        try {
            setMessageLoading(true);
            const tableId = StorageService.getItem('tableId');
            if (!tableId) {
                toast.error("No table ID found");
                return;
            }
            const response = await ApiService.request(
                "GET",
                `${ENDPOINTS.TABLES.SEND_MESSAGE}?TableId=${tableId}&Message=${encodeURIComponent(message)}`
            );
            if (response.status === 1) {
                toast.success(response.message || "Message sent successfully!");
                setMessageDialogOpen(false);
            } else {
                toast.error("Failed to send message. Please try again.");
            }

        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setMessageLoading(false);
        }
    };

    const handleActionClick = (actionId: string) => {
        switch (actionId) {
            case "waiter":
                handleWaiterRequest();
                break;
            case "checkout":
                handleCheckoutRequest();
                break;
            case "message":
                handleMessageRequest();
                break;
            default:
        }
    };

    return {
        waiterLoading,
        checkoutLoading,
        messageLoading,
        messageDialogOpen,
        setMessageDialogOpen,
        handleActionClick,
        handleSendMessage,
    };
}; 