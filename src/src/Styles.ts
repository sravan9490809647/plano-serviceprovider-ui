import { Box, styled, Switch } from "@mui/material";

export const CustomSwitch = styled(Switch)(() => ({
  width: 52,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active .MuiSwitch-thumb": {
    width: 24,
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(24px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2e2e2e",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: "#9ca3af",
    opacity: 1,
  },
}));

export const elipsesText = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export const StickyBox = styled(Box)({
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#fff", // or theme.palette.background.paper
  borderBottom: "1px solid #e5e7eb",
  minHeight: 80,
  display: "flex", // ✅ required
  // justifyContent: "center", // ✅ now works
  alignItems: "center", // ✅ now works
  padding: 16, // or use theme.spacing(2) in a function
});
