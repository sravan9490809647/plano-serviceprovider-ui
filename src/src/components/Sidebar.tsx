import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InventoryIcon from "@mui/icons-material/Inventory";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import HistoryIcon from "@mui/icons-material/History";
// import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkIcon from "@mui/icons-material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { APP_NAME, FONT_FAMILY } from "../Constants";
import DialogWrapper from "./DialogWrapper";
import Storage from "../utils/Storage";
import { useAuth } from "../context/AuthContext";
import { Money, ReceiptLong, Settings } from "@mui/icons-material";
// import { LocalOffer, Money } from "@mui/icons-material";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen = false,
  onCloseMobile = () => { },
}) => {
  const theme = useTheme();
  const { logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:767px)");
  const location = useLocation();
  const navigate = useNavigate();
  const businessId = Storage.getItem("businessId");
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  // Get ordered count from Redux
  const { orderedCount } = useSelector((state: RootState) => state.orders);

  const menuItems = [
    // { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Orders", icon: <ShoppingCartIcon />, path: "/orders", count: orderedCount },
    { label: "Tables", icon: <TableRestaurantIcon />, path: "/tables" },
    { label: "Manage Tables", icon: <Settings />, path: "/manage-tables" },
  ];

  const managementItems = [
    { label: "Menus", icon: <MenuBookIcon />, path: "/menus" },
    { label: "Item Availability", icon: <InventoryIcon />, path: "/items" },
    // { label: "History", icon: <HistoryIcon />, path: "/order-history" },
    // { label: "Invoices", icon: <ReceiptIcon />, path: "" },
    { label: "Earnings", icon: <Money />, path: "/earnings" },
    { label: "Orders History", icon: <HistoryIcon />, path: "/orders-history" },

    // { label: "Opening Hours", icon: <AccessTimeIcon />, path: "/openingHours" },
    // {
    //   label: "Contact & Location",
    //   icon: <PhoneIcon />,
    //   path: "/contact-details",
    // },
    // {
    //   label: "Offers",
    //   icon: <LocalOffer />,
    //   path: "/offers",
    // },
    {
      label: "Business Details",
      icon: <BusinessIcon />,
      path: "/business_details",
    },
    {
      label: "Receipts",
      icon: <ReceiptLong />,
      path: "/receipts",
    },
  ];

  const drawerWidth = collapsed && !isMobile ? 80 : 240;

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  const renderListItems = (items: typeof menuItems) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Tooltip
          title={!isMobile && collapsed ? item.label : ""}
          placement="right"
          key={item.label}
        >
          <ListItemButton
            onClick={() => {
              navigate(item.path);
              if (isMobile) onCloseMobile();
            }}
            selected={isActive}
            sx={{
              borderRadius: 2,
              padding: "8px 16px",
              m: 1,
              borderRight: isActive
                ? `3px solid ${theme.palette.primary.main}`
                : "none",
              backgroundColor: isActive
                ? theme.palette.primary.main + "20"
                : "transparent",
              "& .MuiListItemIcon-root": {
                color: isActive ? theme.palette.primary.main : "inherit",
                minWidth: 36,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {(!collapsed || isMobile) && (
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Typography variant="h5">{item.label}</Typography>
                {item.count !== undefined && (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      padding: "4px 8px",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY.SEMI_BOLD }}>{item.count}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </ListItemButton>
        </Tooltip>
      );
    });

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onCloseMobile}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "width 0.3s ease",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: 2,
          height: 80,
          flexShrink: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "#7b2cbf" }}>
            <MenuBookIcon />
          </Avatar>
          {(!collapsed || isMobile) && (
            <Typography variant="h5" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>{APP_NAME}</Typography>
          )}
        </Box>
        {isMobile && (
          <IconButton onClick={onCloseMobile}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      {/* Main scrollable area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>{renderListItems(menuItems)}</List>

        {(!collapsed || isMobile) && (
          <Box px={2} mt={1}>
            <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY.SEMI_BOLD }}>MANAGEMENT</Typography>
          </Box>
        )}
        <List>{renderListItems(managementItems)}</List>
      </Box>

      {/* Bottom fixed actions */}
      <Box sx={{ flexShrink: 0 }}>
        <Divider />
        <List>
          <ListItemButton
            onClick={() => {
              window.open(`/${businessId}`, "_blank");
            }}
            sx={{
              borderRadius: 5,
              padding: "8px 16px",
              m: 1,
              "& .MuiListItemIcon-root": {
                color: "#000",
                minWidth: 36,
              },
            }}
          >
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <Typography variant="h5" sx={{ textDecoration: "underline" }}>
                Customer Site
              </Typography>
            )}
          </ListItemButton>

          {!isMobile && (
            <ListItemButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                borderRadius: 5,
                padding: "8px 16px",
                m: 1,
                "& .MuiListItemIcon-root": {
                  color: "#555",
                  minWidth: 36,
                },
              }}
            >
              <ListItemIcon>
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </ListItemIcon>
              {(!collapsed || isMobile) && (
                <Typography variant="h5">Collapse</Typography>
              )}
            </ListItemButton>
          )}

          <ListItemButton
            onClick={() => setLogoutDialogOpen(true)}
            sx={{
              borderRadius: 5,
              padding: "8px 16px",
              m: 1,
              "& .MuiListItemIcon-root": {
                color: theme.palette.error.main,
                minWidth: 36,
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <Typography variant="h5" color={theme.palette.error.main}>
                Logout
              </Typography>
            )}
          </ListItemButton>
        </List>
      </Box>

      <DialogWrapper
        open={logoutDialogOpen}
        title="Confirm Logout"
        children="Are you sure you want to log out?"
        submitButtonText="Logout"
        onSubmit={() => handleLogout()}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </Drawer>
  );
};

export default Sidebar;
