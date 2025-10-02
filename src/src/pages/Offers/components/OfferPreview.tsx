import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";

interface OfferPreviewProps {
  icon: string;
  iconColor: string;
  previewTitle: string;
  mainValue: string;
  mainValueColor: string;
  subtitle: string;
  description: string;
  leftTag: string;
  rightTag: string;
}

const OfferPreview: React.FC<OfferPreviewProps> = ({
  icon,
  iconColor,
  previewTitle,
  mainValue,
  mainValueColor,
  subtitle,
  description,
  leftTag,
  rightTag,
}) => {
  return (
    <CustomPaperWrapper
      sx={{
        mt: 6,
        border: `1px solid ${iconColor}`,
        backgroundColor: `${iconColor}10`,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        sx={{ display: "flex", alignItems: "center", color: iconColor }}
      >
        <Box
          component="span"
          sx={{
            width: 32,
            height: 32,
            backgroundColor: iconColor,
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: "50%",
            mr: 1,
          }}
        >
          {icon}
        </Box>
        {previewTitle}
      </Typography>

      <CustomPaperWrapper
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: mainValueColor, fontWeight: 700 }}
        >
          {mainValue}
        </Typography>
        <Typography variant="h6" mb={2}>
          {subtitle}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: `${iconColor}10`,
            p: 1,
            borderRadius: 1,
            color: iconColor,
          }}
        >
          {description}
        </Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: `${iconColor}10`,
                borderRadius: 1,
                py: 1,
              }}
            >
              {leftTag}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: `${iconColor}10`,
                borderRadius: 1,
                py: 1,
              }}
            >
              {rightTag}
            </Typography>
          </Grid>
        </Grid>
      </CustomPaperWrapper>
    </CustomPaperWrapper>
  );
};

export default OfferPreview;
