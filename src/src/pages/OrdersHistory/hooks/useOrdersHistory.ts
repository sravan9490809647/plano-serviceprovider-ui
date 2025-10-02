import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { fetchOrdersHistory, updateOrderStatus } from "../../../redux/reducers/OrdersHistoryReducer";
import type { AppDispatch } from "../../../redux/store";
import moment from "moment";
import { formatDateAsLocal, formatDateAsUTC } from "../../../utils/dateUtils";
import { ENDPOINTS, ORDER_STATUS } from "../../../Constants";
import ApiService from "../../../services/ApiService";
import { toast } from "react-toastify";

export const useOrdersHistory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.ordersHistory);
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
    const [statusLoading, setStatusLoading] = useState(false);
    // Local state
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: [] as string[],
        paymentStatus: [] as string[],
        paymentMethod: [] as string[],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    } | null>(null);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    // Load all orders initially
    useEffect(() => {
        dispatch(fetchOrdersHistory());
    }, [dispatch]);

    // Filter orders based on search term, filters, and date range
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Filter by date range
        if (dateRange) {
            filtered = filtered.filter((order) => {
                const orderDate = formatDateAsLocal(order.createdOn);
                const startDate = moment(dateRange.startDate, 'MM-DD-YYYY');
                const endDate = moment(dateRange.endDate, 'MM-DD-YYYY');
                const orderMoment = moment(orderDate, 'MM-DD-YYYY');

                return orderMoment.isBetween(startDate, endDate, 'day', '[]'); // inclusive
            });
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((order) =>
                // order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order?.tableName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by order status
        if (orderStatusFilter && orderStatusFilter !== ORDER_STATUS.ALL) {
            filtered = filtered.filter((order) =>
                order.orderStatus.toLowerCase().includes(orderStatusFilter.toLowerCase())
            );
        }

        return filtered;
    }, [orders, searchTerm, dateRange, orderStatusFilter]);

    // Pagination
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Check if there are active filters
    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm ||
            orderStatusFilter ||
            dateRange !== null
        );
    }, [searchTerm, orderStatusFilter, dateRange]);

    // Event handlers
    const handleDateApply = (range: any) => {
        if (range && range.startDate && range.endDate) {
            const startDate = formatDateAsUTC(range.startDate.toISOString());
            const endDate = formatDateAsUTC(range.endDate.toISOString());
            setDateRange({ startDate, endDate });
            setCurrentPage(1); // Reset to first page
        }
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setFilters({
            status: [],
            paymentStatus: [],
            paymentMethod: [],
        });
        setDateRange(null);
        setCurrentPage(1);
    };
    const handleOrderStatusChange = (status: string) => {
        setOrderStatusFilter(status);
        setCurrentPage(1);
    };

    const handleFilterChange = (section: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [section]: prev[section as keyof typeof prev].includes(value)
                ? prev[section as keyof typeof prev].filter((item) => item !== value)
                : [...prev[section as keyof typeof prev], value],
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
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
        orders: paginatedOrders,
        loading,
        error,
        searchTerm,
        filters,
        hasActiveFilters,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        dateRange,
        orderStatusFilter,
        statusLoading,
        orderDetails,
        dialogOpen,
        detailLoading,
        handleOrderClick,
        setSearchTerm,
        handleDateApply,
        handleClearFilters,
        handleFilterChange,
        handlePageChange,
        handleItemsPerPageChange,
        handleOrderStatusChange,
        handleOrderStatusUpdate,
        handleCloseDialog
    };
}; 