import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";

interface BusinessOptionCardProps {
  title: string;
  subtitle: string;
  question: string;
  description: string;
  value: string;
  onChange: (val: string) => void;
  yesLabel: string;
  noLabel: string;
  icon?: React.ReactNode;
}

const BusinessOptionCard: React.FC<BusinessOptionCardProps> = ({
  title,
  subtitle,
  question,
  description,
  value,
  onChange,
  yesLabel,
  noLabel,
  icon,
}) => {
  return (
    <CustomPaperWrapper>
      <Box display="flex" gap={1} alignItems="center">
        {icon}
        <Typography variant="h5" mb={1}>{title}</Typography>
      </Box>

      <Typography variant="body1" mb={2}>
        {subtitle}
      </Typography>

      <Typography variant="body2" mb={1}>
        ✅ {question}
      </Typography>

      <Typography variant="body2" mb={2}>
        {description}
      </Typography>

      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ pl: 1 }}
      >
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label={yesLabel}
          sx={{ mb: 1 }}
        />
        <FormControlLabel value="no" control={<Radio />} label={noLabel} />
      </RadioGroup>
    </CustomPaperWrapper>
  );
};

export default BusinessOptionCard;
