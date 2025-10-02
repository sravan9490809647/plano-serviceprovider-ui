import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import QRCode from 'qrcode';
import DialogWrapper from './DialogWrapper';
import { toast } from 'react-toastify';

interface QRCodeDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    url: string;
    description?: string;
}

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
    open,
    onClose,
    title,
    url,
    description = "Scan this QR code to open the link",
}) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateQRCode = async () => {
        if (!url || url === '#') return;

        setIsGenerating(true);
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(url, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
            toast.error('Error generating QR code');
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (open && url) {
            generateQRCode();
        }
    }, [open, url]);

    const handleClose = () => {
        setQrCodeUrl('');
        onClose();
    };

    return (
        <DialogWrapper
            open={open}
            onClose={handleClose}
            title={title}
            cancelButtonText="Close"
        >
            <Box sx={{ textAlign: 'center', py: 2 }}>
                {isGenerating ? (
                    <Typography>Generating QR code...</Typography>
                ) : qrCodeUrl ? (
                    <Box>
                        <img
                            src={qrCodeUrl}
                            alt={`QR Code: ${title}`}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px'
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 2, color: '#6B7280' }}>
                            {description}
                        </Typography>
                    </Box>
                ) : (
                    <Typography color="error">
                        Failed to generate QR code
                    </Typography>
                )}
            </Box>
        </DialogWrapper>
    );
};

export default QRCodeDialog; 