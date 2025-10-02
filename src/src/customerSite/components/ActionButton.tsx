import React from "react";
import { Box, CircularProgress, styled } from "@mui/material";

interface ActionButtonProps {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    borderColor: string;
    loading?: boolean;
    onClick: (actionId: string) => void;
}

const ActionButtonWrapper = styled(Box)(({ }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
}));

const ActionButtonIcon = styled(Box)<{ $borderColor: string; $loading?: boolean }>(({ theme, $borderColor, $loading }) => ({
    width: 48,
    height: 48,
    borderRadius: theme.spacing(1),
    backgroundColor: $loading ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.95)",
    border: `2px solid ${$borderColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(0.5),
    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease",
    cursor: $loading ? "not-allowed" : "pointer",
    opacity: $loading ? 0.6 : 1,
    "&:hover": {
        backgroundColor: $loading ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 1)",
        border: `2px solid ${$borderColor.replace('0.8', '1')}`,
        transform: $loading ? "none" : "scale(1.05)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)",
    },
}));

const ActionButtonLabel = styled(Box)(({ theme }) => ({
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "white",
    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
    borderRadius: theme.spacing(0.5),
    backdropFilter: "blur(4px)",
}));

const ActionButton: React.FC<ActionButtonProps> = ({
    id,
    label,
    icon: IconComponent,
    borderColor,
    loading = false,
    onClick,
}) => {
    const handleClick = () => {
        if (!loading) {
            onClick(id);
        }
    };

    return (
        <ActionButtonWrapper onClick={handleClick}>
            <ActionButtonIcon $borderColor={borderColor} $loading={loading}>
                {loading ? (
                    <CircularProgress size={20} sx={{ color: "#333" }} />
                ) : (
                    <IconComponent sx={{ color: "#333", fontSize: 24 }} />
                )}
            </ActionButtonIcon>
            <ActionButtonLabel>
                {label}
            </ActionButtonLabel>
        </ActionButtonWrapper>
    );
};

export default ActionButton; 