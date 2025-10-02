import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../../../components/Button";

const FILTERS = {
  status: ["Preparing", "Ready", "Out for Delivery", "Finished", "Cancelled"],
  payment: ["Card", "Cash", "Store Payment"],
  service: ["Delivery", "Collection"],
};

interface FiltersPanelProps {
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (section: string, value: string) => void;
  onClear: () => void;
  onApply: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  onClose,
  selectedFilters,
  onFilterChange,
  onClear,
  onApply,
}) => {
  const renderSection = (label: string, key: keyof typeof FILTERS) => (
    <Box mb={2}>
      <Typography variant="body2" fontWeight={600} mb={1}>
        {label}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {FILTERS[key].map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            onClick={() => onFilterChange(key, item)}
            color={selectedFilters[key]?.includes(item) ? "primary" : "default"}
            variant={
              selectedFilters[key]?.includes(item) ? "filled" : "outlined"
            }
          />
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        width: 300,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={600}>Filter by</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {renderSection("Order Status", "status")}
      {renderSection("Payment Type", "payment")}
      {renderSection("Service Type", "service")}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent={"flex-end"} spacing={2}>
        <CustomButton
          variant="text"
          onClick={onClear}
          sx={{ padding: "8px 16px" }}
        >
          Clear
        </CustomButton>
        <CustomButton onClick={onApply} sx={{ padding: "8px 16px" }}>
          Apply
        </CustomButton>
      </Stack>
    </Box>
  );
};

export default FiltersPanel;
