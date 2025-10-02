declare global {
    interface PrinterIO {
        open(ip: string, port: number): void;
        close(): void;
        onopen?: () => void;
        onclose?: () => void;
        onerror?: (err: any) => void;
    }

    interface Window {
        createWebSocketIO: () => PrinterIO;
        POS_Reset: (io: PrinterIO) => void;
        POS_TextOut: (
            io: PrinterIO,
            text: string,
            alignment: number,
            bold: number,
            doubleWidth: number,
            doubleHeight: number,
            font: number
        ) => void;
        POS_FeedLine: (io: PrinterIO) => void;
        POS_FeedAndCutPaper: (io: PrinterIO) => void;
    }
}

export { };
