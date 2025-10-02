import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HoursSelection from "./components/HoursSelection";
import { StickyBox } from "../../Styles";

interface DayHour {
  day: string;
  closed: boolean;
  open: Date | null;
  close: Date | null;
}

const defaultHours: DayHour[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({
  day,
  closed: false,
  open: new Date(0, 0, 0, 9, 0),
  close: new Date(0, 0, 0, 22, 0),
}));

const OpeningHours: React.FC = () => {
  const [hours, setHours] = useState<DayHour[]>(defaultHours);

  const handleChange = (
    index: number,
    field: keyof DayHour,
    value: Date | boolean
  ) => {
    const updated = [...hours];
    if (field === "closed") {
      updated[index].closed = value as boolean;
    } else if (field === "open") {
      updated[index].open = value as Date;
    } else if (field === "close") {
      updated[index].close = value as Date;
    }
    setHours(updated);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <StickyBox>
          <Typography variant="h3">Opening Hours</Typography>
        </StickyBox>

        <Box
          sx={{
            borderRadius: 2,
            p: 3,
            border: "1px solid #E5E7EB",
            m: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography variant="h4">Restaurant Hours</Typography>
          </Box>

          <HoursSelection hours={hours} handleChange={handleChange} />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default OpeningHours;
