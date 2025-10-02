import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "./Button"; // Import your custom Button component

interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  disableSubmit?: boolean;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  disableSubmit
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": {
          py: 2,
          borderRadius: 8,
          alignItems: "center",
        },
      }}
    >
      <DialogTitle variant="h4" sx={{ textAlign: "center" }}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          {cancelButtonText}
        </Button>
        {onSubmit && <Button disabled={disableSubmit} onClick={onSubmit}>{submitButtonText}</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default DialogWrapper;
