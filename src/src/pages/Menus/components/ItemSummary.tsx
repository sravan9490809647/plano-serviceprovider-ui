import React from "react";
import {
  Typography,
  Grid,
  type SelectChangeEvent,
} from "@mui/material";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import CustomButton from "../../../components/Button";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { FONT_FAMILY } from "../../../Constants";

interface ItemSummaryProps {
  formData: {
    itemName: string;
    description: string;
    price: string;
    categories: string[];
  };
  errors: {
    itemName: string;
    price: string;
    category: string;
  };
  categoryOptions: { value: string; label: string }[];
  onFormDataChange: (field: string, value: any) => void;
  onCategoryChange: (event: SelectChangeEvent<string | number | (string | number)[]>) => void;
  onAddCategory: () => void;
}

const ItemSummary: React.FC<ItemSummaryProps> = ({
  formData,
  errors,
  categoryOptions,
  onFormDataChange,
  onCategoryChange,
  onAddCategory,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  return (
    <CustomPaperWrapper>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Item Summary
      </Typography>
      <Typography variant="body1" mb={2}>
        Basic information about your menu item
      </Typography>

      <Input
        fullWidth
        label="Item Name"
        name="itemName"
        placeholder="e.g., Margherita Pizza"
        required
        value={formData.itemName}
        onChange={handleChange}
        error={!!errors.itemName}
        helperText={errors.itemName}
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2} alignItems={"center"}>
        <Grid item xs={12} sm={8}>
          <Select
            label="Select Categories"
            multiple
            value={formData.categories}
            onChange={onCategoryChange}
            options={categoryOptions}
            error={!!errors.category}
            helperText={errors.category}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomButton onClick={onAddCategory}>
            + Add New Category
          </CustomButton>
        </Grid>
      </Grid>

      <Input
        fullWidth
        label="Description (Optional)"
        name="description"
        multiline
        rows={3}
        placeholder="Describe your item..."
        value={formData.description}
        onChange={handleChange}
        sx={{ my: 2 }}
      />

      <Input
        fullWidth
        label="Price"
        name="price"
        type="number"
        placeholder="Enter price"
        required
        value={formData.price}
        onChange={handleChange}
        error={!!errors.price}
        helperText={errors.price}
        sx={{ mb: 2 }}
      />
    </CustomPaperWrapper>
  );
};

export default ItemSummary; 