import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Input from "../../../components/Input";
import { CustomSwitch } from "../../../Styles";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import CustomPaperWrapper from "../../../components/CustomPaperWrapper";

const libraries: "places"[] = ["places"];

const BusinessLocation: React.FC = () => {
  const [showMap, setShowMap] = useState(true);
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!, // Or process.env
    libraries,
  });

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || "");
      if (place.geometry?.location) {
        setLatLng({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  if (!isLoaded)
    return <Typography variant="h6">Loading Google Maps…</Typography>;
  if (loadError)
    return <Typography variant="h6">Error loading Maps</Typography>;

  return (
    <Box>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          label="Search for your business address"
          placeholder="Start typing your address…"
          fullWidth
          sx={{ mb: 2 }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Autocomplete>

      <Typography variant="body2" mb={1} color="text.secondary">
        Google Places autocomplete will help you find the exact location
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <CustomSwitch
          checked={showMap}
          onChange={() => setShowMap((prev) => !prev)}
        />
        <Typography variant="body2" fontWeight={600} ml={1}>
          Show location on map
        </Typography>
      </Box>

      {showMap && (
        <CustomPaperWrapper
          sx={{
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
            borderStyle: "dashed",
          }}
        >
          <Box textAlign="center">
            <Typography variant="h6">Google Map Pin Drop</Typography>
            <Typography variant="body2">
              Lat: {latLng?.lat ?? "-"}, Lng: {latLng?.lng ?? "-"}
            </Typography>
          </Box>
        </CustomPaperWrapper>
      )}
    </Box>
  );
};

export default BusinessLocation;
