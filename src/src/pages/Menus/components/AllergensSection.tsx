import React from 'react';
import {
    Typography,
    Grid,
} from '@mui/material';
import Checkbox from '../../../components/Checkbox';
import CustomPaperWrapper from '../../../components/CustomPaperWrapper';

interface AllergensSectionProps {
    selectedAllergies: string[];
    onAllergenChange: (allergen: string, checked: boolean) => void;
}

const ALLERGENS = [
    'Celery',
    'Cereals containing gluten (wheat, rye, barley, oats)',
    'Crustaceans (prawns, crabs)',
    'Eggs',
    'Fish',
    'Lupin',
    'Milk',
    'Molluscs (mussels, oysters)',
    'Mustard',
    'Peanuts',
    'Sesame',
    'Soybeans',
    'Sulphur dioxide and sulphites',
    'Tree nuts (almonds, hazelnuts, walnuts)',
];

const AllergensSection: React.FC<AllergensSectionProps> = ({
    selectedAllergies,
    onAllergenChange,
}) => {
    return (
        <CustomPaperWrapper>
            <Typography
                variant="h4"
                mb={1}
            >
                Allergens
            </Typography>

            <Typography
                variant="body2"
                mb={1}
            >
                Select all allergens present in this item
            </Typography>

            <Grid container spacing={1}>
                {ALLERGENS.map((allergen) => (
                    <Grid item xs={12} sm={6} md={4} key={allergen}>
                        <Checkbox
                            label={allergen}
                            checked={selectedAllergies.includes(allergen)}
                            onChange={(checked) => onAllergenChange(allergen, checked)}
                            sx={{
                                width: '100%',
                                '& .MuiFormControlLabel-root': {
                                    margin: 0,
                                    width: '100%',
                                },
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </CustomPaperWrapper>
    );
};

export default AllergensSection;
