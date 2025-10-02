import { CURRENCY } from "../Constants";

export const formatPrice = (price: number | string): string => {
    // Format with 2 decimal places and proper spacing
    return `${CURRENCY.symbol}${Number(price).toFixed(2)}`;
};