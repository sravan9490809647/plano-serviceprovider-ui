import React, { useState } from 'react';
import {
    Box,
    Typography,
    Link,
    IconButton,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CustomPaperWrapper from './CustomPaperWrapper';
import QRCodeDialog from './QRCodeDialog';
import Storage from '../utils/Storage';
import { BASE_APPLICATION_URL, FONT_FAMILY } from '../Constants';

interface TableCardProps {
    tableNumber: number;
    tableName: string;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    qrEnabled: boolean;
    nfcEnabled: boolean;
    tableId?: string;
}

const TableCard: React.FC<TableCardProps> = ({
    tableNumber,
    tableName,
    tableId,
}) => {
    const businessId = Storage.getItem("businessId");
    const [qrDialogOpen, setQrDialogOpen] = useState(false);


    const handleLinkClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (!businessId || !tableId) {
            return;
        }
        window.open(`/${businessId}?tableId=${tableId}`, '_blank');
    };

    const handleQRCodeClick = () => {
        setQrDialogOpen(true);
    };

    const handleCloseQRDialog = () => {
        setQrDialogOpen(false);
    };

    return (
        <CustomPaperWrapper>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Table Number Badge */}
                    <Box
                        sx={{
                            width: 35,
                            height: 35,
                            borderRadius: '50%',
                            bgcolor: 'black',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}
                    >
                        {tableNumber}
                    </Box>

                    {/* Table Info */}
                    <Box>
                        <Typography variant="h5">
                            {tableName}
                        </Typography>
                        {/* Customer Site Link */}
                    </Box>
                </Box>

                {/* Right side controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* QR Code Button */}
                    <IconButton
                        onClick={handleQRCodeClick}
                        sx={{
                            color: '#2563EB',
                            '&:hover': {
                                backgroundColor: '#EFF6FF',
                            },
                        }}
                        title="Generate QR Code"
                    >
                        <QrCodeIcon />
                    </IconButton>

                    {/* <CustomSwitch
                        checked={false}
                    /> */}
                </Box>
            </Box>

            <Link
                onClick={handleLinkClick}
                sx={{
                    fontSize: '0.75rem',
                    color: '#2563EB',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#1D4ED8',
                    },
                    fontFamily: `${FONT_FAMILY.MEDIUM}`,
                }}
            >
                Table Order Link
            </Link>
            {/* QR Code Dialog */}
            {qrDialogOpen && (
                <QRCodeDialog
                    open={qrDialogOpen}
                    onClose={handleCloseQRDialog}
                    title={tableName}
                    url={`${BASE_APPLICATION_URL}${businessId}&tableId=${tableId}`}
                    description="Scan this QR code to open the table ordering page"
                />
            )}
        </CustomPaperWrapper>
    );
};

export default TableCard; 