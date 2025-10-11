import { Typography } from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";
import { TEXT_COLORS } from "../../../Constants";

const Section: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <CustomPaperWrapper>
    <Typography variant="h4" mb={1} sx={{ color: TEXT_COLORS.PRIMARY }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" mb={2} color="text.secondary">
        {subtitle}
      </Typography>
    )}
    {children}
  </CustomPaperWrapper>
);

export default Section;
