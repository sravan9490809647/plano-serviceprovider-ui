import type { OfferDefinition } from "./types";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const BASE_APPLICATION_URL = import.meta.env.VITE_BASE_APPLICATION_URL;
export const AWS_CREDENTIALS = {
  bucket: import.meta.env.VITE_AWS_BUCKET,
};
export const APP_NAME = "Plano";
export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
export const DEFAULT_TIME_FORMAT = "hh:mm A";
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

export const AWS_BUCKET_BASE_URL = `https://${AWS_CREDENTIALS.bucket}.s3.amazonaws.com/`;
export const DEFAULT_IMAGE =
  "https://dummyimage.com/300x180/eeeeee/aaa&text=No+Image+Available";

export const CURRENCY = {
  symbol: "£",
};

export const ORDER_STATUS = {
  ALL: "All",
  ORDERED: "Ordered",
  NEW_ORDERS: "New Orders",
  PREPARING: "Preparing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DECLINED: "Declined",
} as const;

export const ORDER_STATUS_CHIPS = [{ label: "All", value: ORDER_STATUS.ALL }, { label: ORDER_STATUS.NEW_ORDERS, value: ORDER_STATUS.ORDERED }, { label: "Preparing", value: ORDER_STATUS.PREPARING }, { label: "Completed", value: ORDER_STATUS.COMPLETED }, { label: ORDER_STATUS.DECLINED, value: ORDER_STATUS.DECLINED }];

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "ServiceProvider/Auth/Login",
    SIGNUP: "ServiceProvider/Auth/Register",
    FORGOT_PASSWORD: "ServiceProvider/Auth/ForgotPassword",
    RESET_PASSWORD: "ServiceProvider/Auth/ResetPassword",
  },
  MENUS: {
    BY_BUSINESS_ID: "Category/GetCategoryAndItems?BusinessId=",
    ADD_ITEM: "Items/Add",
    EDIT_ITEM: "Items/Edit",
    STOCK_AVAILABILITY_UPDATE: "Items/ItemStock",
    DELETE_ITEM: "Items/Delete?ItemId=",
    ALL_ITEMS: "Items/AllItems?BusinessId=",
    ITEM_BY_ID: "Items/GetItemById?Id=",
    SWAP_ITEM_ORDER: "Items/SwapItemOrder",
    MENU_UPLOAD: "MenuParser/upload-sequence?BusinessId=",
  },
  CATEGORIES: {
    BY_BUSINESS_ID: "Category/Get?BusinessId=",
    ADD_CATEGORY: "Category/Add",
    EDIT_CATEGORY: "Category/Edit",
    DELETE_CATEGORY: "Category/Delete?Id=",
    ALL_CATEGORIES: "Category/Get?BusinessId=",
    SWAP_CATEGORY_ORDER: "Category/SwapCategoryOrder",
  },
  BUSINESS: {
    SAVE_BUSINESS: "BusinessInfo/AddEditBusinessInfo",
    GET_BUSINESS: "BusinessInfo/BusinessInfo?BusinessId=",
  },
  TABLES: {
    ADD_TABLES: "Tables/AddTables",
    GET_TABLES: "Tables/GetTables",
    RESERVED_TABLE_ORDERS: "Tables/ReservedTableOrders?RTId=",
    TERMINATE_RESERVE_TABLE_SESSION: "Tables/TerminateReserveTableSession?RTId=",
    GET_TABLE_MESSAGES_OVERVIEW: "Tables/GetTableMessagesOverview?BusinessId=",
    GET_TABLE_MESSAGES_UNSEEN_COUNT: "Tables/TotalUnseenMessagesCount?BusinessId=",
    GET_TABLE_MESSAGES: "Tables/GetTableMessages?TableId=",
    DISABLE_WAITER_REQUEST: "Tables/DisableWaiterRequest?TableId=",
    DISABLE_CHECKOUT_REQUEST: "Tables/DisableCheckoutRequest?TableId=",
    GET_WAITER_REQUESTS: "Tables/GetWaiterRequests?BusinessId=",
    GET_CHECKOUT_REQUESTS: "Tables/GetCheckOutRequests?BusinessId=",
    GET_TABLE_DETAILS: "Tables/TableDetailsByTableId?TableId=",
    WAITER_REQUEST: "Vicinity/WaiterRequest",
    CHECKOUT_REQUEST: "Vicinity/CheckOutRequest",
    SEND_MESSAGE: "Vicinity/SendMessage",
  },
  ORDERS: {
    GET_ORDERS: "Orders/GetOrders?BusinessId=",
    GET_ORDERS_WITH_FILTERS: "Orders/OredersWithFilters?BusinessId=",
    GET_ORDERED_ORDERS_COUNT: "Orders/GetOrderedOrdersCount?BusinessId=",
    GET_ORDER_DETAIL_BY_ID: "Orders/OrderDetailByOrderId?OrderId=",
    SET_ORDER_STATUS_TO_COMPLETE: "Orders/SetOrderStatusToComplete?OrderId=",
    SET_ORDER_STATUS_TO_PREPARING: "Orders/SetOrderStatusToPreparing?OrderId=",
    SET_ORDER_STATUS_TO_DECLINE: "Orders/DeclineOrder?OrderId=",
    CREATE_ORDER: "user/OrderBooking/Add",
  },
  EARNINGS: {
    GET_EARNINGS: "Earnings/GetEarnings?BusinessId=",
    GET_EARNINGS_BY_PERIOD: "Earnings/GetEarningsByPeriod?BusinessId=",
  },
  UPLOAD_IMAGE: "S3/Upload",
  OFFERS: {
    BUYONE_GETONE_OFFER: "Offers/AddBuy1GetFreeItemOffer",
    PERCENTAGE_WHOLE_ORDER: "Offers/AddPercentageDiscountWholeOrderOffer",
    PERCENTAGE_DISCOUNT_SELECTED_ITEMS:
      "Offers/AddPercentageDiscountSelectedItems",
    AMOUNT_DISCOUNT_SELECTED_ITEMS: "Offers/AddFixedDiscountSelectedItems",
    FIXED_AMOUNT_DISCOUNT_WHOLE_ORDER:
      "Offers/AddFixedAmountDiscountWholeOrder",
    FIXED_AMOUNT_DISCOUNT_SELECTED_ITEMS: "Offers/AddFreeItemWithPurchaseOffer",
  },
  RECEIPTS: {
    ALL: "Receipts/All?BusinessId=",
    WITH_DATE_FILTERS: "Receipts/WithDateFilters?BusinessId=",
  },
};
export const COLORS = {
  PRIMARY: "#1976d2",
  SECONDARY: "#FFFFFF",
  TERTIARY: "#000000",
  ERROR: "#DC2626",
  BLACK: "#000000",
  SEARCH_BOX_BG: "#B8F3EE",
};

