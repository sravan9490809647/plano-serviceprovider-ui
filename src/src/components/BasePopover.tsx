import React from "react";
import { Popover, type PopoverProps } from "@mui/material";

interface BasePopoverProps
  extends Omit<PopoverProps, "open" | "anchorEl" | "onClose" | "children"> {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}

const BasePopover: React.FC<BasePopoverProps> = ({
  open,
  anchorEl,
  onClose,
  children,
  ...rest
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: { width: 200, p: 1, borderRadius: 2 },
      }}
      {...rest}
    >
      {children}
    </Popover>
  );
};

export default BasePopover;
