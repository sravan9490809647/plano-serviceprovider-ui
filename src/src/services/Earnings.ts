import ApiService from "./ApiService";
import Storage from "../utils/Storage";
import { ENDPOINTS } from "../Constants";

// Interface for day earnings
export interface DayEarningsData {
    earnings: number;
    totalOrders: number;
    date: string;
}

// Interface for week earnings
export interface WeekEarningsData {
    earnings: number;
    totalOrders: number;
    startDate: string;
    endDate: string;
    dailyData?: Array<{ name: string; earnings: number }>;
}

// Interface for main earnings data
export interface MainEarningsData {
    todaysEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    lifeTimeEarnings: number;
}

// Helper function to format date for API
const formatDateForAPI = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

// Function to fetch main earnings
export const fetchMainEarnings = async (): Promise<MainEarningsData> => {
    try {
        const businessId = Storage.getItem("businessId");
        if (!businessId) {
            throw new Error('Business ID not found');
        }

        const response = await ApiService.request(
            'GET',
            `${ENDPOINTS.EARNINGS.GET_EARNINGS}${businessId}`
        );

        if (response.status === 0) {
            throw new Error(response.message || 'Failed to fetch earnings');
        }
        return response;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch earnings');
    }
};

// Function to fetch day earnings
export const fetchDayEarnings = async (date: Date): Promise<DayEarningsData> => {
    try {
        const businessId = Storage.getItem("businessId");
        if (!businessId) {
            throw new Error('Business ID not found');
        }

        const formattedDate = formatDateForAPI(date);
        const response = await ApiService.request(
            'GET',
            `${ENDPOINTS.EARNINGS.GET_EARNINGS_BY_PERIOD}${businessId}&Start=${encodeURIComponent(formattedDate)}&End=${encodeURIComponent(formattedDate)}`
        );

        if (response.status === 0) {
            throw new Error(response.message || 'Failed to fetch day earnings');
        }

        return response;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch day earnings');
    }
};

// Function to fetch week earnings
export const fetchWeekEarnings = async (startDate: Date, endDate: Date): Promise<WeekEarningsData> => {
    try {
        const businessId = Storage.getItem("businessId");
        if (!businessId) {
            throw new Error('Business ID not found');
        }

        const formattedStartDate = formatDateForAPI(startDate);
        const formattedEndDate = formatDateForAPI(endDate);
        const response = await ApiService.request(
            'GET',
            `${ENDPOINTS.EARNINGS.GET_EARNINGS_BY_PERIOD}${businessId}&Start=${encodeURIComponent(formattedStartDate)}&End=${encodeURIComponent(formattedEndDate)}`
        );

        if (response.status === 0) {
            throw new Error(response.message || 'Failed to fetch week earnings');
        }

        return response;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch week earnings');
    }
};
