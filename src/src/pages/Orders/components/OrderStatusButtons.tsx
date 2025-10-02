import React from "react";
import { Stack } from "@mui/material";
import CustomButton from "../../../components/Button";
import { themeColors } from "../../../utils/colors";
import { ORDER_STATUS } from "../../../Constants";

interface OrderStatusButtonsProps {
    orderId: string;
    orderStatus: string;
    onStatusUpdate: (id: string, status: string) => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'table' | 'dialog';
}

const OrderStatusButtons: React.FC<OrderStatusButtonsProps> = ({
    orderId,
    orderStatus,
    onStatusUpdate,
    size = 'small',
    variant = 'table',
}) => {
    // Define button styles based on size and variant
    const getButtonStyles = (color: string) => {
        const baseStyles = {
            backgroundColor: color,
            color: themeColors.white,
            "&:hover": {
                backgroundColor: color,
                color: themeColors.white,
                opacity: 0.8,
            }
        };

        if (variant === 'dialog') {
            // Dialog variant - larger buttons
            return {
                ...baseStyles,
                fontSize: size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px',
                height: size === 'large' ? '48px' : size === 'medium' ? '40px' : '36px',
                // minWidth: size === 'large' ? '120px' : size === 'medium' ? '100px' : '80px',
                px: size === 'large' ? 3 : size === 'medium' ? 2 : 1.5,
            };
        } else {
            // Table variant - smaller buttons
            return {
                ...baseStyles,
                fontSize: size === 'large' ? '14px' : size === 'medium' ? '12px' : '10px',
                height: size === 'large' ? '36px' : size === 'medium' ? '32px' : '28px',
                // minWidth: size === 'large' ? '80px' : size === 'medium' ? '70px' : '60px',
                px: size === 'large' ? 2 : size === 'medium' ? 1.5 : 1,
            };
        }
    };

    // Show Accept/Decline buttons for ORDERED status
    if (orderStatus === ORDER_STATUS.ORDERED) {
        return (
            <Stack direction="row" spacing={1}>
                <CustomButton
                    size={size}
                    sx={getButtonStyles(themeColors.accept)}
                    onClick={() => onStatusUpdate(orderId, "Accept")}
                >
                    Accept
                </CustomButton>
                <CustomButton
                    size={size}
                    sx={getButtonStyles(themeColors.decline)}
                    onClick={() => onStatusUpdate(orderId, "Decline")}
                >
                    Decline
                </CustomButton>
            </Stack>
        );
    }

    // Show Complete button for PREPARING status
    if (orderStatus === ORDER_STATUS.PREPARING) {
        return (
            <CustomButton
                size={size}
                sx={getButtonStyles(themeColors.black)}
                onClick={() => onStatusUpdate(orderId, "Complete")}
            >
                Complete
            </CustomButton>
        );
    }

    // Return null for other statuses (no buttons needed)
    return null;
};

export default OrderStatusButtons; 