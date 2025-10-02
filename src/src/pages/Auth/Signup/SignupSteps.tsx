import React, { useState } from "react";
import { Box, Typography, Paper, Button, styled } from "@mui/material";
import backgroundImage from "./../../../../assets/images/signup_background.jpeg";
import PersonalDetails from "./PersonalDetails";
import BusinessDetails from "./BusinessDetails";
import AddressDetails from "./AddressDetails";
import { toast } from "react-toastify";
import ApiService from "../../../services/ApiService";
import { ENDPOINTS } from "../../../Constants";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const SignupSteps: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [personalDetailsData, setPersonalDetailsData] = useState<
    Record<string, unknown>
  >({});
  const [businessDetailsData, setBusinessDetailsData] = useState<
    Record<string, unknown>
  >({});
  const [addressDetailsData, setAddressDetailsData] = useState<
    Record<string, unknown>
  >({});
  const handleBack = () => setStep((prev) => prev - 1);

  const onChangeStep = (newStep: number, data?: Record<string, unknown>) => {
    if (newStep === 2) {
      setStep(newStep);
      setPersonalDetailsData(data || {});
    } else if (newStep === 3) {
      setStep(newStep);
      setBusinessDetailsData(data || {});
    } else {
      setAddressDetailsData(data || {});
      onSubmitSignupData(data || {});
    }
  };

  const onSubmitSignupData = async (addressData: Record<string, unknown>) => {
    const signupData = {
      fullName: personalDetailsData.firstName,
      lastName: personalDetailsData.lastName,
      email: personalDetailsData.email,
      mobile: `${personalDetailsData.countryCode}${personalDetailsData.mobile}`,
      password: personalDetailsData.password,
      businessName: businessDetailsData.businessName,
      type: businessDetailsData.businessType,
      businessEmail: businessDetailsData.businessEmail,
      businessMobile: businessDetailsData.businessMobile,
      addressLine1: addressData.addressLine1,
      addressLine2: addressData.addressLine2,
      city: addressData.city,
      province: addressData.province,
      country: addressData.country,
      postCode: addressData.postCode,
      latitude: "17.1234",
      longitude: "18.567",
      operationalInfo: null,
    };
    try {
      setLoading(true);
      const response = await ApiService.request(
        "POST",
        ENDPOINTS.AUTH.SIGNUP,
        signupData
      );
      if (response.status === 1) {
        setLoading(false);
        toast.success("Signup completed successfully!");
        navigate("/login");
      } else {
        setLoading(false);
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errData = error.response?.data;
        if (errData?.status === 0 && errData?.message) {
          toast.error(errData.message);
        } else {
          toast.error(error.message || "An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundBox>
      {loading && <Loader />}
      <Typography variant="body1">Step {step} of 3</Typography>
      <Typography variant="h3" mb={3}>
        Create Account
      </Typography>
      <GlassCard elevation={3}>
        {step === 1 && (
          <PersonalDetails
            onChangeStep={onChangeStep}
            initialData={personalDetailsData}
            loading={loading}
          />
        )}
        {step === 2 && (
          <BusinessDetails
            onChangeStep={onChangeStep}
            initialData={businessDetailsData}
            loading={loading}
          />
        )}
        {step === 3 && (
          <AddressDetails
            onChangeStep={onChangeStep}
            initialData={addressDetailsData}
            loading={loading}
          />
        )}
        <Box display="flex" justifyContent="space-between" mt={3}>
          {step > 1 && <Button onClick={handleBack}>Back</Button>}
        </Box>
      </GlassCard>
      <Box
        textAlign="center"
        mt={2}
        sx={{ cursor: "pointer" }}
        onClick={() => navigate("/login")}
      >
        <Typography variant="body1">Already have an account? Login</Typography>
      </Box>
    </BackgroundBox>
  );
};

export default SignupSteps;

const BackgroundBox = styled(Box)({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100vw",
  overflowX: "hidden", // Prevent horizontal scrolling
});

const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: "blur(10px)",
  backgroundColor: "transparent",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  maxWidth: 600,
  width: "100%",
}));
