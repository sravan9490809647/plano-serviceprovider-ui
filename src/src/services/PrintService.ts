import { CURRENCY } from "../Constants";
import type { ReservedTableOrdersResponse } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatPrice } from "../utils/common";

interface PrintReceiptOptions {
    orderDetails: ReservedTableOrdersResponse;
    tableName: string;
    businessName: string;
}

interface ReceiptItem {
    title: string;
    quantity: number;
    totalPrice: number;
    customizations?: string;
}

interface ReceiptData {
    businessName: string;
    tableName: string;
    date: string;
    time: string;
    items: ReceiptItem[];
    totalAmount: number;
    currency: string;
}

export class PrintService {
    /**
     * Print a receipt by sending data to native app
     */
    static async printReceipt(options: PrintReceiptOptions): Promise<void> {
        try {
            // Prepare receipt data for native app
            const receiptData = this.prepareReceiptData(options);

            // Check if we're in React Native WebView
            if (window.ReactNativeWebView) {
                // Send receipt data to native app
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "PRINT_RECEIPT",
                    data: receiptData
                }));
                console.log("🖨️ Receipt data sent to native app:", receiptData);
            } else {
                // Fallback for web browsers
                console.log("🖨️ Web fallback - receipt data:", receiptData);
                this.printToBrowser(options);
            }
        } catch (error) {
            console.error("❌ Failed to print receipt:", error);
            throw error;
        }
    }

    /**
     * Download a receipt as PDF
     */
    static async downloadReceipt(options: PrintReceiptOptions): Promise<void> {
        try {
            // Create a temporary div element for the receipt
            const receiptDiv = this.createReceiptElement(options);
            document.body.appendChild(receiptDiv);

            // Convert HTML to canvas
            const canvas = await html2canvas(receiptDiv, {
                scale: 2,
                width: 250,
                height: receiptDiv.scrollHeight,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL("image/png");

            // Create PDF with thermal printer dimensions (80mm width)
            const pdf = new jsPDF("p", "mm", [80, 200]);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Add image to PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `receipt-${options.tableName.replace(/\s+/g, '-')}-${timestamp}.pdf`;

            // Download the PDF
            pdf.save(filename);

            // Clean up the temporary element
            document.body.removeChild(receiptDiv);
        } catch (error) {
            console.error("❌ Failed to download receipt:", error);
            throw error;
        }
    }

    /**
     * Prepare receipt data for native app
     */
    private static prepareReceiptData(options: PrintReceiptOptions): ReceiptData {
        const { orderDetails, tableName, businessName } = options;

        // Group all items by name and sum quantities
        const itemGroups = new Map<string, ReceiptItem>();

        orderDetails.forEach(order => {
            order.orderedItems.forEach(item => {
                const key = item.title;
                if (itemGroups.has(key)) {
                    const existing = itemGroups.get(key)!;
                    existing.quantity += item.quantity;
                    existing.totalPrice += item.totalPrice;
                } else {
                    itemGroups.set(key, {
                        title: item.title,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        customizations: item.removeIngredients && item.removeIngredients !== "[]"
                            ? item.removeIngredients
                            : undefined
                    });
                }
            });
        });

        // Calculate total amount
        const totalAmount = orderDetails.reduce((sum, order) => {
            return sum + (order.orderDetails?.totalPrice || 0);
        }, 0);

        // Get the order date and time from the first order (all orders should have the same date)
        const orderDate = orderDetails.length > 0 ? new Date(orderDetails[0].orderDetails.createdOn) : new Date();
        const date = orderDate.toLocaleDateString();
        const time = orderDate.toLocaleTimeString();

        return {
            businessName,
            tableName,
            date,
            time,
            items: Array.from(itemGroups.values()),
            totalAmount,
            currency: CURRENCY.symbol
        };
    }

    /**
     * Create a receipt element for PDF generation
     */
    private static createReceiptElement(options: PrintReceiptOptions): HTMLDivElement {
        const { orderDetails, tableName, businessName } = options;

        // Group all items by name and sum quantities
        const itemGroups = new Map();
        orderDetails.forEach(order => {
            order.orderedItems.forEach(item => {
                const key = item.title;
                if (itemGroups.has(key)) {
                    const existing = itemGroups.get(key);
                    existing.quantity += item.quantity;
                    existing.totalPrice += item.totalPrice;
                } else {
                    itemGroups.set(key, {
                        title: item.title,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        customizations: item.removeIngredients && item.removeIngredients !== "[]" ? item.removeIngredients : null
                    });
                }
            });
        });

        // Calculate total amount
        const totalAmount = orderDetails.reduce((sum, order) => {
            return sum + (order.orderDetails?.totalPrice || 0);
        }, 0);

        // Get the order date and time from the first order (all orders should have the same date)
        const orderDate = orderDetails.length > 0 ? new Date(orderDetails[0].orderDetails.createdOn) : new Date();
        const orderDateString = orderDate.toLocaleDateString();
        const orderTimeString = orderDate.toLocaleTimeString();

        const receiptDiv = document.createElement('div');
        receiptDiv.style.cssText = `
            width: 250px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            background: white;
            color: black;
            position: absolute;
            top: -9999px;
            left: -9999px;
        `;

        receiptDiv.innerHTML = `
            <h3 style="text-align: center; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">
                 ${businessName}
            </h3>
            <p style="text-align: center; font-weight: bold; margin: 0 0 10px 0; font-size: 10px;">
                Table: ${tableName}
            </p>
            <p style="text-align: center; margin: 0 0 10px 0; font-size: 9px;">
                Date: ${orderDateString} | Time: ${orderTimeString}
            </p>
            <hr style="border: none; border-top: 1px dashed #000; margin: 10px 0;" />
            
            ${Array.from(itemGroups.values()).map((item) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-weight: bold;">
                    <span>${item.quantity}x ${item.title}</span>
                    <span>${formatPrice(item.totalPrice)}</span>
                </div>
                ${item.customizations ? `
                    <div style="font-size: 10px; color: #666; margin-left: 10px; margin-bottom: 3px; font-style: italic;">
                        ${item.customizations}
                    </div>
                ` : ''}
            `).join('')}
            
            <hr style="border: none; border-top: 1px dashed #000; margin: 10px 0;" />
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
                <span>TOTAL</span>
                <span>${formatPrice(totalAmount)}</span>
            </div>
            <hr style="border: none; border-top: 1px dashed #000; margin: 10px 0;" />
            <p style="text-align: center; margin: 10px 0 0 0; font-size: 10px;">
                🙏 Thank you for dining with us!
            </p>
        `;

        return receiptDiv;
    }

    /**
     * Fallback to browser printing (for web browsers)
     */
    private static printToBrowser(options: PrintReceiptOptions): void {
        const { orderDetails, tableName, businessName } = options;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print the receipt');
            return;
        }

        // Group all items by name and sum quantities
        const itemGroups = new Map();
        orderDetails.forEach(order => {
            order.orderedItems.forEach(item => {
                const key = item.title;
                if (itemGroups.has(key)) {
                    const existing = itemGroups.get(key);
                    existing.quantity += item.quantity;
                    existing.totalPrice += item.totalPrice;
                } else {
                    itemGroups.set(key, {
                        title: item.title,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        customizations: item.removeIngredients && item.removeIngredients !== "[]" ? item.removeIngredients : null
                    });
                }
            });
        });

        // Calculate total amount
        const totalAmount = orderDetails.reduce((sum, order) => {
            return sum + (order.orderDetails?.totalPrice || 0);
        }, 0);

        // Get the order date and time from the first order
        const orderDate = orderDetails.length > 0 ? new Date(orderDetails[0].orderDetails.createdOn) : new Date();
        const orderDateString = orderDate.toLocaleDateString();
        const orderTimeString = orderDate.toLocaleTimeString();

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${tableName}</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        margin: 0;
                        padding: 15px;
                        font-size: 11px;
                        line-height: 1.3;
                        max-width: 80mm;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 1px dashed #000;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .restaurant-name {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 3px;
                    }
                    .table-info {
                        font-size: 12px;
                        margin-bottom: 3px;
                    }
                    .date-time {
                        font-size: 10px;
                        color: #666;
                    }
                    .item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 2px;
                    }
                    .item-details {
                        flex: 1;
                    }
                    .item-price {
                        text-align: right;
                        min-width: 50px;
                    }
                    .customization {
                        font-size: 9px;
                        color: #666;
                        margin-left: 8px;
                        font-style: italic;
                    }
                    .total {
                        border-top: 1px solid #000;
                        padding-top: 8px;
                        margin-top: 8px;
                        text-align: right;
                        font-weight: bold;
                        font-size: 13px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 12px;
                        padding-top: 8px;
                        border-top: 1px dashed #000;
                        font-size: 9px;
                        color: #666;
                    }
                    @media print {
                        body { 
                            margin: 0; 
                            max-width: 80mm;
                            width: 80mm;
                        }
                        .no-print { display: none; }
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="restaurant-name">${businessName}</div>
                    <div class="table-info">Table: ${tableName}</div>
                    <div class="date-time">Date: ${orderDateString} | Time: ${orderTimeString}</div>
                </div>

                ${Array.from(itemGroups.values()).map((item) => `
                    <div class="item">
                        <div class="item-details">
                            ${item.quantity} x ${item.title}
                            ${item.customizations ?
                `<div class="customization">${item.customizations}</div>` :
                ''
            }
                        </div>
                        <div class="item-price">${formatPrice(item.totalPrice)}</div>
                    </div>
                `).join('')}

                <div class="total">TOTAL: ${formatPrice(totalAmount)}</div>

                <div class="footer">
                    Thank you for dining with us!
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    }

    /**
     * Print a simple text receipt (legacy method for compatibility)
     */
    static printSimpleReceipt(options: PrintReceiptOptions): void {
        this.printToBrowser(options);
    }
} 