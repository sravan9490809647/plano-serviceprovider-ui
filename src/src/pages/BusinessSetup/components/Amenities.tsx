import React from "react";
import { Grid, Checkbox, FormControlLabel, Box } from "@mui/material";
import Input from "../../../components/Input";
import CustomButton from "../../../components/Button";
import AddIcon from "@mui/icons-material/Add";
import { PredefinedAmenities } from "../../../Constants";

interface Props {
  amenities: string[];
  customAmenities: string[];
  customAmenity: string;
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomAmenity: React.Dispatch<React.SetStateAction<string>>;
}

const AmenitiesSection: React.FC<Props> = ({
  amenities,
  customAmenities,
  customAmenity,
  setAmenities,
  setCustomAmenities,
  setCustomAmenity,
}) => {
  const toggleAmenity = (value: string) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleCustomAmenity = (value: string) => {
    if (customAmenities.includes(value)) {
      setCustomAmenities((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleCustomAmenityAdd = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;

    if (!customAmenities.includes(trimmed)) {
      setCustomAmenities([...customAmenities, trimmed]);
    }
    setCustomAmenity("");
  };

  return (
    <>
      <Grid container spacing={1}>
        {PredefinedAmenities.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                />
              }
              label={item}
            />
          </Grid>
        ))}

        {customAmenities.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item}>
            <FormControlLabel
              control={
                <Checkbox checked onChange={() => toggleCustomAmenity(item)} />
              }
              label={item}
            />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" mt={2} gap={2} alignItems="center">
        <Input
          label="Custom Amenity"
          placeholder="Add custom amenity"
          value={customAmenity}
          onChange={(e) => setCustomAmenity(e.target.value)}
          fullWidth
        />
        <CustomButton
          disabled={!customAmenity?.trim()}
          onClick={handleCustomAmenityAdd}
          startIcon={<AddIcon fontSize="small" />}
        >
          Add
        </CustomButton>
      </Box>
    </>
  );
};

export default AmenitiesSection;
