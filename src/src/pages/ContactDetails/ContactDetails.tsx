import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ContactInfoCard from "./components/ContactInfoCard";
import OpeningHoursDisplay from "./components/OpeningHoursDisplay";
import BusinessDescription from "./components/BusinessDescription";
import { StickyBox } from "../../Styles";

const ContactDetails: React.FC = () => {
  return (
    <Box>
      <StickyBox>
        <Typography variant="h3">Contact & Location Info</Typography>
      </StickyBox>
      <Stack p={3} spacing={2}>
        <ContactInfoCard />
        <OpeningHoursDisplay />
        <BusinessDescription />
      </Stack>
    </Box>
  );
};

export default ContactDetails;
