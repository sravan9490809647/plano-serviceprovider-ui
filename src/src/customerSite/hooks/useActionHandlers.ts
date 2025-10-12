import { useState } from "react";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import StorageService from "../../../services/StorageService";
import { useSelector } from "react-redux";
import { PrintService } from "../../services/PrintService";
import type { RootState } from "../../redux/store";
import type { BusinessDetails } from "../../types";

export const useActionHandlers = () => {
    const [waiterLoading, setWaiterLoading] = useState<boolean>(false);
    const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [messageDialogOpen, setMessageDialogOpen] = useState<boolean>(false);
    const [receiptDialogOpen, setReceiptDialogOpen] = useState<boolean>(false);
    const [showEmailForm, setShowEmailForm] = useState<boolean>(false);

    const { tableDetails } = useSelector(
        (state: RootState) => state.table
    );
    const { businessDetails } = useSelector(
        (state: {
            businessDetails: {
                businessDetails: BusinessDetails | null;
                loading: boolean;
            };
        }) => state.businessDetails
    );
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
            setReceiptDialogOpen(true);
            if (response.status === 1) {
                toast.success(response.message || "Checkout requested successfully!");
                setShowEmailForm(false); // Reset email form state
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

    const handleReceiptOption = async (receiptOption: string) => {
        // Handle receipt option selection
        if (receiptOption === 'email') {
            setShowEmailForm(true);
        } else if (receiptOption === 'download') {
            try {
                if (!tableDetails?.rtId) {
                    toast.error('Table details not found');
                    setReceiptDialogOpen(false);
                    return;
                }

                // Call the API to get receipt data
                const response = await ApiService.request(
                    'GET',
                    `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${tableDetails.rtId}`
                );

                if (response && Array.isArray(response) && response.length > 0) {
                    // Get business name from storage or use a default

                    // Get table name from the first order
                    const tableName = response[0]?.orderDetails?.tableName || "Unknown Table";

                    // Use the PrintService to download the receipt as PDF
                    await PrintService.downloadReceipt({
                        orderDetails: response,
                        tableName: tableName,
                        businessName: businessDetails?.businessName || "Restaurant"
                    });

                    toast.success("Receipt downloaded successfully");
                } else {
                    toast.error("No receipt data found");
                }
            } catch (error) {
                toast.error("Failed to download receipt");
            } finally {
                setShowEmailForm(false);
                setReceiptDialogOpen(false);
            }

        } else if (receiptOption === 'none') {
            setShowEmailForm(false);
            setReceiptDialogOpen(false);
        } else {
            setShowEmailForm(false);
            setReceiptDialogOpen(false);
        }
    };

    const handleSendReceiptEmail = async (email: string) => {
        // Handle sending receipt via email
        setReceiptDialogOpen(false);
        setShowEmailForm(false);
        toast.success(`Receipt will be sent to: ${email}`);
    };

    const handleBackToOptions = () => {
        setShowEmailForm(false);
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
        receiptDialogOpen,
        setReceiptDialogOpen,
        showEmailForm,
        handleActionClick,
        handleSendMessage,
        handleReceiptOption,
        handleSendReceiptEmail,
        handleBackToOptions,
    };
}; 