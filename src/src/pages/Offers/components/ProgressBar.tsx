import { LinearProgress, Stack, Typography } from "@mui/material";

interface ProgressBar {
  steps: { label: string }[];
  currentStep: number;
}
const ProgressBar: React.FC<ProgressBar> = ({ currentStep, steps }) => {
  return (
    <Stack spacing={0.5} alignItems={"center"} mb={2}>
      <Typography variant="h6" sx={{ textAlign: "center" }} mb={2}>
        Step {currentStep} of {steps.length}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(currentStep / steps.length) * 100}
        sx={{ width: { xs: "100%", md: 300 }, mt: 0.5 }}
      />
    </Stack>
  );
};
export default ProgressBar;
