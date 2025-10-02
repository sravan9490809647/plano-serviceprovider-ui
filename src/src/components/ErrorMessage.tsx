import React from "react";
import { Box, Typography } from "@mui/material";
import { StickyBox } from "../Styles";

interface ErrorMessageProps {
    title?: string;
    message: string;
    showHeader?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = "Error",
    message,
    showHeader = true
}) => {
    return (
        <Box>
            {showHeader && (
                <StickyBox>
                    <Typography variant="h3">{title}</Typography>
                </StickyBox>
            )}
            <Box px={2}>
                <Typography variant="h6" color="error">
                    {message}
                </Typography>
            </Box>
        </Box>
    );
};

export default ErrorMessage; 