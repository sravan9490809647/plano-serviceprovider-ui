import React from "react";
import { TimePicker } from "@mui/x-date-pickers";

interface TimePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (val: Date) => void;
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <TimePicker
      label={label}
      value={value}
      onChange={(val) => onChange(val || new Date())}
      slotProps={{
        textField: {
          size: "small",
          sx: {
            width: 140,
            "& .MuiInputBase-root": {
              height: 40,
              fontSize: 14,
              fontFamily: "GolosText", // remove if not needed
            },
          },
        },
      }}
    />
  );
};

export default TimePickerField;
