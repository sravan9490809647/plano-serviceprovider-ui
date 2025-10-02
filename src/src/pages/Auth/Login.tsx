import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import Input from "../../components/Input"; // Custom Input component
import Button from "../../components/Button"; // Custom Button component
import ApiService from "../../services/ApiService"; // Import ApiService
import { ENDPOINTS } from "../../Constants";
import StorageService from "../../../services/StorageService";
import { useAuth } from "../../context/AuthContext"; // Add this
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const { login: authLogin } = useAuth(); // inside component

  const [loading, setLoading] = useState(false); // Loading state for API call
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "info", // Can be "success", "info", "warning", or "error"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setAlert({ open: false, message: "", severity: "info" }); // Reset alert state
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true); // Set loading state
      try {
        const response = await ApiService.request(
          "POST",
          ENDPOINTS.AUTH.LOGIN,
          formData
        );
        if (response.status === 1) {
          // Handle successful login (e.g., redirect, store token)
          StorageService.setItem("authToken", response.token); // Save token to localStorage
          StorageService.setItem("businessId", response.businessId); // Save businessId to localStorage
          // Show success alert
          setAlert({
            open: true,
            message: "Login Successful!",
            severity: "success",
          });
          try {
            const businessResponse = await ApiService.request(
              "GET",
              `${ENDPOINTS.BUSINESS.GET_BUSINESS}${response.businessId}`
            );
            if (businessResponse.status === 0) {
              authLogin(false);
              localStorage.setItem("businessSetup", String(false));
              return;
            }
            if (businessResponse?.bId) {
              authLogin(true);
              StorageService.setItem("businessName", businessResponse?.businessName || "");
              localStorage.setItem("businessSetup", String(true));
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.status === 404) {
                authLogin(false);
                localStorage.setItem("businessSetup", String(false));
              }
            }
          }
        } else {
          setAlert({
            open: true,
            message: response.message || "Login failed. Please try again.",
            severity: "error",
          });
        }
        // Redirect to dashboard after successful login
      } catch (error) {
        // Show error alert
        setAlert({
          open: true,
          message:
            error instanceof Error
              ? error.message
              : "Login failed. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        padding: 3,
        width: "calc(100vw)",
      }}
    >
      {loading && <Loader />}
      {/* Logo and Title */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3">Plano</Typography>
        <Typography variant="body1">
          Revolutionary Food Ordering Platform
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        width="100%"
        maxWidth="500px"
        bgcolor="#FFFFFF"
        borderRadius={2}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        p={4}
      >
        <Typography variant="h4" textAlign="center" mb={2}>
          Welcome Back
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3}>
          Sign in to access your dashboard and manage your NFC-powered
          restaurant
        </Typography>
        {alert.open && <Alert severity={alert.severity}>{alert.message}</Alert>}

        {/* Email Input */}
        <Input
          fullWidth
          label="Email Address"
          name="email"
          sx={{ mt: 2 }}
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Password Input */}
        <Input
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        {/* Remember Me and Forgot Password */}
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {/* <Box display="flex" alignItems="center">
            <Checkbox size="small" />
            <Typography variant="body1">Remember me</Typography>
          </Box> */}
          <Typography
            variant="body1"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Typography>
        </Box>
        {/* Sign In Button */}
        <Button
          fullWidth
          sx={{
            mt: 2,
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In →"}
        </Button>
        {/* Sign Up Link */}
        <Box textAlign="center" mt={2} onClick={() => navigate("/signup")}>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            Don’t have an account? Sign Up
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
