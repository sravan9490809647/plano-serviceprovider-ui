import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchTables, setUnseenMessagesCount } from "../../redux/reducers/TablesReducer";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import TablesOverview from "./components/TablesOverview";
import { Settings } from "@mui/icons-material";
import type { Table, ReservedTableOrdersResponse, BusinessDetails } from "../../types";
import Storage from "../../utils/Storage";
import { ENDPOINTS, POLLING_INTERVALS } from "../../Constants";
import ApiService from "../../services/ApiService";
import TableOrderDetails from "./components/TableOrderDetails";
import { toast } from "react-toastify";
import { onFetchBusinessDetails } from "../../redux/reducers/BusinessReducer";
import CustomerRequests from "./components/CustomerRequests";
import { useNavigate } from "react-router-dom";
import { TABLE_STATUSES } from "../../Constants";
import { PrintService } from "../../services/PrintService";
import TableMessages from "./components/TableMessages";

const Tables: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { tables, unseenMessagesCount, loading } = useSelector((state: RootState) => state.tables);
    const { orders } = useSelector((state: RootState) => state.orders);
    const { businessDetails } = useSelector((state: { business: { businessDetails: BusinessDetails | null } }) => state.business);

    const [reservedTableOrders, setReservedTableOrders] = useState<ReservedTableOrdersResponse | null>(null);
    const [tableRtId, setTableRtId] = useState("");
    const [terminating, setTerminating] = useState(false);
    const [tableMessagesOverview, setTableMessagesOverview] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
    const [selectedTableData, setSelectedTableData] = useState<any>(null);
    const [printingBill, setPrintingBill] = useState(false);
    const [notificationType, setNotificationType] = useState<any>(null);
    const businessId = Storage.getItem("businessId") || "";
    const businessName = businessDetails?.businessName || "RESTAURANT NAME";

    const orderedCount = useMemo(() =>
        orders.filter(order => order.orderStatus === 'Ordered').length,
        [orders]
    );

    useEffect(() => {
        if (!businessId) return;
        // Fetch business details once
        dispatch(onFetchBusinessDetails(businessId));
        // Fetch tables immediately
        dispatch(fetchTables(businessId));
        fetchUnseenMessagesCount();
        // Set up interval polling for tables
        const intervalId = window.setInterval(() => {
            dispatch(fetchTables(businessId));
            fetchUnseenMessagesCount();
        }, POLLING_INTERVALS.ORDERS);

        return () => {
            clearInterval(intervalId);
        };
    }, [businessId, dispatch]);

    const fetchUnseenMessagesCount = useCallback(async () => {
        const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLE_MESSAGES_UNSEEN_COUNT}${businessId}`)
        dispatch(setUnseenMessagesCount(response.unseenMessagesCount));
    }, [businessId, dispatch]);

    const handleTerminateSession = useCallback(async () => {
        if (!tableRtId) {
            console.error('No RTId found');
            return;
        }

        setTerminating(true);
        try {
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.TERMINATE_RESERVE_TABLE_SESSION}${tableRtId}`);
            if (response.status === 1) {
                toast.success(response.message || "Table session terminated successfully");
                setReservedTableOrders(null);
                setTableRtId("");
                setSelectedTableData(null);
                if (businessId) {
                    dispatch(fetchTables(businessId));
                }
            } else {
                toast.error(response.message || "Failed to terminate table session:");
            }
        } catch (error) {
            toast.error("Failed to terminate table session:" + error);
        } finally {
            setTerminating(false);
        }
    }, [tableRtId, businessId, dispatch]);

    const mappedTables = useMemo(() =>
        tables.map(table => {
            let status: "available" | "occupied" | "waiter" | "checkout";

            if (table.checkOutRequest) {
                status = TABLE_STATUSES.CHECKOUT;
            } else if (table.waiterRequest) {
                status = TABLE_STATUSES.WAITER;
            } else if (table.isOccupied) {
                status = TABLE_STATUSES.OCCUPIED;
            } else {
                status = TABLE_STATUSES.AVAILABLE;
            }
            return { ...table, status };
        }),
        [tables]
    );

    const fetchReservedTableOrders = useCallback(async (table: Table) => {
        setTableRtId(table.rtId || "");
        setSelectedTableData(table);
        setTableMessagesOverview([]);

        if (!table?.rtId) {
            setLoadingOrderDetails(false);
            setReservedTableOrders(null);
            return;
        }

        setLoadingOrderDetails(true);
        try {
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${table.rtId}`);
            setReservedTableOrders(response);
        } catch (error) {
            setReservedTableOrders(null);
        } finally {
            setLoadingOrderDetails(false);
        }
    }, []);

    const fetchTableMessagesOverview = useCallback(async (type: any) => {
        setLoadingMessages(true);
        try {
            setReservedTableOrders(null);
            setSelectedTableData(null);

            let response;
            switch (type) {
                case 'waiter':
                    response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_WAITER_REQUESTS}${businessId}`);
                    break;
                case 'checkOut':
                    response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_CHECKOUT_REQUESTS}${businessId}`);
                    break;
                default:
                    response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLE_MESSAGES_OVERVIEW}${businessId}`);
            }

            if (!Array.isArray(response)) {
                setTableMessagesOverview([]);
                return;
            }
            setTableMessagesOverview(response || []);
        } catch (error) {
            setTableMessagesOverview([]);
        } finally {
            setLoadingMessages(false);
        }
    }, [businessId]);

    const notificationCounts = useMemo(() => ({
        orders: orderedCount,
        messages: unseenMessagesCount,
        waiter: tables.filter(table => table.waiterRequest).length,
        checkOut: tables.filter(table => table.checkOutRequest).length
    }), [tables, orderedCount]);

    const onNotificationClick = useCallback((type: 'orders' | 'waiter' | 'messages' | 'checkOut') => {
        setNotificationType(type);
        if (type === 'orders') {
            navigate('/orders');
        } else {
            fetchTableMessagesOverview(type);
        }
    }, [navigate, fetchTableMessagesOverview]);

    const handleConfirmRequest = useCallback(async (tableId: string, requestType: any, source: any) => {
        try {
            const endpoint = requestType === 'waiter'
                ? `${ENDPOINTS.TABLES.DISABLE_WAITER_REQUEST}${tableId}`
                : `${ENDPOINTS.TABLES.DISABLE_CHECKOUT_REQUEST}${tableId}`;

            const response = await ApiService.request('GET', endpoint);
            if (response.status === 1) {
                toast.success(response.message || "Request confirmed successfully");
                dispatch(fetchTables(businessId));
                setReservedTableOrders(null);
                if (source === "notification") {
                    fetchTableMessagesOverview(requestType);
                }
                setTableRtId("");
                setSelectedTableData(null);
            } else {
                toast.error(response.message || "Failed to confirm request");
            }
        } catch (error) {
            toast.error("Failed to confirm request: " + error);
        }
    }, [businessId, dispatch, fetchTableMessagesOverview]);

    const handlePrintBill = useCallback(async () => {
        if (!selectedTableData?.rtId) return;

        setPrintingBill(true);
        try {
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${selectedTableData.rtId}`);
            setReservedTableOrders(response);

            // Await the printReceipt call since it's now async
            await PrintService.printReceipt({
                orderDetails: response,
                tableName: selectedTableData.tableName,
                businessName
            });
        } catch (error) {
            toast.error("Failed to print bill:" + error);
        } finally {
            setPrintingBill(false);
        }
    }, [selectedTableData, businessName]);

    const handleTableClose = useCallback(() => {
        setReservedTableOrders(null);
        setTableRtId("");
        setSelectedTableData(null);
    }, []);

    const handleMessagesClose = useCallback(() => {
        setTableMessagesOverview([]);
    }, []);
    return (
        <Box>
            <Header
                title="Tables"
                buttonIcon={<Settings />}
                showNotifications={true}
                notificationCounts={notificationCounts}
                onNotificationClick={onNotificationClick}
            />

            <Box p={2}>
                {/* {loading ? (
                    <Loader />
                ) : ( */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={selectedTableData || tableMessagesOverview.length > 0 ? 6 : 12}>
                        <TablesOverview
                            tables={mappedTables}
                            fullWidth={!(selectedTableData || tableMessagesOverview.length > 0)}
                            onTableClick={fetchReservedTableOrders}
                        />
                    </Grid>

                    {selectedTableData ? (
                        <Grid item xs={12} md={6}>
                            {loadingOrderDetails ? (
                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "calc(100vh - 120px)" }}>
                                    <Loader />
                                </Box>
                            ) : (
                                <TableOrderDetails
                                    orderDetails={reservedTableOrders}
                                    onClose={handleTableClose}
                                    onTerminateSession={handleTerminateSession}
                                    terminating={terminating}
                                    tableData={selectedTableData}
                                    onConfirmRequest={handleConfirmRequest}
                                    onHandlePrintBill={handlePrintBill}
                                    printingBill={printingBill}
                                />
                            )}
                        </Grid>
                    ) : (tableMessagesOverview.length > 0 || loadingMessages) ? (
                        <Grid item xs={12} md={6}>
                            {loadingMessages ? (
                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "calc(100vh - 120px)" }}>
                                    <Loader />
                                </Box>
                            ) : (
                                notificationType === "messages" ? (
                                    <TableMessages
                                        messages={tableMessagesOverview}
                                        onClose={handleMessagesClose}
                                    />
                                ) : (
                                    <CustomerRequests
                                        requests={tableMessagesOverview}
                                        onConfirm={handleConfirmRequest}
                                        onClose={handleMessagesClose}
                                    />
                                )
                            )}
                        </Grid>
                    ) : null}
                </Grid>
                {/* )} */}
            </Box>
        </Box>
    );
};

export default Tables;