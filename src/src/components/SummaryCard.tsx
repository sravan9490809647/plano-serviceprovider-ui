import React from 'react';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import CustomPaperWrapper from './CustomPaperWrapper';

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    buttonText?: string;
    onButtonClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    buttonText,
    onButtonClick
}) => {
    return (
        <CustomPaperWrapper>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1.5,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}
                    >
                        {icon || <PeopleIcon sx={{ fontSize: 24 }} />}
                    </Box>
                    <Box>
                        <Typography
                            variant="h4"
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                        >
                            {value}
                        </Typography>
                    </Box>
                </Box>
                {buttonText && (
                    <Button
                        variant="contained"
                        onClick={onButtonClick}
                        sx={{ ml: 2 }}
                    >
                        {buttonText}
                    </Button>
                )}
            </Box>
        </CustomPaperWrapper>
    );
};

export default SummaryCard; 