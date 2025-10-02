import React from "react";
import { Box, Typography } from "@mui/material";
import { FONT_FAMILY } from "../Constants";

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    height?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    subtitle,
    height = "calc(100vh - 200px)"
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height,
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h6" sx={{ fontFamily: FONT_FAMILY.BOLD }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY.REGULAR }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default EmptyState; 