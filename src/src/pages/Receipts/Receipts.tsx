import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { StickyBox } from "../../Styles";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import ReceiptsTable from "./components/ReceiptsTable";
import { useReceiptsTable } from "./hooks/useReceiptsTable";
import { fetchAllReceipts, fetchReceiptsWithFilters } from "../../redux/reducers/ReceiptsReducer";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import ReceiptDetailsDialog from "./components/ReceiptDetailsDialog";
import { toast } from "react-toastify";
import { DATE_TIME_FORMAT_UTC, formatDateAsLocal } from "../../utils/dateUtils";
import ReceiptFilters from "./components/ReceiptFilters";

const Receipts: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { receipts, loading, error } = useSelector(
        (state: {
            receipts: {
                receipts: any[];
                loading: boolean;
                error: string | null;
            };
        }) => state.receipts
    );

    // State for filters
    const [dateRange, setDateRange] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailLoading, setDetailLoading] = useState(false);
    // Use pagination hook with search term
    const {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginatedReceipts,
        handlePageChange,
        handleItemsPerPageChange,
    } = useReceiptsTable(receipts, searchTerm);

    // State for receipt details dialog
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    // Fetch receipts on component mount
    useEffect(() => {
        dispatch(fetchAllReceipts());
    }, [dispatch]);

    // Event handlers
    const handleDateApplyWithRange = (range: any) => {
        setDateRange(range);

        if (range && range.startDate && range.endDate) {
            // Format dates for API
            const startDate = formatDateAsLocal(range.startDate.toISOString(), DATE_TIME_FORMAT_UTC);
            const endDate = formatDateAsLocal(range.endDate.toISOString(), DATE_TIME_FORMAT_UTC);

            dispatch(fetchReceiptsWithFilters({ startDate, endDate }));
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    const handleViewReceipt = async (receiptId: string) => {
        setDetailLoading(true);
        try {
            // Call the API to get receipt data
            const response = await ApiService.request(
                'GET',
                `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${receiptId}`
            );

            if (response && Array.isArray(response) && response.length > 0) {
                setReceiptData(response);
                setViewDialogOpen(true);
            } else {
                toast.error("No receipt data found");
            }
        } catch (error) {
            toast.error("Failed to fetch receipt data");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setReceiptData(null);
    };

    // Loading state
    if (loading) {
        return <Loader />;
    }

    // Error state
    if (error) {
        return <ErrorMessage title="Receipts" message={`Error: ${error}`} />;
    }

    return (
        <Box>
            <StickyBox sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h3">Receipts</Typography>
            </StickyBox>

            <Box px={2}>
                <ReceiptFilters
                    searchTerm={searchTerm}
                    dateRange={dateRange}
                    onDateApply={handleDateApplyWithRange}
                    onSearchChange={handleSearchChange}
                />

                {receipts.length > 0 ? (
                    <>
                        {detailLoading && <Loader />}
                        <ReceiptsTable
                            receipts={paginatedReceipts}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            onViewReceipt={handleViewReceipt}
                        />
                    </>
                ) : (
                    <EmptyState
                        title="No receipts found"
                    />
                )}
            </Box>
            {/* Receipt Details Dialog */}
            <ReceiptDetailsDialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                receiptData={receiptData}
                tableName={receiptData && receiptData.length > 0
                    ? receiptData[0]?.orderDetails?.tableName || "Unknown Table"
                    : "Unknown Table"}
            />
        </Box>
    );
};

export default Receipts; 