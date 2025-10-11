import { useEffect, useState } from "react";
import { Box, Typography, Grid, Avatar } from "@mui/material";
import Input from "../../components/Input";
import CustomButton from "../../components/Button";
import Select from "../../components/Select";
import HoursSelection from "../OpeningHours/components/HoursSelection";
import type {
  BrandAssetsState,
  BusinessDetails,
  BusinessHour,
  DayHour,
  PickupInfoState,
} from "../../types";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import PickupInfoSection from "./components/PickupInfo";
import Section from "./components/Section";
import BrandAssetsSection from "./components/BrandAssets";
import BusinessDescriptionSection from "./components/BusinessDescription";
import AmenitiesSection from "./components/Amenities";
import FileUploadBox from "../../components/FileUploadBox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { onFetchBusinessDetails } from "../../redux/reducers/BusinessReducer";
import Storage from "../../utils/Storage";
// import BusinessOptionCard from "./components/BusinessOptionCard";
// import PaymentSetup from "./components/PaymentSetup";
import { uploadImage } from "../../redux/reducers/MenusReducer";
import { maskEmail, maskPhone } from "../../utils/common";
import ApiService from "../../services/ApiService";
import { ENDPOINTS, PredefinedAmenities } from "../../Constants";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import StorageService from "../../../services/StorageService";
// import BusinessLocation from "./components/BusinessLocation";

const defaultHours: DayHour[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({
  day,
  closed: false,
  open: new Date(0, 0, 0, 9, 0),
  close: new Date(0, 0, 0, 22, 0),
}));

const initialState: PickupInfoState = {
  instructions: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
};

const brandState: BrandAssetsState = {
  logo: null,
  banner: null,
};

const parkingOptions = [
  { label: "Street Parking", value: "street" },
  { label: "Garage", value: "garage" },
  { label: "Private Lot", value: "private" },
  { label: "Valet", value: "valet" },
  { label: "No Parking Available", value: "none" },
];

