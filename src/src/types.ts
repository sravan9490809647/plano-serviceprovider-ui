export interface MenuCategory {
  id: string;
  sId: string;
  bId: string;
  title: string;
  description: string;
  thumbnailImage: string; // base64 image
  inStock: boolean;
  order: number;
  createdById: string;
  createdOn: string; // ISO date string
  modifiedById: string;
  modifiedOn: string; // ISO date string
  status: boolean;
}

export interface MenuItem {
  id: string;
  sId: string;
  bId: string;
  cId?: string;
  categoryIds: string[]; // changed from cId to support multiple categories
  title: string;
  categories?: { id: string; title: string }[];
  description: string;
  thumbnailImage: string | null; // base64 image or null
  price: number;
  inStock: boolean;
  order: number;
  ingredients: string[];
  itemVariations: {
    title: string;
    price: number;
  }[];
  optionGroups: {
    title: string;
    required: boolean;
    allowMultiple: boolean;
    maxSelections: number;
    options: {
      title: string;
      price: number;
    }[];
  }[];
  createdById: string;
  createdOn: string; // ISO date string
  modifiedById: string;
  modifiedOn: string; // ISO date string
  status: boolean;
}

export interface CategoryWithItems {
  category: MenuCategory;
  items: MenuItem[];
}

export interface OptionGroup {
  name: string;
  title: string; // Added property
  required: boolean;
  multiple: boolean;
  allowMultiple: boolean; // Added property
  maxSelections?: number;
  options: {
    name: string;
    price: string;
  }[];
}
export interface DayHour {
  day: string;
  closed: boolean;
  open: Date | null;
  close: Date | null;
}

export interface PickupInfoState {
  instructions: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BrandAssetsState {
  logo: File | null;
  banner: File | null;
}

export interface BusinessDetails {
  bId: string;
  businessName: string;
  description: string;
  process: string;
  amenities: string;
  parkingInformation: string;
  tablesAndOrderingInformation: string;
  deliveryinformation: string;
  pickupAndBusinessLocationInformation: string;
  googleReviewLink: string;
  paymentInformation: string;
  brandAssets: string;
  businessHours: {
    day: string;
    openingTime: string;
    closingTime: string;
    isClosed: boolean;
  }[];
}
export interface BusinessHour {
  day: string;
  openingTime: string | null;
  closingTime: string | null;
  isClosed: boolean;
}
export type OfferDefinition = {
  id: string;
  icon: string;
  bgColor: string;
  title: string;
  description: string;
};
export type DateRangeSelection = {
  startDate: Date;
  endDate: Date;
  key: string;
};
export type OfferType =
  | "buy1free1"
  | "percent_whole"
  | "percent_selected"
  | "fixed_whole"
  | "fixed_selected"
  | "free_with_purchase";
export interface Offer {
  id: string;
  title: string;
  description?: string;
  validFrom: string; // ISO date string
  validTo: string; // ISO date string
  daysOfWeek?: string; // e.g.,"1,2,3,4,5,6,7"
  qualifyingCategories?: string[]; // Array of category IDs
  qualifyingItems?: string[]; // Array of item IDs
  freeCategories?: string[]; // Array of category IDs for free items
  freeItems?: string[]; // Array of item IDs for free items
  type: string;
  percentage?: number; // For percentage offers
}
export interface CustomerRequest {
  tableId: number;
  requestType: string;
  timestamp: string;
}

export interface Order {
  tableId: number;
  orderDetails: string;
  timestamp: string;
}

export interface OrderItem {
  quantity: number;
  name: string;
  price: number;
  notes?: string;
}

export interface DetailedOrder {
  id: number;
  time: string;
  items: OrderItem[];
  subtotal: number;
}

export interface Table {
  id: string;
  sId: string;
  bId: string;
  tableNumber: number;
  tableName: string;
  capacity: number | null;
  tableType: string | null;
  description: string | null;
  image: string | null;
  isOccupied: boolean;
  note: string | null;
  rtId?: string | null;
  waiterRequest: boolean;
  checkOutRequest: boolean;
  sessionTableAmount: number;
  createdById: string;
  createdOn: string;
  modifiedById: string;
  modifiedOn: string;
  status?: "available" | "occupied" | "waiter" | "checkout";
}

// Reserved Table Orders Types
export interface ReservedTableOrderDetails {
  id: string;
  userId: string;
  bId: string;
  orderCode: string;
  totalPrice: number;
  note: string;
  appliedOffers: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  tId: string;
  tableName: string;
  createdById: string;
  createdOn: string;
  modifiedById: string;
  modifiedOn: string;
  status: boolean;
}

export interface ReservedTableOrderedItem {
  id: string;
  userId: string;
  orderId: string;
  bId: string;
  iId: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  removeIngredients: string;
  itemVariations: any | null;
  optionGroups: string;
  appliedOffers: any | null;
  thumbnailImage: string | null;
  createdById: string;
  createdOn: string;
  modifiedById: string;
  modifiedOn: string;
  status: boolean;
}

export interface ReservedTableOrder {
  orderDetails: ReservedTableOrderDetails;
  orderedItems: ReservedTableOrderedItem[];
}

export type ReservedTableOrdersResponse = ReservedTableOrder[];

// Table Messages Overview Types
export interface TableMessagesOverview {
  orders: number;
  waiter: number;
  checkOut: number;
  messages: number;
}

// Table Messages Types
export interface TableMessage {
  id: string;
  message: string;
  createdOn: string;
  isRead: boolean;
}

export interface TableWithMessages {
  tableId: string;
  tableName: string;
  lastMessage: TableMessage;
  tableUnSeenMessagesCount: number;
}
export interface TableMessages {
  id: string;
  bId: string;
  tId: string;
  message: string;
  isRead: boolean;
  createdOn: string;
  createdById: string;
  modifiedOn: string;
  modifiedById: string;
  status: boolean;
}
// Table Request Types
export interface WaiterRequestItem {
  tableId: string;
  tableName: string;
  waiterRequestId: string;
  description: string;
  requestedTime: string;
  attendedTime: string | null;
  isAttended: boolean;
  createdOn: string;
}

export interface CheckoutRequestItem {
  tableId: string;
  tableName: string;
  checkOutRequestId: string;
  description: string;
  requestedTime: string;
  attendedTime: string | null;
  isAttended: boolean;
  createdOn: string;
}

export type DataItem = WaiterRequestItem | CheckoutRequestItem;
