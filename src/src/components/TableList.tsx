import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TableCard from './TableCard';
import CustomPaperWrapper from './CustomPaperWrapper';
import type { Table } from '../types';

interface TableListProps {
    title?: string;
    maxHeight?: string;
    tables: Table[]
}

const TableList: React.FC<TableListProps> = ({
    title = "Tables",
    maxHeight = 'calc(100vh - 300px)',
    tables
}) => {
    return (
        <CustomPaperWrapper sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Box sx={{
                maxHeight,
                overflowY: 'auto',
                pr: 1
            }}>
                <Grid container spacing={2}>
                    {tables.map((table) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
                            <TableCard
                                key={table.id}
                                tableId={table.id}
                                tableNumber={table.tableNumber}
                                tableName={table.tableName}
                                status={table.isOccupied ? 'occupied' : 'available'}
                                qrEnabled={true}
                                nfcEnabled={true}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </CustomPaperWrapper>
    );
};

export default TableList; 