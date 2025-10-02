import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import { StickyBox } from '../Styles';
import CustomButton from './Button';

interface HeaderProps {
    title: string;
    buttonName?: string;
    buttonIcon?: React.ReactNode;
    onButtonClick?: () => void;
    showButton?: boolean;
    showNotifications?: boolean;
    notificationCounts?: {
        orders?: number;
        messages?: number;
        waiter?: number;
        checkOut?: number;
    };
    onNotificationClick?: (type: 'orders' | 'waiter' | 'checkOut') => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    buttonName,
    buttonIcon,
    onButtonClick,
    showButton = true,
    showNotifications = false,
    notificationCounts = {},
    onNotificationClick
}) => {
    return (
        <StickyBox sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 }
        }}>
            <Typography variant="h3">
                {title}
            </Typography>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" }
            }}>
                {showNotifications && (
                    <Box sx={{
                        display: "flex",
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: "wrap",
                        justifyContent: "center"
                    }}>
                        {[
                            {
                                key: 'orders',
                                label: 'Orders',
                                badgeColor: '#0f766e', // teal color
                                count: notificationCounts.orders || 0
                            },
                            {
                                key: 'waiter',
                                label: 'Waiter',
                                badgeColor: '#f87171', // light red/coral color
                                count: notificationCounts.waiter || 0
                            },
                            {
                                key: 'checkOut',
                                label: 'Check Out',
                                badgeColor: '#374151', // black/gray color
                                count: notificationCounts.checkOut || 0
                            },
                            {
                                key: 'messages',
                                label: 'Messages',
                                badgeColor: '#f59e0b', // yellow color
                                count: notificationCounts.messages || 0
                            },
                        ].map((notification) => (
                            <Badge
                                key={notification.key}
                                badgeContent={notification.count}
                                color="primary"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: notification.badgeColor,
                                        color: 'white'
                                    }
                                }}
                            >
                                <CustomButton
                                    onClick={() => onNotificationClick?.(notification.key as 'orders' | 'waiter' | 'checkOut')}
                                    variant="text"
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        padding: { xs: '4px 8px', sm: '6px 12px' },
                                        minWidth: { xs: 'auto', sm: 'auto' }
                                    }}
                                >
                                    {notification.label}
                                </CustomButton>
                            </Badge>
                        ))}
                    </Box>
                )}

                {showButton && buttonName && (
                    <CustomButton
                        onClick={onButtonClick || (() => { })}
                        variant="contained"
                        startIcon={buttonIcon}
                        sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            padding: { xs: '6px 12px', sm: '8px 16px' }
                        }}
                    >
                        {buttonName}
                    </CustomButton>
                )}
            </Box>
        </StickyBox>
    );
};

export default Header; 