import React from "react";
import { Box } from "@mui/material";

interface RoundBadgeProps {
    children: React.ReactNode;
    size?: number;
    backgroundColor?: string;
    color?: string;
    fontSize?: string | number;
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    sx?: any;
}

const RoundBadge: React.FC<RoundBadgeProps> = ({
    children,
    size = 25,
    backgroundColor = "#000",
    color = "#fff",
    fontSize = "12px",
    top,
    left,
    right,
    bottom,
    sx,
}) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top,
                left,
                right,
                bottom,
                backgroundColor,
                color,
                borderRadius: "50%",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize,
                zIndex: 1,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default RoundBadge;

