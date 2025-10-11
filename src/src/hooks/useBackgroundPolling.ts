import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setOrderedCount } from '../redux/reducers/OrdersReducer';
import ApiService from '../services/ApiService';
import { ENDPOINTS, POLLING_INTERVALS } from '../Constants';
import Storage from '../utils/Storage';

export const useBackgroundPolling = (enabled: boolean) => {
    const dispatch = useDispatch();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const pollData = async () => {
            const businessId = Storage.getItem("businessId");
            if (!businessId) return;

            try {
                // Poll only ordered orders count
                const response = await ApiService.request(
                    'GET',
                    `${ENDPOINTS.ORDERS.GET_ORDERED_ORDERS_COUNT}${businessId}`
                );
                // Update ordered count if successful
                if (response && response.count) {
                    dispatch(setOrderedCount(response.count));
                }
            } catch (error) {
                console.error('Background polling error:', error);
            }
        };

        // Poll immediately
        pollData();

        // Set up interval
        intervalRef.current = window.setInterval(pollData, POLLING_INTERVALS.ORDERS);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, dispatch]);
}; 