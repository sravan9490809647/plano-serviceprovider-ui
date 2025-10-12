import { Dialog, DialogContent, Box, Typography, TextField } from "@mui/material";
import { useState } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { TEXT_COLORS } from "../../../Constants";
import CustomButton from "../../../components/Button";

interface ReceiptOptionsDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectOption: (option: string) => void;
    onSendEmail?: (email: string) => void;
    onBackToOptions?: () => void;
    showEmailForm?: boolean;
    loading?: boolean;
}

const buttonStyles = {
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #e0e0e0',
    '&:hover': {
        backgroundColor: '#000',
        color: '#fff',
        border: '1px solid #e0e0e0',
    },
};
const ReceiptOptionsDialog: React.FC<ReceiptOptionsDialogProps> = ({
    open,
    onClose,
    onSelectOption,
    onSendEmail,
    onBackToOptions,
    showEmailForm = false,
    loading = false,
}) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendEmail = () => {
        if (!email) {
            setEmailError("Email address is required");
            return;
        }
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");
        onSendEmail?.(email);
        setEmail("");
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 2,
                },
            }}
        >
            <DialogContent sx={{ p: 3 }}>
                {/* Icon */}
                <Box display="flex" justifyContent="center" mb={2}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ReceiptIcon sx={{ fontSize: 40, color: '#fff' }} />
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    variant="h4"
                    textAlign="center"
                    fontWeight={600}
                    mb={1}
                    sx={{ color: TEXT_COLORS.PRIMARY }}
                >
                    Receipt Options
                </Typography>

                {/* Subtitle */}
                <Typography
                    variant="body1"
                    textAlign="center"
                    color="text.secondary"
                    mb={4}
                >
                    {showEmailForm ? "Enter your email address" : "Choose how you'd like to receive your receipt"}
                </Typography>

                {/* Conditional Rendering: Email Form or Options */}
                {showEmailForm ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Email Input */}
                        <TextField
                            fullWidth
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                            }}
                            error={!!emailError}
                            helperText={emailError}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        {/* Send Receipt Button */}
                        <CustomButton
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#000',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                            }}
                            onClick={handleSendEmail}
                        >
                            Send Receipt
                        </CustomButton>

                        {/* Back to Options Button */}
                        <CustomButton
                            variant="outlined"
                            disabled={loading}
                            sx={buttonStyles}
                            onClick={onBackToOptions}
                        >
                            Back to Options
                        </CustomButton>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Download Receipt */}
                        <CustomButton
                            variant="outlined"
                            disabled={loading}
                            sx={buttonStyles}
                            onClick={() => onSelectOption('download')}
                            startIcon={<DownloadIcon />}
                        >
                            Download Receipt
                        </CustomButton>

                        {/* Email Receipt */}
                        <CustomButton
                            variant="outlined"
                            disabled={loading}
                            sx={buttonStyles}
                            onClick={() => onSelectOption('email')}
                            startIcon={<EmailIcon />}
                        >
                            Email Receipt
                        </CustomButton>

                        {/* No Receipt Needed */}
                        <CustomButton
                            variant="outlined"
                            disabled={loading}
                            sx={buttonStyles}
                            onClick={() => onSelectOption('none')}
                            startIcon={<ReceiptIcon />}
                        >
                            No Receipt Needed
                        </CustomButton>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptOptionsDialog;

