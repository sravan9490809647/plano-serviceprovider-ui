import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { fetchTables } from '../redux/reducers/TablesReducer';
import DialogWrapper from './DialogWrapper';
import Input from './Input';
import ApiService from '../services/ApiService';
import { ENDPOINTS } from '../Constants';
import Storage from '../utils/Storage';
import Loader from './Loader';

interface AddTablesDialogProps {
    open: boolean;
    onClose: () => void;
}

const AddTablesDialog: React.FC<AddTablesDialogProps> = ({
    open,
    onClose
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [newTablesCount, setNewTablesCount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddTables = async () => {
        if (!newTablesCount || parseInt(newTablesCount) <= 0) {
            setError('Please enter a valid number of tables (at least 1)');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const businessId = Storage.getItem("businessId");
            if (!businessId) {
                setError('Business ID not found. Please login again.');
                return;
            }
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.ADD_TABLES}?BusinessId=${businessId}&TableCount=${newTablesCount}`);
            if (response.status === 1) {
                dispatch(fetchTables(businessId));
                onClose();
                setNewTablesCount('');
            } else {
                setError(response.message || 'Failed to add tables');
            }
        } catch (error) {
            setError('Failed to add tables. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setNewTablesCount('');
        setError('');
    };

    return (
        <DialogWrapper
            open={open}
            onClose={handleClose}
            title="+ Add More Tables"
            onSubmit={handleAddTables}
            submitButtonText={loading ? 'Adding...' : `Add ${newTablesCount ? parseInt(newTablesCount) : ""} Table${parseInt(newTablesCount) > 1 ? 's' : ''}`}
            cancelButtonText="Cancel"
            disableSubmit={loading}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                    How many more tables you want to add?
                </Typography>

                <Input
                    type="number"
                    placeholder='Enter number of tables'
                    value={newTablesCount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTablesCount(e.target.value)}
                    error={!!error}
                    helperText={error}
                    inputProps={{ min: 1 }}
                    fullWidth
                    sx={{ mt: 1 }}
                />
            </Box>
        </DialogWrapper>
    );
};

export default AddTablesDialog; 