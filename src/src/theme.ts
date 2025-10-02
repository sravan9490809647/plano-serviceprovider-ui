import { createTheme } from "@mui/material/styles";
import { BUTTON_COLORS, COLORS, FONT_FAMILY } from "./Constants";

// Extend PaletteOptions to include tertiary color
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY,
    },
    secondary: {
      main: COLORS.SECONDARY,
    },
    tertiary: {
      main: COLORS.TERTIARY,
    },
  },
  typography: {
    fontFamily: "GolosText",
    h1: {
      fontSize: "2.5rem",
      fontFamily: FONT_FAMILY.BOLD,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      fontFamily: FONT_FAMILY.BOLD,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      fontFamily: FONT_FAMILY.BOLD,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      fontFamily: FONT_FAMILY.SEMI_BOLD,
    },
    h5: {
      fontSize: "1rem",
      fontFamily: FONT_FAMILY.MEDIUM,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      fontFamily: FONT_FAMILY.REGULAR,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 500,
      fontFamily: FONT_FAMILY.REGULAR,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 500,
      fontFamily: FONT_FAMILY.REGULAR,
    },
    caption: {
      fontSize: "0.7rem",
      lineHeight: 1.5,
      fontWeight: 400,
      fontFamily: FONT_FAMILY.REGULAR,
    },
    button: {
      textTransform: "none",
      fontFamily: FONT_FAMILY.BOLD,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "8px 16px",
          fontFamily: FONT_FAMILY.BOLD,
          fontWeight: 600,
          "&.Mui-disabled": {
            backgroundColor: BUTTON_COLORS.DISABLED.background,
            color: BUTTON_COLORS.DISABLED.text,
          },
        },
        contained: {
          backgroundColor: BUTTON_COLORS.PRIMARY.background,
          color: BUTTON_COLORS.PRIMARY.text,
          "&:hover": {
            backgroundColor: BUTTON_COLORS.PRIMARY.hover,
          },
        },
        outlined: {
          backgroundColor: BUTTON_COLORS.SECONDARY.background,
          color: BUTTON_COLORS.SECONDARY.text,
          "&:hover": {
            backgroundColor: BUTTON_COLORS.SECONDARY.hover,
          },
        },
        text: {
          color: BUTTON_COLORS.TERTIARY.text,
          border: `1px solid ${BUTTON_COLORS.TERTIARY.text}`,
          backgroundColor: BUTTON_COLORS.TERTIARY.background,
          "&:hover": {
            backgroundColor: BUTTON_COLORS.TERTIARY.hover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Rounded corners for cards
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Custom shadow
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5", // Background color for tabs
        },
        indicator: {
          backgroundColor: "#1976d2", // Primary color for the active tab indicator
        },
      },
    },
  },
});

export default theme;
