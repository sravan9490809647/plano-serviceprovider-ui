import React, { useState } from 'react';

import { Box, Typography, List, ListItem, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDateTime } from '../../../utils/dateUtils';
import type { TableMessages, TableWithMessages } from '../../../types';
import ApiService from '../../../services/ApiService';
import { ENDPOINTS } from '../../../Constants';
import { toast } from 'react-toastify';
import Loader from '../../../components/Loader';
import CustomPaperWrapper from '../../../components/CustomPaperWrapper';
import Header from './Header';

const CONTAINER_HEIGHT = "calc(100vh - 120px)";

interface TableMessagesProps {
    messages: TableWithMessages[];
    onClose: () => void;
}

const TableMessages: React.FC<TableMessagesProps> = ({ messages, onClose }) => {
    const [selectedTable, setSelectedTable] = useState<TableWithMessages | null>(null);
    const [tableMessages, setTableMessages] = useState<TableMessages[]>([]);
    const [loading, setLoading] = useState(false);

    const onMessageClick = async (table: TableWithMessages) => {
        try {
            setLoading(true);
            const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.GET_TABLE_MESSAGES}${table.tableId}`);
            if (response && response.status === 0) {
                toast.error(response.message);
                return;
            }
            if (response && response.length > 0) {
                setTableMessages(response);
                setSelectedTable(table);
            }
        } catch (error) {
            toast.error("Failed to fetch table messages");
        } finally {
            setLoading(false);
        }
    };

    if (selectedTable && tableMessages.length > 0) {
        return (
            <CustomPaperWrapper sx={{
                height: CONTAINER_HEIGHT,
                display: "flex",
                flexDirection: "column"
            }}>
                <Box sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <IconButton onClick={() => setSelectedTable(null)} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography variant="h6">
                        {selectedTable.tableName}
                    </Typography>
                </Box>


                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                }}>
                    {tableMessages.map((message) => (
                        <ChatBubble key={message.id}>
                            <MessageText>
                                {message.message}
                            </MessageText>

                            <Box display="flex" alignItems="center">
                                <Timestamp>
                                    {formatDateTime(message.createdOn, 'HH:mm A')}
                                </Timestamp>
                            </Box>
                        </ChatBubble>
                    ))}
                </Box>
            </CustomPaperWrapper>
        );
    }


    return (
        <CustomPaperWrapper sx={{
            height: CONTAINER_HEIGHT,
            display: "flex",
            flexDirection: "column"
        }}>
            <Header
                title="Table Messages"
                length={messages?.length}
                onClose={onClose}
            />
            {loading && (<Loader />)}

            <List sx={{ width: '100%', p: 0, borderTop: "1px solid #e0e0e0" }}>
                {messages.map((item: TableWithMessages) => (
                    <StyledListItem key={item.tableId} onClick={() => onMessageClick(item)}>
                        <Box sx={{ width: '100%' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" component="span" fontWeight="bold">
                                    {item.tableName}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {formatDateTime(item.lastMessage.createdOn, 'DD/MM/YYYY HH:mm')}
                                </Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '75%'
                                    }}
                                >
                                    {item.lastMessage.message}
                                </Typography>
                            </Box>
                        </Box>
                    </StyledListItem>
                ))}
            </List>
        </CustomPaperWrapper>
    );
};


export default TableMessages;


const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer'
    },
    padding: theme.spacing(2)
}));


const ChatBubble = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    borderRadius: '18px',
    border: `1px solid ${theme.palette.divider}`,
    padding: '8px 12px',
    margin: '4px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '120px',
}));


const MessageText = styled(Typography)(({ theme }) => ({
    color: theme.palette.common.black,
    fontSize: '14px',
    fontWeight: 400,
    marginRight: '8px'
}));


const Timestamp = styled(Typography)(({ theme }) => ({
    color: theme.palette.common.black,
    fontSize: '12px',
    fontWeight: 400
}));
