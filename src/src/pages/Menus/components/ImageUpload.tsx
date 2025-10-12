import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { FONT_FAMILY } from "../../../Constants";

interface ImageUploadProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Check if running in React Native WebView
const isReactNativeWebView = () => {
  return !!(window as any).ReactNativeWebView;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen for messages from React Native
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.type === 'IMAGE_SELECTED' && data.imageData) {
          // Create a File object from base64 data
          const base64Data = data.imageData.split(',')[1] || data.imageData;
          const byteString = atob(base64Data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: data.mimeType || 'image/jpeg' });
          const file = new File([blob], data.fileName || 'image.jpg', { type: data.mimeType || 'image/jpeg' });

          // Create a synthetic event
          const syntheticEvent = {
            target: {
              files: [file]
            }
          } as unknown as React.ChangeEvent<HTMLInputElement>;

          onImageChange(syntheticEvent);
        }
      } catch (error) {
        console.error('Error handling image message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
  }, [onImageChange]);

  const handleBoxClick = () => {
    if (isReactNativeWebView()) {
      // Send message to React Native to open image picker
      (window as any).ReactNativeWebView.postMessage(JSON.stringify({
        type: 'OPEN_IMAGE_PICKER',
        timestamp: Date.now()
      }));
    } else {
      // Use standard file input for web
      fileInputRef.current?.click();
    }
  };

  return (
    <CustomPaperWrapper>
      <Typography variant="h4" mb={1} sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Upload Image
      </Typography>
      <Box
        onClick={handleBoxClick}
        sx={{
          display: "inline-block",
          width: "100%",
          height: 180,
          border: "2px dashed #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#f9f9f9",
        }}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#aaa",
            }}
          >
            Click to upload image
          </Typography>
        )}
        {/* Hidden file input for web fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onImageChange}
        />
      </Box>
    </CustomPaperWrapper>
  );
};

export default ImageUpload; 