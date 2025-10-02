import { Box, Grid, Typography } from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { FONT_FAMILY } from "../../../Constants";

interface IngredientsCustomizerProps {
  ingredients?: string[];
  removedIngredients: string[];
  setRemovedIngredients: (ings: string[]) => void;
}

const IngredientsCustomizer: React.FC<IngredientsCustomizerProps> = ({
  ingredients,
  removedIngredients,
  setRemovedIngredients,
}) => {
  const toggle = (ing: string) => {
    const newState = removedIngredients.includes(ing)
      ? removedIngredients.filter((i) => i !== ing)
      : [...removedIngredients, ing];

    setRemovedIngredients(newState);
  };

  return (
    <CustomPaperWrapper>
      <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>
        Customize Ingredients
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Toggle off ingredients you don't want
      </Typography>

      <Grid container spacing={1}>
        {ingredients?.map((ing) => {
          const isRemoved = removedIngredients.includes(ing);
          return (
            <Grid item xs={12} md={4} key={ing}>
              <Box
                onClick={() => toggle(ing)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 2,
                  bgcolor: isRemoved ? "#fef2f2" : "#ecfdf5",
                  border: `2px solid ${isRemoved ? "#ef4444" : "#22c55e"}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontFamily={FONT_FAMILY.MEDIUM}
                  color={isRemoved ? "error.main" : "success.main"}
                >
                  {ing}
                </Typography>
                <Typography
                  variant="body2"
                  color={isRemoved ? "error.main" : "success.main"}
                >
                  {isRemoved ? "Removed" : "Included"}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </CustomPaperWrapper>
  );
};

export default IngredientsCustomizer;
