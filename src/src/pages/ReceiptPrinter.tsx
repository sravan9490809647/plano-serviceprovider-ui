import React from "react";

const ReceiptPrinter: React.FC = () => {
    const handlePrint = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PRINT_SAMPLE" }));
        } else {
            // fallback for normal browsers
            window.print();
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Receipt Printing Demo</h2>
            <button
                onClick={handlePrint}
                style={{
                    padding: "10px 20px",
                    background: "#000",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Print Receipt
            </button>
        </div>
    );
};

export default ReceiptPrinter;
