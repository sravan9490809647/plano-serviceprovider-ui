import React from "react";
import { Grid } from "@mui/material";
import FileUploadBox from "../../../components/FileUploadBox";
import type { BrandAssetsState } from "../../../types";

interface IBrandAssetsSectionProps {
  brands: BrandAssetsState;
  setBrands: React.Dispatch<React.SetStateAction<BrandAssetsState>>;
}

const BrandAssetsSection: React.FC<IBrandAssetsSectionProps> = ({
  brands,
  setBrands,
}) => {
  const handleFileChange = (
    field: keyof BrandAssetsState,
    file: File | null
  ) => {
    setBrands((prev) => ({ ...prev, [field]: file }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FileUploadBox
          id="logo-upload"
          label="Business Logo"
          note="Square format recommended"
          file={brands.logo}
          onChange={(file) => handleFileChange("logo", file)}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FileUploadBox
          id="banner-upload"
          label="Cover Banner"
          note="Wide format recommended"
          file={brands.banner}
          onChange={(file) => handleFileChange("banner", file)}
        />
      </Grid>
    </Grid>
  );
};

export default BrandAssetsSection;
