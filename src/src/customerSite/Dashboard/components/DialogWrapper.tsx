import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FONT_FAMILY } from "../../../Constants";

interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          py: 2,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 3,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
