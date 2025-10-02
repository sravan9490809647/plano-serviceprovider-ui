import React, { useState } from "react";
import { Grid } from "@mui/material";

import Input from "../../../components/Input";
import "react-phone-input-2/lib/material.css";
import Button from "../../../components/Button";

interface IAddressDetails {
  onChangeStep: (step: number, data?: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>; // Add initialData prop
  loading: boolean;
}
const AddressDetails: React.FC<IAddressDetails> = ({
  onChangeStep,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState<{
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    country: string;
    postCode: string;
  }>({
    addressLine1: (initialData?.addressLine1 as string) || "",
    addressLine2: (initialData?.addressLine2 as string) || "",
    city: (initialData?.city as string) || "",
    province: (initialData?.province as string) || "",
    country: (initialData?.country as string) || "",
    postCode: (initialData?.postCode as string) || "",
  });

  const [errors, setErrors] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    country: "",
    postCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      addressLine1: "",
      addressLine2: "", // Optional field
      city: "",
      province: "",
      country: "",
      postCode: "",
    };

    // Address Line 1 validation
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required.";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    // State/Province validation
    if (!formData.province.trim()) {
      newErrors.province = "State/Province is required.";
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    // Zip/Postal Code validation
    const postCodeRegex = /^[0-9]{4,10}$/; // Accepts 4 to 10 digits
    if (!formData.postCode.trim()) {
      newErrors.postCode = "Zip/Postal Code is required.";
    } else if (!postCodeRegex.test(formData.postCode)) {
      newErrors.postCode = "Invalid Zip/Postal Code format.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onChangeStep(4, formData);
      // TODO: Add API submission logic
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Input
          fullWidth
          label="Address Line 1 *"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          error={!!errors.addressLine1}
          helperText={errors.addressLine1}
        />
      </Grid>

      <Grid item xs={12}>
        <Input
          fullWidth
          label="Address Line 2 (optional)"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          error={!!errors.addressLine2}
          helperText={errors.addressLine2}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="City *"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="State/Province *"
          name="province"
          type="text"
          value={formData.province}
          onChange={handleChange}
          error={!!errors.province}
          helperText={errors.province}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="Zip/Postal Code *"
          name="postCode"
          type="number"
          value={formData.postCode}
          onChange={handleChange}
          error={!!errors.postCode}
          helperText={errors.postCode}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="Country *"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          error={!!errors.country}
          helperText={errors.country}
        />
      </Grid>

      <Grid item xs={12}></Grid>

      <Grid item xs={12}>
        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
          disabled={loading}
        >
          {"Continue →"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddressDetails;