export const TEXT_COLORS = {
  PRIMARY: "#16ae9f",
};

export const BUTTON_COLORS = {
  PRIMARY: {
    background: "#000000",
    text: "#FFFFFF",
    hover: "#000000",
  },
  SECONDARY: {
    background: "#000000",
    text: "#111827",
    hover: "#FBBF24",
  },
  TERTIARY: {
    background: "#FFFFFF",
    text: "#000",
    hover: "#FFFFFF",
  },
  DANGER: {
    background: COLORS.ERROR,
    text: "#FFFFFF",
    hover: "#B91C1C",
  },
  DISABLED: {
    background: "#e0e0e0",
    text: "#9e9e9e",
    hover: "#e0e0e0",
  },
};

export const FONT_FAMILY = {
  BOLD: "SpaceGroteskBold",
  REGULAR: "SpaceGroteskRegular",
  MEDIUM: "SpaceGroteskMedium",
  SEMI_BOLD: "SpaceGroteskSemiBold",
  LIGHT: "SpaceGroteskLight",
};

export const FONT_SIZE = {
  SMALL: "12px",
  MEDIUM: "14px",
  LARGE: "16px",
  XLARGE: "18px",
  XXLARGE: "20px",
  XXXLARGE: "22px",
  XXXXLARGE: "24px",
};

export const Offers: OfferDefinition[] = [
  {
    id: "buy1free1",
    icon: "☕",
    bgColor: "linear-gradient(45deg, #FF6B00, #FF9A3C)",
    title: "Buy 1, Get a Free Item",
    description:
      "Customer purchases a qualifying item and receives a specific free item",
  },
  {
    id: "percent_whole",
    icon: "✅",
    bgColor: "linear-gradient(45deg, #00C49F, #2ECC71)",
    title: "Percentage Discount - Whole Order",
    description: "Apply percentage discount to the entire order total",
  },
  {
    id: "percent_selected",
    icon: "🏷️",
    bgColor: "linear-gradient(45deg, #7B61FF, #5A39D1)",
    title: "Percentage Discount - Selected Items",
    description: "Apply percentage discount to specific items and categories",
  },
  {
    id: "fixed_whole",
    icon: "£",
    bgColor: "linear-gradient(45deg, #8E2DE2, #4A00E0)",
    title: "Fixed Amount Discount - Whole Order",
    description: "Apply fixed pound amount discount to the entire order",
  },
  {
    id: "fixed_selected",
    icon: "🎯",
    bgColor: "linear-gradient(45deg, #FF6B6B, #FF3C3C)",
    title: "Fixed Amount Discount - Selected Items",
    description:
      "Apply fixed pound amount discount to specific items and categories",
  },
  {
    id: "free_with_purchase",
    icon: "🍽️",
    bgColor: "linear-gradient(45deg, #FF4B91, #FF7BAC)",
    title: "Free Item with Purchase",
    description:
      "Customer receives a free item when they spend a minimum amount",
  },
];

export const PredefinedAmenities = [
  "Outdoor Seating",
  "Halal",
  "Pet-Friendly",
  "Free Wi-Fi",
  "Vegan Options",
  "Drive-thru",
  "Wheelchair Accessible",
  "Toilets",
];

// Background Service Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  ORDERS: 10000,    // 10 seconds
} as const;

// Table Status Colors
export const TABLE_STATUS_COLORS = {
  AVAILABLE: "#ffffff",    // Green for Available
  OCCUPIED: "#4ac4ba",     // Gray for Occupied
  WAITER: "#ef4444",       // Red for Waiter Request
  CHECKOUT: "#000000",     // Black for Check Out
} as const;

// Table Status Labels
export const TABLE_STATUS_LABELS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  WAITER: "Waiter",
  CHECKOUT: "Checkout",
} as const;

// Table Status Types
export const TABLE_STATUSES = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  WAITER: "waiter",
  CHECKOUT: "checkout",
} as const;


export const ORDER_STATUS_COLORS = {
  ORDERED: "#D97706",
  COMPLETED: "#059669",
} as const;

export const ORDER_STATUS_LABELS = {
  ORDERED: "ordered",
  COMPLETED: "completed",
} as const;