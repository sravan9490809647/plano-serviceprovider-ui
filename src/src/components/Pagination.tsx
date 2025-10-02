import React from "react";
import {
    Box,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
        onItemsPerPageChange(Number(event.target.value));
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                px: 2,
                borderTop: "1px solid #E5E7EB",
            }}
        >
            {/* Items per page selector */}
            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                    Items per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        displayEmpty
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Page info */}
            <Typography variant="body2" color="text.secondary">
                {startItem}-{endItem} of {totalItems} items
            </Typography>

            {/* Page navigation */}
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="small"
                >
                    <ChevronLeftIcon />
                </IconButton>

                {getPageNumbers().map((page, index) => (
                    <Box key={index}>
                        {page === '...' ? (
                            <Typography
                                variant="body2"
                                sx={{ px: 1, color: "text.secondary" }}
                            >
                                ...
                            </Typography>
                        ) : (
                            <IconButton
                                onClick={() => onPageChange(page as number)}
                                sx={{
                                    minWidth: 32,
                                    height: 32,
                                    backgroundColor: currentPage === page ? "#000" : "transparent",
                                    color: currentPage === page ? "#fff" : "inherit",
                                    "&:hover": {
                                        backgroundColor: currentPage === page ? "#000" : "#f5f5f5",
                                    },
                                }}
                                size="small"
                            >
                                <Typography variant="body2" fontWeight={currentPage === page ? 600 : 400}>
                                    {page}
                                </Typography>
                            </IconButton>
                        )}
                    </Box>
                ))}

                <IconButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="small"
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Pagination; 