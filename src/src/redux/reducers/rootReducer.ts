import { combineReducers } from "redux";
import MenusReducer from "./MenusReducer";
import CategoryReducer from "./CategoryReducer";
import BusinessReducer from "./BusinessReducer";
import TablesReducer from "./TablesReducer";
import OrdersReducer from "./OrdersReducer";
import OrdersHistoryReducer from "./OrdersHistoryReducer";
import ReceiptsReducer from "./ReceiptsReducer";

const rootReducer = combineReducers({
  menus: MenusReducer,
  categories: CategoryReducer,
  business: BusinessReducer,
  tables: TablesReducer,
  orders: OrdersReducer,
  ordersHistory: OrdersHistoryReducer,
  receipts: ReceiptsReducer,
});

export default rootReducer;
