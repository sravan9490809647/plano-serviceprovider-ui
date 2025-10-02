import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import Header from '../../components/Header';
import SummaryCard from '../../components/SummaryCard';
import TableList from '../../components/TableList';
import AddTablesDialog from '../../components/AddTablesDialog';
import Storage from '../../utils/Storage';
import { fetchTables } from '../../redux/reducers/TablesReducer';

const ManageTables: React.FC = () => {
    const { tables } = useSelector((state: RootState) => state.tables);
    const dispatch = useDispatch<AppDispatch>();

    const [addTablesDialogOpen, setAddTablesDialogOpen] = useState(false);
    useEffect(() => {
        const businessId = Storage.getItem("businessId");
        if (businessId) {
            dispatch(fetchTables(businessId));
        }
    }, [dispatch]);
    return (
        <Box>
            <Header
                title="Manage Tables"
                showButton={false}
            />

            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SummaryCard
                            title="Total Tables"
                            value={tables.length}
                            buttonText="Add More Tables"
                            onButtonClick={() => setAddTablesDialogOpen(true)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TableList
                            title="Existing Tables"
                            tables={tables}
                        />
                    </Grid>
                </Grid>
            </Box>

            <AddTablesDialog
                open={addTablesDialogOpen}
                onClose={() => setAddTablesDialogOpen(false)}
            />
        </Box>
    );
};

export default ManageTables; 