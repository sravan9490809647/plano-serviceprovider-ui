import React from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import Pagination from "../../../components/Pagination";
import ReceiptActionsMenu from "./ReceiptActionsMenu";
import ReceiptDetailsDialog from "./ReceiptDetailsDialog";
import { useReceiptActions } from "../hooks/useReceiptActions";
import Storage from "../../../utils/Storage";
import { DATE_TIME_FORMAT, formatDateTime } from "../../../utils/dateUtils";
import { formatPrice } from "../../../utils/common";
import StorageService from "../../../../services/StorageService";

interface Receipt {
    rtId: string;
    bId: string;
    tId: string;
    start: string;
    end: string;
    tableName: string;
    tableNumber: number;
    createdOn: string;
    totalAmount: number;
}

interface ReceiptsTableProps {
    receipts: Receipt[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    onViewReceipt: (receiptId: string) => void;
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
    receipts,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    onViewReceipt,
}) => {
    const {
        anchorEl,
        open,
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
    } = useReceiptActions();

    // Get business name and table name for the dialog
    const tableName = receiptData && receiptData.length > 0
        ? receiptData[0]?.orderDetails?.tableName || "Unknown Table"
        : "Unknown Table";

    return (
        <Paper sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
            {/* Single Table with Fixed Header and Scrollable Body */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <TableContainer sx={{ height: '100%' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">
                                        Table
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5">
                                        Start Time
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5">
                                        End Time
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h5">
                                        Total Amount
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="h5">
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receipts.map((receipt) => (
                                <TableRow key={receipt.rtId} hover>
                                    <TableCell
                                        onClick={() => onViewReceipt(receipt.rtId)}
                                    >
                                        <Box sx={{
                                            cursor: "pointer",
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: "#2563EB",
                                            }}>
                                                {receipt.tableName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Table #{receipt.tableNumber}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDateTime(receipt.start, DATE_TIME_FORMAT)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDateTime(receipt.end, DATE_TIME_FORMAT)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="medium">
                                            {formatPrice(receipt.totalAmount)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(event) => handleActionsClick(event, receipt.rtId)}
                                            title="Receipt Actions"
                                        >
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Fixed Pagination */}
            {totalItems > 0 && (
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
            )}

            {/* Actions Menu */}
            <ReceiptActionsMenu
                open={open}
                anchorEl={anchorEl}
                onClose={handleActionsClose}
                onEmailReceipt={handleEmailReceipt}
                onDownloadReceipt={handleDownloadReceipt}
                onPrintReceipt={handlePrintReceipt}
                printing={printing}
                downloading={downloading}
            />

            {/* Receipt Details Dialog */}
            <ReceiptDetailsDialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                receiptData={receiptData}
                tableName={tableName}
            />
        </Paper>
    );
};

export default ReceiptsTable; 