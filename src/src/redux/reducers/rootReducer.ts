import { combineReducers } from "redux";
import MenusReducer from "./MenusReducer";
import CategoryReducer from "./CategoryReducer";
import BusinessReducer from "./BusinessReducer";
import TablesReducer from "./TablesReducer";
import OrdersReducer from "./OrdersReducer";
import OrdersHistoryReducer from "./OrdersHistoryReducer";
import ReceiptsReducer from "./ReceiptsReducer";
import CartReducer from "./Cart";
import OffersReducer from "./OffersReducer";
import UserCategoryReducer from "./UserCategoryReducer";
import UserMenusReducer from "./UserMenusReducer";
import BusinessDetailsReducer from "./BusinessDetailsReducer";
import TableReducer from "./TableReducer";

const rootReducer = combineReducers({
  menus: MenusReducer,
  categories: CategoryReducer,
  business: BusinessReducer,
  tables: TablesReducer,
  orders: OrdersReducer,
  ordersHistory: OrdersHistoryReducer,
  receipts: ReceiptsReducer,
  cart: CartReducer,
  offers: OffersReducer,
  userCategories: UserCategoryReducer,
  userMenus: UserMenusReducer,
  businessDetails: BusinessDetailsReducer,
  table: TableReducer,
});

export default rootReducer;
