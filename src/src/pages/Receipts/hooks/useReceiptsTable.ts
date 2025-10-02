import { useState, useMemo } from "react";

interface Receipt {
    rtId: string;
    bId: string;
    tId: string;
    start: string;
    end: string;
    tableName: string;
    tableNumber: number;
    totalAmount: number;
    createdOn: string;
}

export const useReceiptsTable = (receipts: Receipt[], searchTerm: string = "") => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter receipts based on search term
    const filteredReceipts = useMemo(() => {
        if (!searchTerm.trim()) {
            return receipts;
        }

        const searchLower = searchTerm.toLowerCase();
        return receipts.filter((receipt) => {
            return (
                receipt.tableName.toLowerCase().includes(searchLower) ||
                receipt.tableNumber.toString().includes(searchLower) ||
                receipt.rtId.toLowerCase().includes(searchLower)
            );
        });
    }, [receipts, searchTerm]);

    // Calculate pagination based on filtered results
    const totalItems = filteredReceipts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get current page receipts
    const paginatedReceipts = useMemo(() => {
        return filteredReceipts.slice(startIndex, endIndex);
    }, [filteredReceipts, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Reset to first page when search term changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        paginatedReceipts,
        filteredReceipts,
        handlePageChange,
        handleItemsPerPageChange,
    };
}; 