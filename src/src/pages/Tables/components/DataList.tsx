import React from "react";

import {
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    Divider,
    Grid,
} from "@mui/material";

import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import CustomButton from "../../../components/Button";
import { formatDateTime } from "../../../utils/dateUtils";

import { DEFAULT_DATE_TIME_FORMAT } from "../../../Constants";

import type { DataItem, WaiterRequestItem, CheckoutRequestItem } from "../../../types";
import Header from "./Header";


interface DataListProps {
    title: string;
    data: DataItem[];
    onConfirm?: (tableId: string, requestType: 'waiter' | 'checkout') => void;
    onClose?: () => void;
}


// Constants
const CONTAINER_HEIGHT = "calc(100vh - 120px)";

const AVATAR_SIZE = 32;
const BUTTON_COLORS = {
    waiter: {
        backgroundColor: '#F44336',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#D32F2F',
        }
    },
    checkout: {
        backgroundColor: '#000000',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#000000',
        }
    }
};


const DataList: React.FC<DataListProps> = ({
    title,
    data,
    onConfirm,
    onClose
}) => {
    const isWaiterRequest = (item: DataItem): item is WaiterRequestItem => {
        return 'waiterRequestId' in item;
    };
    const isCheckoutRequest = (item: DataItem): item is CheckoutRequestItem => {
        return 'checkOutRequestId' in item;
    };

    return (
        <Grid item xs={12}>
            <CustomPaperWrapper sx={{
                height: CONTAINER_HEIGHT,
                display: "flex",
                flexDirection: "column"
            }}>
                <Header
                    title={title}
                    length={data?.length}
                    onClose={onClose}
                />


                <List sx={{ overflow: "auto", flex: 1, borderTop: "1px solid #e0e0e0" }}>
                    {(data || []).map((item, index) => {
                        return (
                            <React.Fragment key={`${item.tableId}-${index}`}>
                                <ListItem sx={{
                                    px: 0,
                                    flexDirection: "column",
                                    alignItems: "stretch"
                                }}>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <Avatar
                                            sx={{
                                                bgcolor: "#000",
                                                width: AVATAR_SIZE,
                                                height: AVATAR_SIZE,
                                                mr: 1,
                                                borderRadius: "20%",
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {item.tableName.charAt(0)}
                                            </Typography>
                                        </Avatar>

                                        <Box flex={1}>
                                            {/* First Row: Table Name and Date */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h5">
                                                    {item.tableName}
                                                </Typography>

                                                <Typography variant="h6">
                                                    {formatDateTime(item.requestedTime, DEFAULT_DATE_TIME_FORMAT)}
                                                </Typography>
                                            </Box>

                                            {/* Second Row: Message and Button */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                                <Typography variant="h6" sx={{ color: "#666" }}>
                                                    {item.description}
                                                </Typography>

                                                {!item.isAttended && (
                                                    <Box>
                                                        {isWaiterRequest(item) && (
                                                            <CustomButton
                                                                onClick={() => onConfirm?.(item.tableId, 'waiter')}
                                                                sx={BUTTON_COLORS.waiter}
                                                            >
                                                                Confirm Waiter
                                                            </CustomButton>
                                                        )}

                                                        {isCheckoutRequest(item) && (
                                                            <CustomButton
                                                                onClick={() => onConfirm?.(item.tableId, 'checkout')}
                                                                sx={BUTTON_COLORS.checkout}
                                                            >
                                                                Confirm Checkout
                                                            </CustomButton>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </ListItem>

                                {index < data.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </List>
            </CustomPaperWrapper>
        </Grid>
    );
};


export default DataList; 