import { Box, styled, Typography, Tab, Tabs } from "@mui/material";
import { AWS_BUCKET_BASE_URL, COLORS, CURRENCY, FONT_FAMILY } from "../../../Constants";
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MessageIcon from '@mui/icons-material/Message';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import type { BusinessDetails } from "../../../types";

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  backgroundColor: "#f5f5f5",
}));

const BannerImageSection = styled(Box)(({ theme }) => ({
  height: theme.spacing(20), // 160px - smaller for mobile
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  borderRadius: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
  [theme.breakpoints.up('md')]: {
    height: theme.spacing(25),
  },
}));

const RestaurantInfoSection = styled(Box)(() => ({
  backgroundColor: "#ffffff",
  padding: 0, // remove padding from container
}));

const RestaurantName = styled(Typography)(({ theme }) => ({
  color: "#4CAF50",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  textAlign: "left",
  fontSize: "1.2rem", // mobile font size
  padding: theme.spacing(1), // add padding only to restaurant name
  [theme.breakpoints.up('md')]: {
    fontSize: "1.5rem", // larger desktop font size
  },
}));

const NavigationTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 32, // smaller height
  backgroundColor: "#ffffff", // white background
  padding: 0, // remove default padding
  margin: 0, // remove default margin
  "& .MuiTabs-indicator": {
    backgroundColor: "#333",
    height: 2, // thinner indicator
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minHeight: 32, // smaller height
    fontSize: "16px", // mobile font size
    fontWeight: 600,
    color: "#999",
    padding: theme.spacing(0.5, 0.75), // reduced horizontal padding
    margin: 0, // remove any default margins
    "&.Mui-selected": {
      color: "#333",
    },
    [theme.breakpoints.up('md')]: {
      fontSize: "20px", // larger desktop font size
    },
  },
  "& .MuiTabs-flexContainer": {
    gap: 0, // remove gap between tabs
    padding: 0, // remove container padding
    margin: 0, // remove container margin
    transform: "translateX(0) !important", // force reset transform
  },
  "& .MuiTabs-scroller": {
    padding: 0, // remove scroller padding
    margin: 0, // remove scroller margin
    transform: "translateX(0) !important", // force reset transform
  },
  "& .MuiTabs-scrollButtons": {
    display: "none", // hide scroll buttons if they're causing issues
  },
  "& .MuiTabs-scrollableX": {
    padding: 0, // remove scrollable padding
    margin: 0, // remove scrollable margin
    transform: "translateX(0) !important", // force reset transform
  },
}));

const BottomCardSection = styled(Box)(({ theme }) => ({
  // marginTop: theme.spacing(1),
  paddingTop: theme.spacing(1),
  backgroundColor: "#ffffff",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1.5),
  border: "1px solid #e0e0e0",
}));

const TableBillRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1.5), // smaller margin
}));

const TableInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const TableNumber = styled(Typography)(({ theme }) => ({
  fontSize: "1rem", // mobile font size
  fontWeight: 700,
  color: "#333",
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
  fontSize: "1rem", // mobile font size
  fontWeight: 700,
  color: "#333",
  [theme.breakpoints.up('md')]: {
    fontSize: "1.3rem", // larger desktop font size
  },
}));

const ActionButtonsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1.5), // smaller gap
  justifyContent: "center",
}));

const CustomActionButton = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  fontFamily: FONT_FAMILY.BOLD,
  cursor: "pointer",
  minWidth: 70, // smaller width
}));

const ActionIcon = styled(Box)<{ $bgColor: string }>(({ theme, $bgColor }) => ({
  width: 40, // smaller icon container
  height: 40,
  borderRadius: theme.spacing(0.75), // smaller radius
  backgroundColor: $bgColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(0.25), // smaller margin
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // smaller shadow
}));

const ActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem", // mobile font size
  fontWeight: 600,
  color: "#333",
  textAlign: "center",
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
    <MainContainer>
      {/* Banner Image Section */}
      <BannerImageSection
        sx={{
          backgroundImage: `url(${AWS_BUCKET_BASE_URL}${bannerImage})`,
        }}
      />
      <RestaurantInfoSection>
        <RestaurantName variant="h6">
          {businessName}
        </RestaurantName>

        <NavigationTabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </NavigationTabs>
      </RestaurantInfoSection>

      {/* Tab Content Section */}
      {getTabContent() && (
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            backgroundColor: COLORS.WHITE,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              whiteSpace: "pre-line",
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
              <TableNumber>Table {tableNumber}</TableNumber>
            </TableInfo>
            <BillAmount onClick={() => onGetOrderDetails && onGetOrderDetails()}>
              <BillText>
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
                        fontSize: 20, // smaller icon
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
    </MainContainer>
  );
};

export default BannerSection;