import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CustomButton from "./Button";

interface MessageDialogProps {
    open: boolean;
    onClose: () => void;
    onSendMessage: (message: string) => void;
    loading?: boolean;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
    open,
    onClose,
    onSendMessage,
    loading = false,
}) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    const handleClose = () => {
        setMessage("");
        onClose();
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: 300,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 1,
                }}
            >
                <Typography variant="h6">
                    Send Message to Staff
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Send a message to the restaurant staff. They will respond as soon as possible.
                </Typography>

                <TextField
                    autoFocus
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <CustomButton
                    onClick={handleClose}
                    disabled={loading}
                    variant="text"
                    sx={{ mr: 1 }}
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    startIcon={<SendIcon />}
                >
                    {loading ? "Sending..." : "Send Message"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default MessageDialog; 