import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import { MenuBook } from "@mui/icons-material";
import { themeColors } from "../utils/colors";
import { APP_NAME, FONT_FAMILY } from "../Constants";

const WithSidebar: React.FC<{
  component: React.ComponentType<object>;
  showSidebar?: boolean;
}> = ({ component: Component, showSidebar = true }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {showSidebar && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: themeColors.primary,
          height: "100%",
          overflowY: "auto",
          ml: showSidebar ? (isMobile ? 0 : collapsed ? "80px" : "260px") : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        {showSidebar && isMobile && (
          <AppBar
            position="sticky"
            sx={{ bgcolor: themeColors.primary, borderBottom: "1px solid #ddd" }}
          >
            <Toolbar>
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Box display="flex" alignItems="center" gap={1} sx={{ ml: 2 }}>
                <Avatar sx={{ bgcolor: "#7b2cbf", width: 32, height: 32 }}>
                  <MenuBook fontSize="small" />
                </Avatar>
                <Typography variant="h5" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
                  {APP_NAME}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Component />
      </Box>
    </Box>
  );
};

export default WithSidebar;
