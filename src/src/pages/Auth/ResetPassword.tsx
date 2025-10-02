import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ApiService from "../../services/ApiService";
import { ENDPOINTS } from "../../Constants";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { id: resetId } = useParams();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

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

    useEffect(() => {
        // Check if reset ID is present in URL
        if (!resetId) {
            setAlert({
                open: true,
                message: "Invalid reset link. Please request a new password reset.",
                severity: "error",
            });
        }
    }, [resetId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear errors when user starts typing
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setAlert({ open: false, message: "", severity: "info" });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { password: "", confirmPassword: "" };

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!resetId) {
            setAlert({
                open: true,
                message: "Invalid reset link. Please request a new password reset.",
                severity: "error",
            });
            return;
        }

        if (validateForm()) {
            setLoading(true);
            try {
                const response = await ApiService.request(
                    "POST",
                    ENDPOINTS.AUTH.RESET_PASSWORD,
                    {
                        id: resetId,
                        newPassword: formData.password,
                    }
                );

                if (response.status === 1) {
                    setAlert({
                        open: true,
                        message: response.message || "Password reset successfully! You can now login with your new password.",
                        severity: "success",
                    });

                    // Clear form after successful reset
                    setFormData({
                        password: "",
                        confirmPassword: "",
                    });

                    // Redirect to login after a short delay
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    setAlert({
                        open: true,
                        message: response.message || "Failed to reset password. Please try again.",
                        severity: "error",
                    });
                }
            } catch (error) {
                setAlert({
                    open: true,
                    message: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
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

            {/* Reset Password Form */}
            <Box
                width="100%"
                maxWidth="500px"
                bgcolor="#FFFFFF"
                borderRadius={2}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                p={4}
            >
                <Typography variant="h4" textAlign="center" mb={2}>
                    Reset Password
                </Typography>
                <Typography variant="body1" textAlign="center" mb={3}>
                    Enter your new password below
                </Typography>

                {alert.open && <Alert severity={alert.severity}>{alert.message}</Alert>}

                {/* New Password Input */}
                <Input
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    sx={{ mt: 2 }}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                />

                {/* Confirm Password Input */}
                <Input
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    sx={{ mt: 2 }}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />

                {/* Submit Button */}
                <Button
                    fullWidth
                    sx={{
                        mt: 3,
                    }}
                    onClick={handleSubmit}
                    disabled={loading || !resetId}
                >
                    {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword; 