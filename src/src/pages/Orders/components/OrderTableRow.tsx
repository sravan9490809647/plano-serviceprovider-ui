import React from "react";
import {
    TableCell,
    TableRow,
    Typography,
    Stack,
} from "@mui/material";
import type { Order } from "../../../redux/reducers/OrdersReducer";
import { formatDateTime } from "../../../utils/dateUtils";
import { DEFAULT_TIME_FORMAT, ORDER_STATUS } from "../../../Constants";
import { themeColors } from "../../../utils/colors";
import OrderStatusButtons from "./OrderStatusButtons";
import StatusText from "./StatusText";

interface OrderTableRowProps {
    order: Order;
    onActionsClick: (event: React.MouseEvent<HTMLElement>) => void;
    onOrderClick: () => void;
    handleOrderStatusUpdate: (id: string, status: string) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
    order,
    onOrderClick,
    handleOrderStatusUpdate
}) => {
    const isOrderedStatus = order.orderStatus === ORDER_STATUS.ORDERED;
    const isPreparingStatus = order.orderStatus === ORDER_STATUS.PREPARING;

    const rowStyle = isOrderedStatus ? {
        backgroundColor: themeColors.black,
        color: themeColors.white,
    } : isPreparingStatus ? {
        backgroundColor: themeColors.preparing,
        color: themeColors.black,
        "&:hover": {
            backgroundColor: themeColors.preparingHover,
        },
    } : {};

    const textStyle = isOrderedStatus ? {
        color: themeColors.white,
    } : {};

    return (
        <TableRow sx={rowStyle}>
            <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        variant="body2"
                        onClick={onOrderClick}
                        sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            ...textStyle
                        }}
                    >
                        {order.orderCode}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <StatusText status={order.orderStatus} />
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={textStyle}>
                    {formatDateTime(order.createdOn, DEFAULT_TIME_FORMAT)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={textStyle}>
                    {order.tableName || "N/A"}
                </Typography>
            </TableCell>
            <TableCell>
                <OrderStatusButtons
                    orderId={order.id}
                    orderStatus={order.orderStatus}
                    onStatusUpdate={handleOrderStatusUpdate}
                    size="small"
                    variant="table"
                />
            </TableCell>
        </TableRow>
    );
};

export default OrderTableRow; 