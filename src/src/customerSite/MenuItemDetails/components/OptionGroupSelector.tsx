import { Alert, Box, Chip, Grid, Typography } from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { CURRENCY, FONT_FAMILY } from "../../../Constants";
import type { Option, OptionGroup } from "../../../types";

interface OptionGroupSelectorProps {
  group: {
    id: string;
    title: string;
    required: boolean;
    allowMultiple: boolean;
    options: Option[];
  };
  selectedOptions: OptionGroup[];
  onChange: (option: Option) => void;
}

const OptionGroupSelector: React.FC<OptionGroupSelectorProps> = ({
  group,
  selectedOptions,
  onChange,
}) => {
  const selectedGroup = selectedOptions.find((g) => g.id === group.id);

  const hasError =
    group.required && (!selectedGroup || selectedGroup.options.length === 0);

  return (
    <CustomPaperWrapper>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="h5" fontFamily={FONT_FAMILY.BOLD}>
          {group.title}
        </Typography>
        {group.required && <Chip label="Required" size="small" color="error" />}
      </Box>

      {hasError && (
        <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>
          You must select at least one option to continue
        </Alert>
      )}

      <Grid container spacing={1}>
        {group.options.map((opt) => {
          const isSelected =
            selectedGroup?.options.some((o) => o.id === opt.id) || false;

          return (
            <Grid item xs={12} md={6} key={opt.id}>
              <Box
                onClick={() => onChange(opt)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  borderRadius: 2,
                  border: isSelected
                    ? "2px solid #3b82f6"
                    : "1px solid #e5e7eb",
                  bgcolor: isSelected ? "#f0f7ff" : "white",
                }}
              >
                <Typography variant="h6" fontFamily={FONT_FAMILY.MEDIUM}>{opt.title}</Typography>
                <Typography
                  variant="h6"
                  fontFamily={FONT_FAMILY.MEDIUM}
                  color={opt.price >= 0 ? "green" : "error"}
                >
                  {opt.price >= 0 ? "+" : "-"}
                  {CURRENCY.symbol}
                  {Math.abs(opt.price).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </CustomPaperWrapper>
  );
};

export default OptionGroupSelector;
