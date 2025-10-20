import { Box, styled, Typography, Tab, Tabs, Button } from "@mui/material";
import { AWS_BUCKET_BASE_URL, COLORS, CURRENCY, FONT_FAMILY, TEXT_COLORS } from "../../../Constants";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import type { BusinessDetails } from "../../../types";
import waiterIcon from "./../../../../assets/images/waiter_icon.png";
import checkoutIcon from "../../../../assets/images/checkout_icon.png";
import messageIcon from "../../../../assets/images/message_icon.png";
const BannerImageSection = styled(Box)(({ theme }) => ({
  height: theme.spacing(15), // 120px - even smaller for mobile
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  borderRadius: `${theme.spacing(1)}`,
  [theme.breakpoints.up('sm')]: {
    height: theme.spacing(20),
  },
  [theme.breakpoints.up('md')]: {
    height: theme.spacing(25),
  },
}));

const TabsWrapper = styled(Box)(() => ({
  width: "100%",
  maxWidth: "100vw",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  position: "relative",
  marginBottom: "10px",
}));

const NavigationTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 40,
  backgroundColor: "#ffffff",
  // borderBottom: "1px solid #e0e0e0",
  padding: 0,
  margin: 0,
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  "& .MuiTabs-indicator": {
    backgroundColor: COLORS.BLACK,
    height: 2,
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minHeight: 40,
    fontSize: "14px",
    fontWeight: 500,
    color: "#666",
    padding: theme.spacing(1, 1.5),
    margin: 0,
    minWidth: "auto",
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: COLORS.BLACK,
    },
    "&.Mui-selected": {
      color: COLORS.BLACK,
      fontWeight: 600,
    },
    "&:focus": {
      outline: "none",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "transparent",
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: "15px",
      minHeight: 44,
      padding: theme.spacing(1, 2),
    },
    [theme.breakpoints.up('md')]: {
      fontSize: "16px",
      minHeight: 48,
      padding: theme.spacing(1, 2.5),
    },
  },
  "& .MuiTabs-flexContainer": {
    gap: theme.spacing(0.5),
    display: "flex",
    flexWrap: "nowrap",
  },
  "& .MuiTabs-scroller": {
    overflowY: "hidden !important",
    overflowX: "auto !important",
    scrollbarWidth: "none",
    display: "flex",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  "& .MuiTabs-scrollButtons": {
    width: "40px",
    flex: "0 0 auto",
    color: "#666",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      opacity: 0.3,
    },
    [theme.breakpoints.down('sm')]: {
      width: "32px",
    },
  },
}));

const BottomCardSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(1.5, 2),
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2, 2.5),
  },
}));

const TableBillRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(0.75), // even smaller margin on mobile
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
}));

const TableInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const TableNumber = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem", // smaller mobile font size
  fontWeight: 700,
  color: TEXT_COLORS.BLACK,
  [theme.breakpoints.up('sm')]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: "1.3rem", // larger desktop font size
  },
}));

const BillAmount = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.25), // smaller gap
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
}));

const BillText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem", // smaller mobile font size
  fontWeight: 700,
  color: TEXT_COLORS.PRIMARY,
  [theme.breakpoints.up('sm')]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: "1.3rem", // larger desktop font size
  },
}));

const ActionButtonsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(0.75), // even smaller gap on mobile
  justifyContent: "center",
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1.5),
  },
}));

const CustomActionButton = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(0.5), // smaller padding on mobile
  fontFamily: FONT_FAMILY.BOLD,
  cursor: "pointer",
  minWidth: 60, // smaller width on mobile
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
    minWidth: 70,
  },
}));

const ActionIcon = styled(Box, {
})(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: theme.spacing(0.5), // smaller radius
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "10px", // smaller margin
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
}));

const ActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem", // smaller mobile font size
  fontWeight: 700,
  color: "#333",
  textAlign: "center",
  lineHeight: 1.2,
  [theme.breakpoints.up('sm')]: {
    fontSize: "1rem",
  }
}));

// Action button configuration
interface ActionButtonConfig {
  id: string;
  label: string;
  icon: string;
  bgColor: string;
  onClick?: () => void;
}

