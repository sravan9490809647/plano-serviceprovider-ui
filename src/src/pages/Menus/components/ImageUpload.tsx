import React from "react";
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

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageChange,
}) => {
  return (
    <CustomPaperWrapper>
      <Typography variant="h4" mb={1} sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Upload Image
      </Typography>
      <Box
        component="label"
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
        <input
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