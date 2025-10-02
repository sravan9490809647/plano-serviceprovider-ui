import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { fetchOrdersWithFilters, updateOrderStatus } from "../../../redux/reducers/OrdersReducer";
import type { DateRangeSelection } from "../../../types";

import { DATE_TIME_FORMAT_UTC, formatDateAsUTC } from "../../../utils/dateUtils";
import { ENDPOINTS, ORDER_STATUS } from "../../../Constants";
import ApiService from "../../../services/ApiService";
import { toast } from "react-toastify";

// Global singleton to track API calls
let hasInitialized = false;
let initializationPromise: any = null;

export const useOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.orders);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
    const [selectedDateRange, setSelectedDateRange] = useState<DateRangeSelection | null>(null);
    const [filters, setFilters] = useState<{
        status: string[];
        paymentStatus: string[];
        paymentMethod: string[];
    }>({
        status: [],
        paymentStatus: [],
        paymentMethod: [],
    });
    const [statusLoading, setStatusLoading] = useState(false);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    // Initialize orders using global singleton with today's date
    useEffect(() => {
        const initializeOrders = async () => {
            if (hasInitialized) return;

            if (initializationPromise) {
                await initializationPromise;
                return;
            }
            // Always use filtered API with today's date
            initializationPromise = dispatch(fetchOrdersWithFilters({ startDate: formatDateAsUTC("", DATE_TIME_FORMAT_UTC), endDate: formatDateAsUTC("", DATE_TIME_FORMAT_UTC) }));

            try {
                await initializationPromise;
                hasInitialized = true;
            } catch (error) {
                initializationPromise = null;
            }
        };

        initializeOrders();
    }, [dispatch]);



    // Filter orders based on search term and status filter
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((order) =>
                // order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.tableName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by order status
        if (orderStatusFilter && orderStatusFilter !== ORDER_STATUS.ALL) {
            filtered = filtered.filter((order) =>
                order.orderStatus.toLowerCase().includes(orderStatusFilter.toLowerCase())
            );
        }

        return filtered;
    }, [orders, searchTerm, orderStatusFilter]);

    // Check if there are active filters
    const hasActiveFilters = Boolean(
        searchTerm ||
        orderStatusFilter ||
        selectedDateRange ||
        Object.values(filters).some(arr => arr.length > 0)
    );

    // Pagination calculations
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Handle date range apply
    const handleDateApply = async (dateRange: DateRangeSelection) => {
        setSelectedDateRange(dateRange);
        if (dateRange.startDate && dateRange.endDate) {
            const startDate = formatDateAsUTC(dateRange.startDate.toISOString());
            const endDate = formatDateAsUTC(dateRange.endDate.toISOString());
            dispatch(fetchOrdersWithFilters({ startDate, endDate }));
        }
        setCurrentPage(1);
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedDateRange(null);
        setFilters({
            status: [],
            paymentStatus: [],
            paymentMethod: [],
        });
        dispatch(fetchOrdersWithFilters({ startDate: formatDateAsUTC(), endDate: formatDateAsUTC() }));
        setCurrentPage(1);
    };

    // Handle filter changes
    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType as keyof typeof prev].includes(value)
                ? prev[filterType as keyof typeof prev].filter(item => item !== value)
                : [...prev[filterType as keyof typeof prev], value]
        }));
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Handle order status change
    const handleOrderStatusChange = (status: string) => {
        setOrderStatusFilter(status);
        setCurrentPage(1);
    };
    const handleOrderClick = async (orderId: string) => {
        setDetailLoading(true);
        try {
            const response = await ApiService.request('GET', `${ENDPOINTS.ORDERS.GET_ORDER_DETAIL_BY_ID}${orderId}`);
            setOrderDetails(response);
            setDialogOpen(true);
        } catch (error) {
            toast.error("Failed to get order details");
        } finally {
            setDetailLoading(false);
        }
    };
    // Handle order status update
    const handleOrderStatusUpdate = (id: string, status: string) => {
        setStatusLoading(true);
        if (status === "Accept") {
            ApiService.request('GET', `${ENDPOINTS.ORDERS.SET_ORDER_STATUS_TO_PREPARING}${id}`)
                .then(response => {
                    if (response.status === 1) {
                        dispatch(updateOrderStatus({ id, status: ORDER_STATUS.PREPARING }));
                        toast.success(response.message || "Order status updated to Preparing successfully");
                    } else {
                        toast.error(response.message || "Failed to update order status to Preparing");
                    }
                })
                .catch(() => {
                    toast.error("Failed to update order status to Preparing");
                })
                .finally(() => {
                    setStatusLoading(false);
                    handleCloseDialog();
                });
        }
        if (status === "Complete") {
            ApiService.request('GET', `${ENDPOINTS.ORDERS.SET_ORDER_STATUS_TO_COMPLETE}${id}`)
                .then(response => {
                    if (response.status === 1) {
                        dispatch(updateOrderStatus({ id, status: ORDER_STATUS.COMPLETED }));
                        toast.success(response.message || "Order status updated to Completed successfully");
                    } else {
                        toast.error(response.message || "Failed to update order status to Completed");
                    }
                })
                .catch(() => {
                    toast.error("Failed to update order status to Completed");
                })
                .finally(() => {
                    setStatusLoading(false);
                    handleCloseDialog();
                });
        }
        if (status === "Decline") {
            ApiService.request('GET', `${ENDPOINTS.ORDERS.SET_ORDER_STATUS_TO_DECLINE}${id}`)
                .then(response => {
                    if (response.status === 1) {
                        dispatch(updateOrderStatus({ id, status: ORDER_STATUS.DECLINED }));
                        toast.success(response.message || "Order status updated to Declined successfully");
                    } else {
                        toast.error(response.message || "Failed to update order status to Declined");
                    }
                })
                .catch(() => {
                    toast.error("Failed to update order status to Declined");
                })
                .finally(() => {
                    setStatusLoading(false);
                    handleCloseDialog();
                });
        }
    }
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setOrderDetails(null);
    };

    return {
        // Data
        orders: paginatedOrders,
        filteredOrders,
        loading,
        error,
        searchTerm,
        orderStatusFilter,
        selectedDateRange,
        filters,
        hasActiveFilters,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        statusLoading,
        orderDetails,
        dialogOpen,
        detailLoading,
        // Actions
        setSearchTerm,
        handleDateApply,
        handleClearFilters,
        handleFilterChange,
        handlePageChange,
        handleItemsPerPageChange,
        handleOrderStatusChange,
        handleOrderStatusUpdate,
        handleOrderClick,
        handleCloseDialog
    };
}; 