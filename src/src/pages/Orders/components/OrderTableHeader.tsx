import React from "react";
import { TableCell, TableHead, TableRow, Typography } from "@mui/material";

const TABLE_HEADERS = [
    "Order Code",
    // "Customer Name",
    // "Total",
    "Status",
    // "Date",
    "Time",
    "Table",
    "Actions"
];

const OrderTableHeader: React.FC = () => {
    return (
        <TableHead>
            <TableRow>
                {TABLE_HEADERS.map((header) => (
                    <TableCell key={header}>
                        <Typography variant="h5">
                            {header}
                        </Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default OrderTableHeader; 