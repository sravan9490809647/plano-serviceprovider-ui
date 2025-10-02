import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { v4 as uuidv4 } from "uuid";
import CustomButton from "../../components/Button";
import { processMenuFiles } from "../../redux/reducers/MenusReducer";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Storage from "../../utils/Storage";
import Loader from "../../components/Loader";

interface UploadedFile {
  file: File;
  id: string;
  previewUrl: string;
}

const UploadZone = styled(Box)(({ theme }) => ({
  border: "2px dashed #d1d5db",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: "center",
  backgroundColor: "#fff",
  cursor: "pointer",
}));

const UploadedFileCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  cursor: "pointer",
}));

function SortableItem({
  file,
  onClick,
  onRemove,
}: {
  file: UploadedFile;
  onClick: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <UploadedFileCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      elevation={1}
    >
      <img
        src={file.previewUrl}
        alt={file.file.name}
        style={{
          width: 50,
          height: 50,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
      <Box ml={2} flexGrow={1}>
        <Typography>{file.file.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {(file.file.size / 1024 / 1024).toFixed(2)} MB
        </Typography>
      </Box>
      <CheckCircleIcon color="success" />
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <DeleteIcon color="error" />
      </IconButton>
    </UploadedFileCard>
  );
}

const MenuUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleFilesUpload = (files: FileList | null) => {
    if (!files) return;
    const fileList = Array.from(files);
    const deduped = fileList.filter(
      (file) =>
        !uploadedFiles.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        )
    );

    const newEntries: UploadedFile[] = deduped.map((file) => ({
      file,
      id: uuidv4(),
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...newEntries]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    const businessId = Storage.getItem("businessId");
    const files = uploadedFiles.map((item) => item.file);
    if (businessId) {
      setLoading(true);
      await processMenuFiles(files, businessId, navigate); // 👈 no dispatch
      setLoading(false);
    }
  };

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = uploadedFiles.findIndex((f) => f.id === active.id);
    const newIndex = uploadedFiles.findIndex((f) => f.id === over.id);
    setUploadedFiles((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <Box p={4} maxWidth="800px" mx="auto">
      {loading && <Loader />}
      <Stack direction={"row"} alignItems={"center"} gap={3}>
        <CustomButton variant="text" onClick={() => navigate(-1)}>
          ← Back
        </CustomButton>
        <Typography variant="h4" ml={1}>
          Upload Your Menu
        </Typography>
      </Stack>
      <Typography variant="body1" my={2}>
        Please upload your printed menu images in order. Use good lighting and
        avoid duplicates or blurry photos.
      </Typography>

      <UploadZone
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleBrowseClick}
      >
        <UploadFileIcon fontSize="large" color="action" />
        <Typography mt={1} variant="body1">
          Drag & drop your menu files here or <strong>browse files</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supports JPG, PNG, and PDF files
        </Typography>
        <input
          type="file"
          ref={inputRef}
          hidden
          multiple
          accept="image/png, image/jpeg, application/pdf"
          onChange={(e) => handleFilesUpload(e.target.files)}
        />
      </UploadZone>

      {uploadedFiles.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={uploadedFiles.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {uploadedFiles.map((file) => (
                <SortableItem
                  key={file.id}
                  file={file}
                  onClick={() => setPreviewUrl(file.previewUrl)}
                  onRemove={() => handleRemove(file.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Box>
      )}

      <Box mt={4} textAlign="center">
        <CustomButton
          disabled={uploadedFiles.length === 0}
          onClick={handleSubmit}
        >
          Process My Menu
        </CustomButton>
        <Typography variant="body2" display="block" mt={1}>
          This will digitize your menu using AI technology
        </Typography>
      </Box>

      <Dialog
        open={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        maxWidth="md"
      >
        <DialogContent>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MenuUpload;
