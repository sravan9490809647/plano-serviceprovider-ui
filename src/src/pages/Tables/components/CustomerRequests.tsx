import React from "react";
import DataList from "./DataList";
import type { TableWithMessages } from "../../../types";

interface CustomerRequestsProps {
    requests: TableWithMessages[];
    onConfirm?: (tableId: string | number, requestType: 'waiter' | 'checkout', source: 'notification') => void;
    onClose?: () => void;
}

const CustomerRequests: React.FC<CustomerRequestsProps> = ({
    requests,
    onConfirm,
    onClose,
}) => {
    return (
        <DataList
            title="Customer Requests"
            data={requests}
            onConfirm={(tableId, requestType) => onConfirm?.(tableId, requestType, "notification")}
            onClose={onClose}
        />
    );
};

export default CustomerRequests; 