import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { AWS_BUCKET_BASE_URL } from "../Constants";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileUploadBoxProps {
  id: string;
  label: string;
  note?: string;
  file: File | string | null;
  onChange: (file: File | null) => void;
  height?: number | string;
  width?: number | string;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  id,
  label,
  note,
  file,
  onChange,
  height = 200,
  width = "100%",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] || null);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const isUrl = typeof file === "string";
  const isFile = file instanceof File;

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      border="2px dashed #ccc"
      borderRadius={2}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        p: 2,
        backgroundColor: isDragging ? "#f0f0f0" : "transparent",
        transition: "background-color 0.2s",
        "&:hover .delete-btn": {
          opacity: 1,
        },
      }}
      height={height}
      width={width}
      onClick={() => document.getElementById(id)?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography variant="body2" mb={1}>
        {label}
      </Typography>

      {(isUrl || isFile) && (
        <Box position="relative" width="100%" height="100%">
          <img
            src={isUrl ? `${AWS_BUCKET_BASE_URL}${file}` : previewUrl || ""}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <IconButton
            size="small"
            onClick={handleClear}
            className="delete-btn"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.7)",
              },
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      )}

      {!file && (
        <>
          <Typography variant="body2" mt={1}>
            Click or drag & drop to upload
          </Typography>
          {note && (
            <Typography variant="caption" color="text.secondary">
              {note}
            </Typography>
          )}
        </>
      )}

      <input
        id={id}
        type="file"
        hidden
        onChange={handleFileInputChange}
        accept="image/*"
      />
    </Box>
  );
};

export default FileUploadBox;
