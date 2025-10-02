import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import BusinessSetupRoute from "./BusinessSetupRoute";

import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import NotFound from "../pages/NotFound";
import RedirectHome from "./RedirectHome";
import SignupSteps from "../pages/Auth/Signup/SignupSteps";
import WithSidebar from "../components/WithSidebar";

import Menus from "../pages/Menus/Menus";
import Orders from "../pages/Orders/Orders";
import OrdersHistory from "../pages/OrdersHistory/OrdersHistory";
import ItemsAvailability from "../pages/Items/ItemsAvailability";
import Tables from "../pages/Tables/Tables";
import ManageTables from "../pages/Tables/ManageTables";
// import OrderHistory from "../pages/OrderHistory/OrderHistory";
// import OpeningHours from "../pages/OpeningHours/OpeningHours";
// import ContactDetails from "../pages/ContactDetails/ContactDetails";
import AddMenuItem from "../pages/Menus/AddMenuItem";
import MenuUpload from "../pages/Menus/MenuUpload";
import BusinessSetupForm from "../pages/BusinessSetup/BusinessDetails";
import BusinessDetailsView from "../pages/BusinessSetup/BusinessDetailsView";
import Earnings from "../pages/Earnings/Earnings";
import Receipts from "../pages/Receipts/Receipts";
import Dashboard from "../customerSite/Dashboard/Dashboard";
import CheckoutPage from "../customerSite/Dashboard/CheckoutPage";
// import OffersPage from "../pages/Offers/Offers";
// import OffersCreateContainer from "../pages/Offers/OffersCreateContainer";
// import ReceiptPrinter from "../pages/ReceiptPrinter";
const protectedRoutes = [
  // {
  //   path: "/dashboard",
  //   component: Dashboard,
  // },
  {
    path: "/business_details",
    component: BusinessDetailsView,
  },
  {
    path: "/menus",
    component: Menus,
  },
  {
    path: "/menus/add",
    component: AddMenuItem,
  },
  {
    path: "/menus/edit/:itemId",
    component: AddMenuItem,
  },
  {
    path: "/menus/uploadmenu",
    component: MenuUpload,
  },
  {
    path: "/items",
    component: ItemsAvailability,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/orders-history",
    component: OrdersHistory,
  },
  {
    path: "/tables",
    component: Tables,
  },
  {
    path: "/manage-tables",
    component: ManageTables,
  },
  {
    path: "/earnings",
    component: Earnings,
  },
  {
    path: "/receipts",
    component: Receipts,
  },
  // {
  //   path: "/receipt-printer",
  //   component: ReceiptPrinter,
  // },
  // {
  //   path: "/order-history",
  //   component: OrderHistory,
  // },
  // {
  //   path: "/offers",
  //   component: OffersPage,
  // },
  // {
  //   path: "/offers/create",
  //   component: OffersCreateContainer,
  // },
  // {
  //   path: "/openingHours",
  //   component: OpeningHours,
  // },
  // {
  //   path: "/contact-details",
  //   component: ContactDetails,
  // },
];

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectHome />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupSteps />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/ResetPassword/:id"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path={"/:businessId"} element={<Dashboard />} />
          <Route path={"/:businessId/checkout"} element={<CheckoutPage />} />
          {/* Business Setup Route → no sidebar */}
          <Route
            path="/business_setup"
            element={
              <BusinessSetupRoute>
                <WithSidebar
                  component={BusinessSetupForm}
                  showSidebar={false}
                />
              </BusinessSetupRoute>
            }
          />

          {/* All other protected routes */}
          {protectedRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <WithSidebar component={Component} showSidebar={true} />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
