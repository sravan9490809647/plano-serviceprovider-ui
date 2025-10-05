import React from 'react';
import { Box, Typography } from '@mui/material';
import { FONT_FAMILY } from '../Constants';

interface AllergiesDisplayProps {
    allergies?: string;
    title?: string;
    showTitle?: boolean;
    sx?: object;
}

const AllergiesDisplay: React.FC<AllergiesDisplayProps> = ({
    allergies,
    title = "Allergens",
    showTitle = true,
    sx = {},
}) => {
    // Parse allergies from JSON string or comma-separated string
    const parseAllergies = (allergiesString: string): string[] => {
        if (!allergiesString) return [];

        try {
            if (allergiesString.startsWith('[')) {
                // JSON format: "[\"Celery\",\"Milk\",...]"
                return JSON.parse(allergiesString);
            } else {
                // Comma-separated format: "Celery,Milk,Peanuts"
                return allergiesString.split(',').map(a => a.trim());
            }
        } catch (error) {
            console.error('Error parsing allergies:', error);
            // Fallback to comma-separated parsing
            return allergiesString.split(',').map(a => a.trim());
        }
    };

    const allergiesList = parseAllergies(allergies || '');

    if (!allergiesList.length) {
        return null;
    }

    return (
        <Box my={1} sx={sx}>
            {showTitle && (
                <Typography
                    variant="h6"
                    sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}
                >
                    {title}
                </Typography>
            )}
            <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                {allergiesList.map((allergy: string, idx: number) => (
                    <li key={idx}>{allergy}</li>
                ))}
            </ul>
        </Box>
    );
};

export default AllergiesDisplay;
