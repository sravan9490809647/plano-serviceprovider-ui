import React from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import Input from "../../../components/Input";
import CustomButton from "../../../components/Button";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { formatPrice } from "../../../utils/common";
import { FONT_FAMILY } from "../../../Constants";

interface ItemVariationsProps {
  variations: { name: string; price: string }[];
  newVariation: { name: string; price: string };
  editingVariationIndex: number;
  onFormDataChange: (field: string, value: any) => void;
  onAddVariation: () => void;
  onEditVariation: (index: number) => void;
  onRemoveVariation: (index: number) => void;
}

const ItemVariations: React.FC<ItemVariationsProps> = ({
  variations,
  newVariation,
  editingVariationIndex,
  onFormDataChange,
  onAddVariation,
  onEditVariation,
  onRemoveVariation,
}) => {
  return (
    <CustomPaperWrapper>
      <Typography variant="h4" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Item Variations&nbsp;
        <Typography variant="body1" component="span" color="text.secondary">
          (Add different sizes or styles e.g., Small, Medium, Large)
        </Typography>
      </Typography>

      {/* List of Variations */}
      <Grid container spacing={2} mt={1}>
        {variations.map((variation, index) => (
          <Grid item xs={12} key={index}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                bgcolor: "#FAFAFA",
                borderRadius: 2,
                p: 1,
                border: "1px solid #EEE",
              }}
            >
              <Grid item xs={12} sm={8}>
                <Typography variant="h4">
                  {variation.name} &nbsp;&nbsp;
                  <Typography
                    variant="h6"
                    component="span"
                    color="text.secondary"
                  >
                    {formatPrice(variation.price)}
                  </Typography>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                mt={{ xs: 1, sm: 0 }}
                gap={1}
              >
                <CustomButton
                  size="small"
                  onClick={() => onEditVariation(index)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  size="small"
                  variant="text"
                  color="error"
                  onClick={() => onRemoveVariation(index)}
                >
                  Remove
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Add Variation Form */}
      <Box
        mt={3}
        p={2}
        border="1px solid #E5E7EB"
        borderRadius={2}
        bgcolor="white"
      >
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          Add New Variation
        </Typography>
        <Grid container spacing={2} alignItems={"center"}>
          <Grid item xs={12} sm={6}>
            <Input
              fullWidth
              name="variationName"
              label="Variation Name"
              placeholder="Variation name"
              value={newVariation.name}
              onChange={(e) =>
                onFormDataChange("newVariation", {
                  ...newVariation,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Input
              fullWidth
              name="variationPrice"
              placeholder="Price"
              label="Price"
              type="number"
              value={newVariation.price}
              onChange={(e) =>
                onFormDataChange("newVariation", {
                  ...newVariation,
                  price: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomButton
              fullWidth
              onClick={onAddVariation}
              disabled={
                !newVariation.name.trim() ||
                !newVariation.price.trim()
              }
            >
              {editingVariationIndex >= 0 ? "Update" : "Add"}
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </CustomPaperWrapper>
  );
};

export default ItemVariations; 