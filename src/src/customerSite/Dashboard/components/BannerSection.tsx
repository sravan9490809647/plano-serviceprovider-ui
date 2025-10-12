import { Box, styled, Typography, Tab, Tabs } from "@mui/material";
import { AWS_BUCKET_BASE_URL, COLORS, CURRENCY, FONT_FAMILY, TEXT_COLORS } from "../../../Constants";
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MessageIcon from '@mui/icons-material/Message';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import type { BusinessDetails } from "../../../types";

const BannerImageSection = styled(Box)(({ theme }) => ({
  height: theme.spacing(15), // 120px - even smaller for mobile
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  borderRadius: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
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
    backgroundColor: "#4CAF50",
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
      color: "#4CAF50",
    },
    "&.Mui-selected": {
      color: "#4CAF50",
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
  color: TEXT_COLORS.PRIMARY,
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

const ActionIcon = styled(Box)<{ $bgColor: string }>(({ theme, $bgColor }) => ({
  width: 32, // smaller icon container on mobile
  height: 32,
  borderRadius: theme.spacing(0.6), // smaller radius
  backgroundColor: $bgColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(0.25), // smaller margin
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // smaller shadow
  [theme.breakpoints.up('sm')]: {
    width: 40,
    height: 40,
    borderRadius: theme.spacing(0.75),
  },
}));

const ActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.625rem", // smaller mobile font size
  fontWeight: 600,
  color: "#333",
  textAlign: "center",
  lineHeight: 1.2,
  [theme.breakpoints.up('sm')]: {
    fontSize: "0.7rem",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: "0.9rem", // larger desktop font size
  },
}));

// Action button configuration
interface ActionButtonConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
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

  // Default action buttons if none provided
  const defaultActionButtons: ActionButtonConfig[] = [
    {
      id: "waiter",
      label: "Request Waiter",
      icon: PersonIcon,
      bgColor: "#e8f5e8",
    },
    {
      id: "checkout",
      label: "Request Checkout",
      icon: CreditCardIcon,
      bgColor: "#fff3cd",
    },
    {
      id: "message",
      label: "Send Message",
      icon: MessageIcon,
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
            }}
          >
            {getTabContent()}
          </Typography>
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
                  <ActionIcon $bgColor={button.bgColor}>
                    <button.icon
                      sx={{
                        color: "#333",
                        fontSize: { xs: 16, sm: 18, md: 20 }, // responsive icon size
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