const InfoRow: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Box
      component="span"
      sx={{
        fontSize: 24,
        width: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography color="text.secondary">{text}</Typography>
  </Box>
);

const BusinessSetupForm: React.FC<{
  disableHeading?: boolean;
  showBusinessName?: boolean;
}> = ({
  disableHeading = false,
  showBusinessName = false,
}) => {
    const dispatch: AppDispatch = useDispatch();
    const { login: authLogin } = useAuth(); // inside component

    const { businessDetails } = useSelector(
      (state: {
        business: {
          businessDetails: BusinessDetails | null;
        };
      }) => state.business
    );
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState("");
    const [process, setProcess] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [printerIpAddress, setPrinterIpAddress] = useState("");
    const [googleReviewLink, setGoogleReviewLink] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [customAmenities, setCustomAmenities] = useState<string[]>([]);
    const [customAmenity, setCustomAmenity] = useState("");
    const [parkingType, setParkingType] = useState("");
    const [parkingNotes, setParkingNotes] = useState("");
    const [parkingPhoto, setParkingPhoto] = useState<File | null>(null);
    const [parkingVideo, setParkingVideo] = useState<File | null>(null);
    const [hours, setHours] = useState<DayHour[]>(defaultHours);
    const [address, setAddress] = useState<PickupInfoState>(initialState);
    const [brands, setBrands] = useState<BrandAssetsState>(brandState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const businessId = Storage.getItem("businessId") || "";
    const [tables, setTables] = useState("no");
    const [drivers, setDrivers] = useState("no");
    const [payments, setPayments] = useState<Record<string, boolean>>({
      Cash: true,
      Card: true,
      "Pay Online": true,
      "Google Pay": false,
      "Apple Pay": false,
      "UPI / Wallets": false,
      PayPal: false,
    });
    const [userData, setUserData] = useState({
      fullName: "",
      lastName: "",
      email: "",
      mobile: "",
      businessName: "",
      location: "",
    });
    const [testingConnection, setTestingConnection] = useState(false);

    useEffect(() => {
      dispatch(onFetchBusinessDetails(businessId));
      fetchUserData();
    }, [businessId, dispatch]);

    const fetchUserData = async () => {
      try {
        const response = await ApiService.request(
          "GET",
          `${ENDPOINTS.USER.GET_PROFILE}`
        );
        if (response.status === 1 && response.data) {
          setUserData({
            fullName: response.data.fullName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            mobile: response.data.mobile || "",
            businessName: StorageService.getItem("businessName") || "",
            location: response.data?.location || `${response.data?.city || ""}${response.data?.city && response.data?.country ? ", " : ""}${response.data?.country || ""}`,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    useEffect(() => {
      if (!businessDetails) return;
      // Direct fields
      setBio(businessDetails.description || "");
      setProcess(businessDetails.process || "");
      setBusinessName(businessDetails.businessName || "");
      setPrinterIpAddress(businessDetails.printerIpAddress || "");
      setGoogleReviewLink(businessDetails.googleReviewLink || "");
      if (businessDetails.printerIpAddress) {
        handleSetPrinterConnection(businessDetails.printerIpAddress);
      }
      if (businessDetails.amenities) {
        const parsed = JSON.parse(businessDetails.amenities);

        const predefined =
          parsed.selected?.filter((v: string) =>
            PredefinedAmenities.includes(v)
          ) || [];

        const custom = parsed.custom || [];

        setAmenities(predefined);
        setCustomAmenities(custom);
      }
      // Parking
      if (businessDetails.parkingInformation) {
        const parsed = JSON.parse(businessDetails.parkingInformation);
        setParkingType(parsed.type || "");
        setParkingNotes(parsed.notes || "");
        setParkingPhoto(parsed.photo); // You may display URL as read-only if needed
        setParkingVideo(null);
      }

      // Tables
      if (businessDetails.tablesAndOrderingInformation) {
        const parsed = JSON.parse(businessDetails.tablesAndOrderingInformation);
        setTables(parsed.hasTables ? "yes" : "no");
      }

      // Delivery
      if (businessDetails.deliveryinformation) {
        const parsed = JSON.parse(businessDetails.deliveryinformation);
        setDrivers(parsed.hasDrivers ? "yes" : "no");
      }

      // Pickup Info
      if (businessDetails.pickupAndBusinessLocationInformation) {
        const parsed = JSON.parse(
          businessDetails.pickupAndBusinessLocationInformation
        );
        setAddress((prev) => ({
          ...prev,
          instructions: parsed.instructions || "",
        }));
      }

      // Payment
      if (businessDetails.paymentInformation) {
        const parsed = JSON.parse(businessDetails.paymentInformation);
        setPayments(parsed.methods || {});
      }

      // Brand Assets
      if (businessDetails.brandAssets) {
        const parsed = JSON.parse(businessDetails.brandAssets);
        setBrands({
          logo: parsed.logo ?? null,
          banner: parsed.banner ?? null,
        });
      }

      // Business Hours
      if (Array.isArray(businessDetails.businessHours)) {
        const updatedHours: DayHour[] = businessDetails.businessHours.map(
          (day: BusinessHour) => ({
            day: day.day,
            closed: day.isClosed,
            open: day.openingTime
              ? new Date(`1970-01-01T${day.openingTime}`)
              : new Date(0, 0, 0, 9, 0),
            close: day.closingTime
              ? new Date(`1970-01-01T${day.closingTime}`)
              : new Date(0, 0, 0, 22, 0),
          })
        );
        setHours(updatedHours);
      }
    }, [businessDetails]);

    const handleSetPrinterConnection = async (printerIpAddress: string) => {
      if (window.ReactNativeWebView) {
        const message = JSON.stringify({
          type: "SET_PRINTER_CONNECTION",
          data: {
            printerIpAddress: printerIpAddress.trim(),
          },
        });
        window.ReactNativeWebView.postMessage(message);
      } else {
        // Fallback for web testing
        toast.info(`Setting connection can be done only on mobile app`);
      }
    };
    const handleChange = <K extends keyof DayHour>(
      index: number,
      field: K,
      value: DayHour[K]
    ) => {
      const updated = [...hours];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      setHours(updated);
    };

    const handleTestPrinterConnection = async (printerIpAddress: string) => {
      // Send printer IP to React Native WebView
      if (window.ReactNativeWebView) {
        const message = JSON.stringify({
          type: "TEST_PRINTER_CONNECTION",
          data: {
            printerIpAddress: printerIpAddress.trim(),
          },
        });
        window.ReactNativeWebView.postMessage(message);
      } else {
        // Fallback for web testing
        toast.info(`Testing connection can be done only on mobile app`);
      }
    };

    const validate = (): boolean => {
      const errs: Record<string, string> = {};

      if (!bio.trim()) {
        errs.bio = "Business description is required.";
      }
      // if (!address.instructions.trim()) {
      //   errs.instructions = "Pickup instructions are required.";
      // }

      setErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const clearError = (field: string) => {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    };
    const prepareBrandAssets = async (
      brands: BrandAssetsState
    ): Promise<{ logo: string | null; banner: string | null }> => {
      let logoUrl: string | null = null;
      let bannerUrl: string | null = null;

      if (brands.logo) {
        if (brands.logo instanceof File) {
          const uploadResp = await uploadImage(brands.logo);
          if (!uploadResp?.fileName) {
            throw new Error("Logo upload failed.");
          }
          logoUrl = uploadResp.fileName;
        } else if (typeof brands.logo === "string") {
          logoUrl = brands.logo;
        }
      }

      if (brands.banner) {
        if (brands.banner instanceof File) {
          const uploadResp = await uploadImage(brands.banner);
          if (!uploadResp?.fileName) {
            throw new Error("Banner upload failed.");
          }
          bannerUrl = uploadResp.fileName;
        } else if (typeof brands.banner === "string") {
          bannerUrl = brands.banner;
        }
      }

      return { logo: logoUrl, banner: bannerUrl };
    };

    const prepareParkingPhoto = async (
      photo: File | string | null
    ): Promise<string | null> => {
      if (!photo) return null;

      if (typeof photo === "string") {
        // Already uploaded — keep as is
        return photo;
      }

      // If it's a File, upload it
      const uploadResp = await uploadImage(photo);
      if (!uploadResp?.fileName) {
        throw new Error("Parking photo upload failed.");
      }

      return uploadResp.fileName;
    };

    const handleSubmit = async () => {
      if (!validate()) return;
      const brandAssetsUploaded = await prepareBrandAssets(brands);
      const parkingPhotoUrl = await prepareParkingPhoto(parkingPhoto);

      const payload = {
        bId: businessId,
        description: bio?.trim() || "",
        printerIpAddress: printerIpAddress?.trim() || "",
        process: process?.trim() || "",
        googleReviewLink: googleReviewLink?.trim() || "",
        amenities: JSON.stringify({
          selected: amenities,
          custom: customAmenities.length ? customAmenities : null,
        }),
        parkingInformation: JSON.stringify({
          type: parkingType,
          notes: parkingNotes,
          photo: parkingPhotoUrl,
          video: "",
        }),
        tablesAndOrderingInformation: JSON.stringify({
          hasTables: tables === "yes",
        }),
        deliveryinformation: JSON.stringify({
          hasDrivers: drivers === "yes",
        }),
        pickupAndBusinessLocationInformation: JSON.stringify({
          instructions: address.instructions,
          // addressLine1: address.addressLine1,
          // addressLine2: address.addressLine2,
          // city: address.city,
          // state: address.state,
          // zipCode: address.zipCode,
        }),
        paymentInformation: JSON.stringify({
          methods: payments,
        }),
        brandAssets: JSON.stringify(brandAssetsUploaded),
        businessHours: hours.map((day) => ({
          day: day.day,
          openingTime: day.open
            ? `${day.open.getHours().toString().padStart(2, "0")}:${day.open
              .getMinutes()
              .toString()
              .padStart(2, "0")}:00`
            : null,
          closingTime: day.close
            ? `${day.close.getHours().toString().padStart(2, "0")}:${day.close
              .getMinutes()
              .toString()
              .padStart(2, "0")}:00`
            : null,
          isClosed: day.closed,
        })),
      };
      try {
        setLoading(true);
        const response = await ApiService.request(
          "POST",
          `${ENDPOINTS.BUSINESS.SAVE_BUSINESS}`,
          payload
        );
        setLoading(false);
        if (response.status === 1) {
          toast.success(response.message);
          if (printerIpAddress?.trim()) {
            handleSetPrinterConnection(printerIpAddress.trim());
          }
          StorageService.setItem("businessName", response?.businessName || "");
          localStorage.setItem("businessSetup", String(true));
          authLogin(true);
        } else {
          toast.success("Failed to save business.");
        }
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to save business.";
          toast.success(message);
        }
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {loading && <Loader />}
        <Box
          maxWidth={800}
          mx="auto"
          p={4}
          display="flex"
          flexDirection="column"
          gap={4}
          width="100%"
        >
          {!disableHeading && (
            <>
              <Typography variant="h3" textAlign="center">
                Complete Your Business Setup
              </Typography>
              <Typography textAlign="center" color="text.secondary">
                Tell customers about your business and how to find you
              </Typography>
            </>
          )}
          <Section
            title="Business Description"
            subtitle="Help customers understand what makes your business special"
          >
            {showBusinessName && (
              <Input
                label="Business Name"
                placeholder="Business Name"
                fullWidth
                disabled={true}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                error={!!errors.businessName}
                helperText={errors.businessName}
                sx={{ mb: 2 }}
              />
            )}
            <BusinessDescriptionSection
              bio={bio}
              process={process}
              setBio={setBio}
              setProcess={setProcess}
              errors={errors}
              clearError={clearError}
            />
          </Section>
          <Section
            title="Account Details"
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: "#2563eb",
                  width: 40,
                  height: 40,
                  fontSize: 20,
                }}
              >
                {userData.fullName?.[0]?.toUpperCase() || ""}
              </Avatar>
              <Typography variant="h6">
                {userData.fullName} {userData.lastName}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <InfoRow icon="📧" text={maskEmail(userData.email)} />
              <InfoRow icon="📞" text={maskPhone(userData.mobile)} />
              <InfoRow icon="👤" text={userData.businessName || "--"} />
              <InfoRow icon="📍" text={userData.location || "--"} />
            </Box>
          </Section>
          <Section
            title="Printer Settings"
            subtitle="LAN/TCP Printer IP Address"
          >
            <Input
              label="Printer IP Address"
              placeholder="192.168.1.50"
              fullWidth
              value={printerIpAddress}
              onChange={(e) => setPrinterIpAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <CustomButton
              fullWidth
              onClick={() => handleTestPrinterConnection(printerIpAddress)}
              disabled={!printerIpAddress?.trim()}
              sx={{ mt: 1 }}
            >
              {testingConnection ? "Testing Connection..." : "Test Connection"}
            </CustomButton>
          </Section>
          <Section
            title="Amenities"
            subtitle="Select all amenities that apply to your business"
          >
            <AmenitiesSection
              amenities={amenities}
              customAmenity={customAmenity}
              customAmenities={customAmenities}
              setAmenities={setAmenities}
              setCustomAmenities={setCustomAmenities}
              setCustomAmenity={setCustomAmenity}
            />
          </Section>

          <Section
            title="Parking Information"
            subtitle="Help customers know where they can park"
          >
            <Select
              fullWidth
              label="Parking Type"
              value={parkingType}
              onChange={(e) => setParkingType(e.target.value as string)}
              options={parkingOptions}
              error={!!errors.parkingType}
              helperText={errors.parkingType}
            />
            <Input
              label="Parking Notes (optional)"
              placeholder="Parking Notes (optional)"
              fullWidth
              value={parkingNotes}
              onChange={(e) => setParkingNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <FileUploadBox
                  id="parking-photo"
                  label="Parking Photo"
                  note="Recommended JPG/PNG, max 2MB"
                  file={parkingPhoto}
                  onChange={setParkingPhoto}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploadBox
                  id="parking-video"
                  label="Parking Video"
                  note="MP4, max 30s"
                  file={parkingVideo}
                  onChange={setParkingVideo}
                />
              </Grid>
            </Grid>
          </Section>

          <Section
            title="Business Hours"
            subtitle="Set your operating hours for each day of the week"
          >
            <HoursSelection hours={hours} handleChange={handleChange} />
          </Section>

          {/* <BusinessOptionCard
            title="Tables & Ordering Setup"
            subtitle="Help us understand how you operate and what works best for your staff and customers"
            question="Do you have dine-in tables?"
            description="If you have tables, Plano can generate a unique NFC tag and QR code for each table, making it easy for customers to place orders, call for a waiter, request the bill, and chat with staff — saving time for both your team and your guests."
            value={tables}
            onChange={setTables}
            yesLabel="Yes, we have tables."
            noLabel="No, we are takeaway only."
          /> */}

          {/* <BusinessOptionCard
            title="Delivery Drivers Setup"
            subtitle="Configure your delivery options and capabilities"
            question="Do you have your own delivery drivers?"
            description="If yes, you can enable Deliveries in Plano and manage both delivery and collection orders seamlessly."
            value={drivers}
            onChange={setDrivers}
            yesLabel="Yes, we have delivery drivers."
            noLabel="No, we only offer collection."
          /> */}

          {/* <Section
            title="Pickup Info"
            subtitle="Help customers find you and understand pickup process"
          >
            <PickupInfoSection
              address={address}
              setAddress={setAddress}
              errors={errors}
              clearError={clearError}
            />
          </Section> */}
          {/* <Section
            title="Business Location"
            subtitle="Help customers find you and understand business location"
          >
            <BusinessLocation />
          </Section> */}
          {/* 
          <PaymentSetup
            payments={payments}
            onChange={(m, v) => setPayments((p) => ({ ...p, [m]: v }))}
          /> */}

          <Section
            title="Brand Assets"
            subtitle="Upload your business logo and cover image"
          >
            <BrandAssetsSection brands={brands} setBrands={setBrands} />
          </Section>
          <Section
            title="Google Review Link"
            subtitle="Add your Google Review Link"
          >
            <Input
              label="Google Review Link"
              placeholder="Google Review Link"
              fullWidth
              value={googleReviewLink}
              onChange={(e) => setGoogleReviewLink(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Section>
          <Box mt={2} textAlign="center">
            <CustomButton onClick={handleSubmit}>Submit</CustomButton>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };

export default BusinessSetupForm;
