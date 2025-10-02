import React, { useState } from "react";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";

import Input from "../../../components/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import Button from "../../../components/Button";
import "./../../../App.css";
interface IPersonalDetails {
  onChangeStep: (step: number, data?: Record<string, unknown>) => void;
  initialData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    countryCode?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: boolean;
  };
  loading: boolean;
}
const PersonalDetails: React.FC<IPersonalDetails> = ({
  onChangeStep,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    mobile: initialData?.mobile || "",
    countryCode: initialData?.countryCode || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    termsAccepted: initialData?.termsAccepted || false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    termsAccepted: "",
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
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      termsAccepted: "",
    };

    // Full Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10,15}$/; // Accepts 10 to 15 digits
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number format. Must be 10-15 digits.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms & Conditions validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms & Conditions.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onChangeStep(2, formData);
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Input
          fullWidth
          label="First Name *"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={6}>
        <Input
          fullWidth
          label="Last Name *"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          fullWidth
          label="Email Address *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>

      <Grid item xs={12} sm={4} sx={{ position: "relative" }}>
        <PhoneInput
          country={"gb"}
          value={formData.countryCode || ""}
          onChange={(phone) =>
            setFormData((prev) => ({ ...prev, countryCode: phone }))
          }
          inputStyle={{
            width: "100%",
            height: "56px",
            borderRadius: 4,
            border: "1px solid #000000",
            fontSize: "16px",
            background: "transparent",
            color: "#000",
          }}
          containerStyle={{
            width: "100%",
            background: "transparent",
          }}
          buttonStyle={{
            background: "transparent",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          dropdownStyle={{
            backgroundColor: "#fff",
            color: "#000",
          }}
          specialLabel="Country Code *"
          enableSearch
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Input
          fullWidth
          label="Mobile Number *"
          name="mobile"
          type="tel"
          placeholder="Enter your mobile number"
          value={formData.mobile}
          onChange={handleChange}
          error={!!errors.mobile}
          helperText={errors.mobile}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Input
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
          }
          label="Accept Terms & Conditions *"
        />
      </Grid>

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

export default PersonalDetails;
