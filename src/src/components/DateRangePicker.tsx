import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import type { DateRangeSelection } from "../types";
import CustomButton from "./Button";
import { Box, Stack } from "@mui/material";

interface MyDateRangePickerProps {
  onApply?: (range: DateRangeSelection) => void;
  onCancel?: () => void;
  initialRange?: DateRangeSelection | null;
}
interface RangeKeyDict {
  [key: string]: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key?: string;
  };
}

const MyDateRangePicker: React.FC<MyDateRangePickerProps> = ({
  onApply,
  onCancel,
  initialRange,
}) => {
  const defaultRange: DateRangeSelection = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  const rangeToUse = initialRange || defaultRange;

  const [tempRange, setTempRange] = useState<DateRangeSelection[]>([
    rangeToUse,
  ]);

  const [appliedRange, setAppliedRange] =
    useState<DateRangeSelection[]>(tempRange);

  // Update tempRange when initialRange changes
  useEffect(() => {
    if (initialRange) {
      setTempRange([initialRange]);
      setAppliedRange([initialRange]);
    }
  }, [initialRange]);

  const handleApply = () => {
    setAppliedRange(tempRange);
    onApply?.(tempRange[0]);
  };

  const handleCancel = () => {
    setTempRange(appliedRange);
    onCancel?.();
  };

  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (selection.startDate && selection.endDate) {
      setTempRange([
        {
          startDate: selection.startDate,
          endDate: selection.endDate,
          key: "selection",
        },
      ]);
    }
  };
  return (
    <Box>
      <DateRange
        editableDateInputs
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={tempRange}
        months={2}
        direction="horizontal"
        maxDate={new Date()} // Prevent selection of future dates
      />
      <Stack direction={"row"} justifyContent={"flex-end"} spacing={2} p={2}>
        <CustomButton variant="text" onClick={handleCancel}>
          Cancel
        </CustomButton>
        <CustomButton onClick={handleApply}>Apply</CustomButton>
      </Stack>
    </Box>
  );
};

export default MyDateRangePicker;
