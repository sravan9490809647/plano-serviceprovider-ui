import { CURRENCY, CUSTOMER_SITE_URL } from "../Constants";

export const generateCustomerSiteUrl = (businessId: string, tableId: string): string => {
    if (!businessId || !tableId) {
        return '#';
    }
    return `${CUSTOMER_SITE_URL}/${businessId}/?tableId=${tableId}`;
};
export const formatPrice = (price: number | string): string => {
    // Format with 2 decimal places and proper spacing
    return `${CURRENCY.symbol}${Number(price).toFixed(2)}`;
};