import React from "react";
import {
  Typography,
  Grid,
} from "@mui/material";
import Input from "../../../components/Input";
import CustomButton from "../../../components/Button";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { FONT_FAMILY } from "../../../Constants";

interface IngredientsSectionProps {
  ingredients: string[];
  newIngredient: string;
  editingIndex: number;
  onFormDataChange: (field: string, value: any) => void;
  onAddIngredient: () => void;
  onEditIngredient: (index: number) => void;
  onRemoveIngredient: (index: number) => void;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  newIngredient,
  editingIndex,
  onFormDataChange,
  onAddIngredient,
  onEditIngredient,
  onRemoveIngredient,
}) => {
  return (
    <CustomPaperWrapper>
      <Typography variant="h4" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Included Ingredients{" "}
        <Typography variant="body1" component="span" color="text.secondary">
          (e.g., no onions, no sauce)
        </Typography>
      </Typography>

      {/* Ingredients List */}
      <Grid container spacing={2} mt={1} alignItems={"center"}>
        {ingredients.map((ingredient, index) => (
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
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">{ingredient}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                display="flex"
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                mt={{ xs: 1, sm: 0 }}
                gap={1}
              >
                <CustomButton
                  size="small"
                  onClick={() => onEditIngredient(index)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  size="small"
                  variant="text"
                  color="error"
                  onClick={() => onRemoveIngredient(index)}
                >
                  Remove
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Add Ingredient Input */}
      <Grid
        container
        spacing={2}
        mt={1}
        alignItems="center"
      >
        <Grid item xs={12} md={9}>
          <Input
            fullWidth
            name="newIngredient"
            label="New Ingredient"
            placeholder="Ingredient name (e.g., Lettuce, Tomato, Onions)"
            value={newIngredient}
            onChange={(e) =>
              onFormDataChange("newIngredient", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomButton
            fullWidth
            onClick={onAddIngredient}
            disabled={!newIngredient.trim()}
          >
            {editingIndex >= 0 ? "Update" : "Add"}
          </CustomButton>
        </Grid>
      </Grid>
    </CustomPaperWrapper>
  );
};

export default IngredientsSection; 