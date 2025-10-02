import React from "react";
import { Box, Grid, Typography, Chip } from "@mui/material";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";

type Props = {
  qualifyingCategory: string;
  qualifyingItems: string[];
  freeCategories: {
    category: string;
    items: string[];
  }[];
};

const ReviewOfferStep: React.FC<Props> = ({
  qualifyingCategory,
  qualifyingItems,
  freeCategories,
}) => {
  return (
    <CustomPaperWrapper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Qualifying Items */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={1}>
            Qualifying Items
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            Category:
          </Typography>
          <Chip label={qualifyingCategory} sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" mb={1}>
            Selected Items ({qualifyingItems.length}):
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {qualifyingItems.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </Box>
        </Grid>

        {/* Free Items */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={1}>
            Free Items
          </Typography>

          {freeCategories.map(({ category, items }) => (
            <Box key={category} mb={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Category:
              </Typography>
              <Chip label={category} sx={{ mb: 1 }} />

              <Typography variant="body2" color="text.secondary" mb={1}>
                Selected Items ({items.length}):
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {items.map((item) => (
                  <Chip key={item} label={item} />
                ))}
              </Box>
            </Box>
          ))}
        </Grid>
      </Grid>

      <Box
        mt={3}
        p={2}
        sx={{
          backgroundColor: "rgba(66, 133, 244, 0.1)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          How it works:
        </Typography>
        <Typography variant="body2" color="primary">
          When customers purchase any qualifying item, they can choose from the
          selected free items at checkout.
        </Typography>
      </Box>
    </CustomPaperWrapper>
  );
};

export default ReviewOfferStep;
