import { Box, Typography, Grid } from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { CURRENCY, FONT_FAMILY } from "../../../Constants";

type Variation = {
  id: string;
  title: string;
  price: number;
};

interface VariationSelectorProps {
  variations?: Variation[];
  selectedVariation: Variation | null;
  setSelectedVariation: (v: Variation) => void;
}

const VariationSelector: React.FC<VariationSelectorProps> = ({
  variations,
  selectedVariation,
  setSelectedVariation,
}) => (
  <CustomPaperWrapper>
    <Typography variant="h5" mb={1} fontFamily={FONT_FAMILY.BOLD}>
      Choose Your Main Item
    </Typography>
    <Grid container spacing={1}>
      {variations?.map((v) => {
        const isSelected = selectedVariation?.id === v.id;
        return (
          <Grid item xs={12} md={6} key={v.id}>
            <Box
              onClick={() => setSelectedVariation(v)}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: isSelected ? "2px solid #f97316" : "1px solid #e5e7eb",
                bgcolor: isSelected ? "#fff7ed" : "white",
                ":hover": { borderColor: "#f97316" },
              }}
            >
              <Typography variant="h6" fontFamily={FONT_FAMILY.MEDIUM}>
                {v.title}
              </Typography>
              <Typography variant="h6" fontFamily={FONT_FAMILY.MEDIUM}>
                {CURRENCY.symbol}
                {v.price.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </CustomPaperWrapper>
);

export default VariationSelector;
