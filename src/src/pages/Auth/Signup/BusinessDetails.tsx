import React, { useState } from "react";
import { Grid, type SelectChangeEvent } from "@mui/material";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Select from "../../../components/Select";

const categories = [
  { value: "restaurant", label: "Restaurant" },
  { value: "retail store", label: "Retail Store" },
  { value: "service provider", label: "Service Provider" },
  { value: "health care", label: "Health Care" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];
interface IBusinessDetails {
  onChangeStep: (step: number, data?: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>; // Add initialData prop
  loading: boolean;
}
const BusinessDetails: React.FC<IBusinessDetails> = ({
  onChangeStep,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState<{
    businessName: string;
    businessType: string;
    businessEmail: string;
    businessMobile: string;
  }>({
    businessName:
      typeof initialData?.businessName === "string"
        ? initialData.businessName
        : "",
    businessType:
      typeof initialData?.businessType === "string"
        ? initialData.businessType
        : "",
    businessEmail:
      typeof initialData?.businessEmail === "string"
        ? initialData.businessEmail
        : "",
    businessMobile:
      typeof initialData?.businessMobile === "string"
        ? initialData.businessMobile
        : "",
  });

  const [errors, setErrors] = useState({
    businessName: "",
    businessType: "",
    businessEmail: "",
    businessMobile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {
      businessName: "",
      businessType: "",
      businessEmail: "",
      businessMobile: "",
    };

    // Business Name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business Name is required.";
    }

    // Business Type validation
    if (!formData.businessType.trim()) {
      newErrors.businessType = "Business Type is required.";
    }

    // Business Email validation (only if entered)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = "Email Address is required.";
    } else if (!emailRegex.test(formData.businessEmail)) {
      newErrors.businessEmail = "Invalid email format.";
    }

    // Business Mobile validation (only if entered)
    const mobileRegex = /^[0-9]{10,15}$/; // Accepts 10 to 15 digits
    if (!formData.businessMobile.trim()) {
      newErrors.businessMobile = "Mobile Number is required.";
    } else if (!mobileRegex.test(formData.businessMobile)) {
      newErrors.businessMobile =
        "Invalid mobile number format. Must be 10-15 digits.";
    }

    setErrors(newErrors);

    // Check if there are no errors
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      onChangeStep(3, formData);
      // TODO: Add API submission logic
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Input
          fullWidth
          label="Business Name *"
          name="businessName"
          value={formData.businessName || ""}
          onChange={handleChange}
          error={!!errors.businessName}
          helperText={errors.businessName}
        />
      </Grid>

      <Grid item xs={12}>
        <Select
          fullWidth
          label="Business Type *"
          value={formData.businessType || ""}
          onChange={(
            event: SelectChangeEvent<string | number | (string | number)[]>
          ) =>
            setFormData((prev) => ({
              ...prev,
              businessType: String(event.target.value),
            }))
          }
          options={categories}
          error={!!errors.businessType}
          helperText={errors.businessType}
        />
      </Grid>

      <Grid item xs={12}>
        <Input
          fullWidth
          label="Business Email"
          name="businessEmail"
          value={formData.businessEmail || ""}
          onChange={handleChange}
          error={!!errors.businessEmail}
          helperText={errors.businessEmail}
        />
      </Grid>

      <Grid item xs={12}>
        <Input
          fullWidth
          label="Business Contact Number"
          name="businessMobile"
          type="tel"
          placeholder="Enter your mobile number"
          value={formData.businessMobile || ""}
          onChange={handleChange}
          error={!!errors.businessMobile}
          helperText={errors.businessMobile}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
          disabled={loading}
        >
          Continue →
        </Button>
      </Grid>
    </Grid>
  );
};

export default BusinessDetails;
