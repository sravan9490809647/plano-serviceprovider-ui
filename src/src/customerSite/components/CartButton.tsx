import React from 'react';
import { Box, IconButton, styled } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface CartButtonProps {
    cartCount: number;
    onCartClick: () => void;
    showCart?: boolean;
}

const StyledCartButton = styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(1.5),
        right: theme.spacing(1.5),
    },
}));

const StyledIconButton = styled(IconButton)(({ }) => ({
    backgroundColor: "#FF6600",
    color: "white",
    width: 56,
    height: 56,
    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#e65c00",
        transform: "scale(1.05)",
        boxShadow: "0 6px 16px rgba(255, 102, 0, 0.4)",
    },
    "&:active": {
        transform: "scale(0.95)",
    },
}));

const CartBadge = styled(Box)(({ }) => ({
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff4444",
    color: "white",
    borderRadius: "50%",
    minWidth: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    border: "2px solid white",
}));

const CartButton: React.FC<CartButtonProps> = ({
    cartCount,
    onCartClick,
    showCart = true,
}) => {
    if (!showCart) return null;

    return (
        <StyledCartButton>
            <StyledIconButton onClick={onCartClick}>
                <ShoppingCartIcon sx={{ fontSize: 24 }} />
                {cartCount > 0 && (
                    <CartBadge>
                        {cartCount > 99 ? '99+' : cartCount}
                    </CartBadge>
                )}
            </StyledIconButton>
        </StyledCartButton>
    );
};

export default CartButton; 