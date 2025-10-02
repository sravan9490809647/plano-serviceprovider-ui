import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { silentUpdateOrders } from '../redux/reducers/OrdersReducer';
import { setUnseenMessagesCount, silentUpdateTables } from '../redux/reducers/TablesReducer';
import ApiService from '../services/ApiService';
import { ENDPOINTS, POLLING_INTERVALS } from '../Constants';
import Storage from '../utils/Storage';
import { DATE_TIME_FORMAT_UTC, formatDateAsUTC } from '../utils/dateUtils';

export const useBackgroundPolling = (enabled: boolean) => {
    const dispatch = useDispatch();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const pollData = async () => {
            const businessId = Storage.getItem("businessId");
            if (!businessId) return;

            try {
                // Use UTC date instead of local date
                const todayDate = formatDateAsUTC("", DATE_TIME_FORMAT_UTC);

                // Poll orders and tables in parallel
                const [ordersResponse, tablesResponse, unseenMessagesCountResponse] = await Promise.allSettled([
                    // Use filtered orders API with UTC date
                    ApiService.request(
                        'GET',
                        `${ENDPOINTS.ORDERS.GET_ORDERS_WITH_FILTERS}${businessId}&Start=${todayDate}&End=${todayDate}`
                    ),
                    // GET_TABLES needs ?BusinessId= added manually
                    ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLES}?BusinessId=${businessId}`),
                    ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLE_MESSAGES_UNSEEN_COUNT}${businessId}`)
                ]);

                // Update orders if successful
                if (ordersResponse.status === 'fulfilled' && Array.isArray(ordersResponse.value)) {
                    dispatch(silentUpdateOrders(ordersResponse.value));
                }
                // Update tables if successful
                if (tablesResponse.status === 'fulfilled' && Array.isArray(tablesResponse.value)) {
                    dispatch(silentUpdateTables(tablesResponse.value));
                }
                if (unseenMessagesCountResponse.status === 'fulfilled' && unseenMessagesCountResponse.value) {
                    dispatch(setUnseenMessagesCount(unseenMessagesCountResponse.value?.unseenMessagesCount || 0));
                }
            } catch (error) {
                console.error('Background polling error:', error);
            }
        };

        // Poll immediately
        pollData();

        // Set up interval (5 seconds for testing)
        intervalRef.current = window.setInterval(pollData, POLLING_INTERVALS.ORDERS);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, dispatch]);
}; 