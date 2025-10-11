import { CURRENCY } from "../Constants";

export const formatPrice = (price: number | string): string => {
    // Format with 2 decimal places and proper spacing
    return `${CURRENCY.symbol}${Number(price).toFixed(2)}`;
};

export const maskEmail = (email: string): string => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const maskedChars = 4;
    const masked = name.length > maskedChars
        ? "*".repeat(maskedChars) + name.substring(maskedChars)
        : name;
    return `${masked}@${domain}`;
};

export const maskPhone = (phone: string): string => {
    if (!phone) return "";
    if (phone.length <= 5) return phone;
    const visibleDigits = 5;
    return "*".repeat(phone.length - visibleDigits) + phone.substring(phone.length - visibleDigits);
};