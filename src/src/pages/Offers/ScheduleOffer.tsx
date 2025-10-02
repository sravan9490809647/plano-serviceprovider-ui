import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import TimePickerField from "../../components/TimePicker";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CustomButton from "../../components/Button";
import CustomDatePicker from "../../components/DatePicker";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ScheduleOfferProps {
  startDate: Date | null;
  endDate: Date | null;
  startTime: Date;
  endTime: Date;
  repeatWeekly: boolean;
  selectedDays: string[];
  selectedPreset: string;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onStartTimeChange: (time: Date) => void;
  onEndTimeChange: (time: Date) => void;
  onRepeatWeeklyChange: (checked: boolean) => void;
  onDayToggle: (day: string) => void;
  onSelectAll: () => void;
  onSelectWeekdays: () => void;
  onSelectWeekends: () => void;
}

const ScheduleOffer: React.FC<ScheduleOfferProps> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  repeatWeekly,
  selectedDays,
  selectedPreset,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onRepeatWeeklyChange,
  onDayToggle,
  onSelectAll,
  onSelectWeekdays,
  onSelectWeekends,
}) => {
  const theme = useTheme();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CustomPaperWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography fontWeight={600} mb={1}>
                📅 Start Date & Time
              </Typography>
              <CustomDatePicker
                label="Start Date"
                value={startDate}
                onChange={onStartDateChange}
                minDate={!startDate ? new Date() : undefined}
              />
              <Box mt={2}>
                <TimePickerField
                  label="Start Time"
                  value={startTime}
                  onChange={onStartTimeChange}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography fontWeight={600} mb={1}>
                📅 End Date & Time
              </Typography>
              <CustomDatePicker
                label="End Date"
                value={endDate}
                minDate={startDate || new Date()}
                onChange={onEndDateChange}
              />
              <Box mt={2}>
                <TimePickerField
                  label="End Time"
                  value={endTime}
                  onChange={onEndTimeChange}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          mt={3}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography fontWeight={600} mb={1}>
            🔄 Weekly Recurring Schedule
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={repeatWeekly}
                onChange={(e) => onRepeatWeeklyChange(e.target.checked)}
              />
            }
            label="Repeat this offer every week on the same days"
          />
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            <CustomButton
              onClick={onSelectAll}
              variant={selectedPreset === "all" ? "contained" : "text"}
            >
              Select All
            </CustomButton>
            <CustomButton
              onClick={onSelectWeekdays}
              variant={selectedPreset === "weekdays" ? "contained" : "text"}
            >
              Weekdays
            </CustomButton>
            <CustomButton
              onClick={onSelectWeekends}
              variant={selectedPreset === "weekends" ? "contained" : "text"}
            >
              Weekends
            </CustomButton>
          </Stack>

          <Grid container spacing={1} mt={2}>
            {WEEK_DAYS.map((day) => (
              <Grid item xs={4} sm={3} md={1.5} key={day}>
                <CustomButton
                  variant={selectedDays.includes(day) ? "contained" : "text"}
                  onClick={() => onDayToggle(day)}
                  sx={{
                    width: "100%",
                    height: 40,
                    fontSize: 12,
                    textTransform: "none",
                  }}
                >
                  {day}
                </CustomButton>
              </Grid>
            ))}
          </Grid>

          <Typography mt={1} fontSize={14} color={theme.palette.error.main}>
            Selected days: {selectedDays.join(", ") || "None"}
          </Typography>
        </Box>

        <Box
          mt={3}
          sx={{
            backgroundColor: "#F0F7FF",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography fontWeight={600}>
            ℹ️ Schedule your offer to run automatically
          </Typography>
          <Typography fontSize={14}>
            Your offer will run every week on the selected days between the
            specified times until the end date.
          </Typography>
        </Box>
      </CustomPaperWrapper>
    </LocalizationProvider>
  );
};

export default ScheduleOffer;
