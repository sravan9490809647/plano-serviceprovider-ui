import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import ApiService from "../../../services/ApiService";
import { ENDPOINTS } from "../../../Constants";
import { PrintService } from "../../../services/PrintService";
import { toast } from "react-toastify";
import Storage from "../../../utils/Storage";

export const useReceiptActions = () => {
    const dispatch: AppDispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
    const [printing, setPrinting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    const handleActionsClick = (event: React.MouseEvent<HTMLElement>, receiptId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedReceiptId(receiptId);
    };

    const handleActionsClose = () => {
        setAnchorEl(null);
        setSelectedReceiptId(null);
    };

    const handleViewReceipt = async () => {
        if (!selectedReceiptId) {
            handleActionsClose();
            return;
        }

        try {
            // Call the API to get receipt data
            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${selectedReceiptId}`
            );

            if (response && Array.isArray(response) && response.length > 0) {
                setReceiptData(response);
                setViewDialogOpen(true);
            } else {
                toast.error("No receipt data found");
            }
        } catch (error) {
            console.error('Error fetching receipt data:', error);
            toast.error("Failed to fetch receipt data");
        } finally {
            handleActionsClose();
        }
    };

    const handleEmailReceipt = () => {
        if (selectedReceiptId) {
            console.log('Email receipt:', selectedReceiptId);
            // TODO: Implement email receipt functionality
        }
        handleActionsClose();
    };

    const handleDownloadReceipt = async () => {
        if (!selectedReceiptId) {
            handleActionsClose();
            return;
        }

        setDownloading(true);
        try {
            // Call the API to get receipt data
            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${selectedReceiptId}`
            );

            if (response && Array.isArray(response) && response.length > 0) {
                // Get business name from storage or use a default
                const businessName = Storage.getItem("businessName") || "Restaurant";

                // Get table name from the first order
                const tableName = response[0]?.orderDetails?.tableName || "Unknown Table";

                // Use the PrintService to download the receipt as PDF
                await PrintService.downloadReceipt({
                    orderDetails: response,
                    tableName: tableName,
                    businessName: businessName
                });

                toast.success("Receipt downloaded successfully");
            } else {
                toast.error("No receipt data found");
            }
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error("Failed to download receipt");
        } finally {
            setDownloading(false);
            handleActionsClose();
        }
    };

    const handlePrintReceipt = async () => {
        if (!selectedReceiptId) {
            handleActionsClose();
            return;
        }

        setPrinting(true);
        try {
            // Call the API to get receipt data
            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${selectedReceiptId}`
            );

            if (response && Array.isArray(response) && response.length > 0) {
                // Get business name from storage or use a default
                const businessName = Storage.getItem("businessName") || "Restaurant";

                // Get table name from the first order
                const tableName = response[0]?.orderDetails?.tableName || "Unknown Table";

                // Use the existing PrintService to print the receipt
                await PrintService.printReceipt({
                    orderDetails: response,
                    tableName: tableName,
                    businessName: businessName
                });

                toast.success("Receipt sent to printer successfully");
            } else {
                toast.error("No receipt data found");
            }
        } catch (error) {
            console.error('Error printing receipt:', error);
            toast.error("Failed to print receipt");
        } finally {
            setPrinting(false);
            handleActionsClose();
        }
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setReceiptData(null);
    };

    return {
        anchorEl,
        open: Boolean(anchorEl),
        selectedReceiptId,
        printing,
        downloading,
        viewDialogOpen,
        receiptData,
        handleActionsClick,
        handleActionsClose,
        handleViewReceipt,
        handleEmailReceipt,
        handleDownloadReceipt,
        handlePrintReceipt,
        handleCloseViewDialog,
    };
}; 