interface IBannerSection {
  bannerImage?: string;
  businessName?: string;
  tableNumber?: string;
  businessDetails?: BusinessDetails;
  actionButtons?: ActionButtonConfig[];
  onActionClick?: (actionId: string) => void;
  waiterLoading?: boolean;
  checkoutLoading?: boolean;
  sessionTableAmount?: number;
  onGetOrderDetails?: () => void;
}

const BannerSection: React.FC<IBannerSection> = ({
  bannerImage,
  businessName = "",
  tableNumber = "",
  businessDetails = null,
  onActionClick,
  waiterLoading = false,
  checkoutLoading = false,
  sessionTableAmount = 0,
  onGetOrderDetails
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Default action buttons if none provided
  const defaultActionButtons: ActionButtonConfig[] = [
    {
      id: "waiter",
      label: "Request Waiter",
      icon: waiterIcon,
      bgColor: "#e8f5e8",
    },
    {
      id: "checkout",
      label: "Request Checkout",
      icon: checkoutIcon,
      bgColor: "#fff3cd",
    },
    {
      id: "message",
      label: "Send Message",
      icon: messageIcon,
      bgColor: "#e1d5f7",
    },
  ];

  const buttonsToRender = defaultActionButtons;
  const tabs = ["Process", "About", "Amenities", "Parking", "Timings"];

  const handleButtonClick = (actionId: string) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setIsExpanded(false); // Reset expansion when switching tabs
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper function to check if text needs truncation
  const needsTruncation = (text: string): boolean => {
    if (!text) return false;

    // Check if text has more than 3 lines
    const lines = text.split('\n');
    if (lines.length > 3) return true;

    // For single-line text, check if it's long enough to wrap to more than 3 lines
    // This is a rough estimate - in practice, CSS will handle the actual line wrapping
    const estimatedCharsPerLine = 60;
    const maxChars = 3 * estimatedCharsPerLine;

    return text.length > maxChars;
  };

  // Helper function to parse and format amenities
  const getAmenities = (): string => {
    if (!businessDetails?.amenities) return "";
    try {
      const amenitiesData = JSON.parse(businessDetails.amenities);
      const selected = amenitiesData.selected || [];
      const custom = amenitiesData.custom || [];
      const allAmenities = [...selected, ...custom];
      return allAmenities.join(", ");
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return "";
    }
  };

  // Helper function to format time (remove seconds if present)
  const formatTime = (time: string): string => {
    if (!time) return "";
    // If time has seconds (HH:MM:SS), remove them
    if (time.length === 8 && time.split(':').length === 3) {
      return time.substring(0, 5); // Returns HH:MM
    }
    return time;
  };

  // Helper function to format business hours
  const getBusinessHours = (): string => {
    if (!businessDetails?.businessHours || businessDetails.businessHours.length === 0) return "";
    return businessDetails.businessHours
      .map((hour) => {
        if (hour.isClosed) {
          return `${hour.day}: Closed`;
        }
        // Check if it's 24 hours (00:00 to 23:59 or similar)
        const is24Hours =
          (hour.openingTime === "00:00" && hour.closingTime === "23:59") ||
          (hour.openingTime === "00:00:00" && hour.closingTime === "23:59:59") ||
          (hour.openingTime === "00:00" && hour.closingTime === "00:00") ||
          (hour.openingTime === "00:00:00" && hour.closingTime === "00:00:00") ||
          (hour.openingTime === "Open 24 hours");

        if (is24Hours) {
          return `${hour.day}: Open 24 hours`;
        }

        const formattedOpeningTime = formatTime(hour.openingTime);
        const formattedClosingTime = formatTime(hour.closingTime);

        return `${hour.day}: ${formattedOpeningTime} - ${formattedClosingTime}`;
      })
      .join("\n");
  };

  // Helper function to parse and format parking information
  const getParkingInfo = (): string => {
    if (!businessDetails?.parkingInformation) return "";
    try {
      const parkingData = JSON.parse(businessDetails.parkingInformation);
      const parts: string[] = [];

      if (parkingData.type) {
        parts.push(`${parkingData.type.charAt(0).toUpperCase() + parkingData.type.slice(1)}`);
      }

      if (parkingData.notes && parkingData.notes.trim() !== "") {
        parts.push(`${parkingData.notes}`);
      }
      return parts.length > 0 ? parts.join(" : ") : "Parking information available";
    } catch (error) {
      return "";
    }
  };

  // Get content based on selected tab
  const getTabContent = (): string => {
    switch (selectedTab) {
      case 0: // Process
        return businessDetails?.process || "";
      case 1: // About
        return businessDetails?.description || "";
      case 2: // Amenities
        return getAmenities();
      case 3: // Parking
        return getParkingInfo();
      case 4: // Timings
        return getBusinessHours();
      default:
        return "";
    }
  };

  return (
    <Box>
      {/* Banner Image Section */}
      <BannerImageSection
        sx={{
          backgroundImage: `url(${AWS_BUCKET_BASE_URL}${bannerImage})`,
        }}
      />
      <Typography
        variant="h3"
        sx={{
          color: TEXT_COLORS.PRIMARY,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          fontWeight: 700,
          padding: { xs: theme => theme.spacing(1.5, 2), sm: theme => theme.spacing(2, 2.5) },
          marginTop: 2,
        }}
      >
        {businessName}
      </Typography>

      <TabsWrapper>
        <NavigationTabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        // allowScrollButtonsMobile
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </NavigationTabs>
      </TabsWrapper>

      {/* Tab Content Section */}
      {getTabContent() && (
        <Box
          sx={{
            p: 1,
            backgroundColor: COLORS.WHITE,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              color: "#555",
              // CSS-based line clamping
              display: isExpanded ? 'block' : '-webkit-box',
              WebkitLineClamp: isExpanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: isExpanded ? 'visible' : 'hidden',
            }}
          >
            {getTabContent()}
          </Typography>
          {(() => {
            const content = getTabContent();
            return needsTruncation(content) && (
              <Button
                onClick={toggleExpansion}
                sx={{
                  mt: 1,
                  p: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  color: '#666',
                  fontSize: '0.875rem',
                  border: 'none !important',
                  boxShadow: 'none !important',
                  outline: 'none !important',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#333',
                    border: 'none !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                  },
                  '&:focus': {
                    border: 'none !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                  },
                  '&:active': {
                    border: 'none !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                  },
                  '&.Mui-focusVisible': {
                    border: 'none !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                  },
                }}
                endIcon={isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
              >
                {isExpanded ? 'Show less' : 'More'}
              </Button>
            );
          })()}
        </Box>
      )}

      {/* Bottom Card Section with Table Info and Actions */}
      {tableNumber && (
        <BottomCardSection>
          <TableBillRow>
            <TableInfo>
              <TableNumber variant="h5">Table {tableNumber}</TableNumber>
            </TableInfo>
            <BillAmount onClick={() => onGetOrderDetails && onGetOrderDetails()}>
              <BillText variant="h5">
                {CURRENCY.symbol}{sessionTableAmount.toFixed(2)}
              </BillText>
              <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#333" }} />
            </BillAmount>
          </TableBillRow>

          <ActionButtonsRow>
            {buttonsToRender.map((button) => {
              const isLoading = (button.id === "waiter" && waiterLoading) ||
                (button.id === "checkout" && checkoutLoading);
              return (
                <CustomActionButton
                  key={button.id}
                  onClick={() => !isLoading && handleButtonClick(button.id)}
                >
                  <ActionIcon>
                    <img
                      src={button.icon}
                      alt={button.label}
                      style={{
                        width: 30,
                        height: 30,
                        objectFit: "contain",
                        opacity: isLoading ? 0.5 : 1
                      }}
                    />
                  </ActionIcon>
                  <ActionLabel>
                    {button.label}
                  </ActionLabel>
                </CustomActionButton>
              );
            })}
          </ActionButtonsRow>
        </BottomCardSection>
      )}
    </Box>
  );
};

export default BannerSection;