import { Box, Stack, Typography } from "@mui/material";
import { StickyBox } from "../../../Styles";
import CustomButton from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import type React from "react";

interface IOfferHeader {
  title: string;
  description: string;
  steps: { label: string }[];
  currentStep: number;
  disabled?: boolean;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  onSubmit?: () => void;
}
const OfferHeader: React.FC<IOfferHeader> = ({
  title,
  description,
  steps,
  currentStep,
  disabled,
  handlePrevStep,
  handleNextStep,
  onSubmit,
}) => {
  const navigate = useNavigate();
  return (
    <StickyBox
      sx={{
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 1,
      }}
    >
      <Stack spacing={0.5} direction="row" alignItems="center">
        <CustomButton variant="text" onClick={() => navigate(-1)}>
          ← Back
        </CustomButton>
        <Box pl={2}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h6" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Stack>

      <Box
        display="flex"
        gap={1}
        sx={{
          mt: { xs: 1, md: 0 },
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "flex-end", md: "flex-end" },
        }}
      >
        {currentStep > 1 && (
          <CustomButton variant="text" onClick={handlePrevStep}>
            Back
          </CustomButton>
        )}
        {currentStep < steps.length && (
          <CustomButton onClick={handleNextStep} disabled={disabled}>
            Next
          </CustomButton>
        )}
        {currentStep === steps.length && (
          <CustomButton disabled={disabled} onClick={onSubmit}>
            Publish
          </CustomButton>
        )}
      </Box>
    </StickyBox>
  );
};

export default OfferHeader;
