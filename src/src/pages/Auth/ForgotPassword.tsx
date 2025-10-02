import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "info" | "warning" | "error";
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError("");
        setAlert({ open: false, message: "", severity: "info" });
    };

    const validateEmail = () => {
        if (!email) {
            setEmailError("Email is required.");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validateEmail()) {
            setLoading(true);
            try {
                const response = await ApiService.request(
                    "GET",
                    `${ENDPOINTS.AUTH.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`
                );

                if (response.status === 1) {
                    setAlert({
                        open: true,
                        message: response.message || "Password recovery link sent to your email.",
                        severity: "success",
                    });
                    // Clear the email field after successful submission
                    setEmail("");
                } else {
                    setAlert({
                        open: true,
                        message: response.message || "Failed to send recovery email. Please try again.",
                        severity: "error",
                    });
                }
            } catch (error) {
                setAlert({
                    open: true,
                    message: error instanceof Error ? error.message : "Failed to send recovery email. Please try again.",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
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

            {/* Forgot Password Form */}
            <Box
                width="100%"
                maxWidth="500px"
                bgcolor="#FFFFFF"
                borderRadius={2}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                p={4}
            >
                <Typography variant="h4" textAlign="center" mb={2}>
                    Forgot Password
                </Typography>
                <Typography variant="body1" textAlign="center" mb={3}>
                    Enter your email address and we'll send you a link to reset your password
                </Typography>

                {alert.open && <Alert severity={alert.severity}>{alert.message}</Alert>}

                {/* Email Input */}
                <Input
                    fullWidth
                    label="Email Address"
                    name="email"
                    sx={{ mt: 2 }}
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                />

                {/* Submit Button */}
                <Button
                    fullWidth
                    sx={{
                        mt: 3,
                    }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Recovery Link"}
                </Button>

                {/* Back to Login Link */}
                <Box textAlign="center" mt={2} onClick={handleBackToLogin}>
                    <Typography variant="body1" sx={{ cursor: "pointer" }}>
                        ← Back to Sign In
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword; 