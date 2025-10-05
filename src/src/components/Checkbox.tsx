import React from 'react';
import {
    FormControlLabel,
    Checkbox as MuiCheckbox,
    Typography,
} from '@mui/material';
import { FONT_FAMILY } from '../Constants';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'default';
    size?: 'small' | 'medium';
    sx?: object;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    disabled = false,
    color = 'primary',
    size = 'medium',
    sx = {},
}) => {
    return (
        <FormControlLabel
            control={
                <MuiCheckbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    color={color}
                    size={size}
                    sx={{
                        '&.Mui-checked': {
                            color: (theme) => theme.palette.primary.main,
                        },
                        '&.Mui-disabled': {
                            color: '#ccc',
                        },
                    }}
                />
            }
            label={
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: FONT_FAMILY.REGULAR,
                        color: '#333',
                        fontSize: '14px',
                    }}
                >
                    {label}
                </Typography>
            }
            sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': {
                    marginLeft: '8px',
                },
                ...sx,
            }}
        />
    );
};

export default Checkbox;
