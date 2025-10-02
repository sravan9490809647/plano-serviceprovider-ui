import { ORDER_STATUS } from "../Constants"

export const themeColors = {
    primary: '#ffffff',
    black: '#000000',
    white: '#ffffff',
    grey: '#808080',
    lightGrey: '#d3d3d3',
    darkGrey: '#808080',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    accept: "#16a34a",
    decline: "#dc2626",
    preparing: "#fef2f2",
    preparingHover: "#fee2e2",
}

export const statusColors = {
    [ORDER_STATUS.ORDERED]: {
        label: "Ordered",
        color: "#3b82f6",
    },
    [ORDER_STATUS.PREPARING]: {
        label: "Preparing",
        color: "#f97316",
    },
    [ORDER_STATUS.COMPLETED]: {
        label: "Completed",
        color: "#22c55e",
    },
    [ORDER_STATUS.CANCELLED]: {
        label: "Cancelled",
        color: "#EF4444"
    },
    [ORDER_STATUS.DECLINED]: {
        label: "Declined",
        color: "#EF4444"
    },
}