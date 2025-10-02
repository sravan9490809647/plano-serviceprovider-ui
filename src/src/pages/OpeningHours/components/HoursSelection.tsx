import React from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import type { DayHour } from "../../../types";
import TimePickerField from "../../../components/TimePicker";

interface IHoursSelectionProps {
  hours: DayHour[];
  handleChange: (
    idx: number,
    field: keyof DayHour,
    value: boolean | Date
  ) => void;
}

const HoursSelection: React.FC<IHoursSelectionProps> = ({
  hours,
  handleChange,
}) => {
  return (
    <div>
      {hours.map((dayData, idx) => (
        <Grid
          container
          key={dayData.day}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            my: 2,
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            p: 2,
          }}
        >
          {/* Left Side */}
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
              {dayData.day}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dayData.closed}
                  onChange={(e) =>
                    handleChange(idx, "closed", e.target.checked)
                  }
                />
              }
              label="Closed"
            />
          </Grid>

          {/* Right Side */}
          {dayData.closed ? (
            <Grid item xs={12} md={8} display="flex" justifyContent="flex-end">
              <Typography color="error" fontWeight={600}>
                Closed
              </Typography>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              md={8}
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <TimePickerField
                label="Open"
                value={dayData.open}
                onChange={(val) => handleChange(idx, "open", val)}
              />
              <TimePickerField
                label="Close"
                value={dayData.close}
                onChange={(val) => handleChange(idx, "close", val)}
              />
            </Grid>
          )}
        </Grid>
      ))}
    </div>
  );
};

export default HoursSelection;
