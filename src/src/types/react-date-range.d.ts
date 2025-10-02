declare module "react-date-range" {
  import * as React from "react";

  export interface Range {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key?: string;
  }

  export interface DateRangeProps
    extends React.ComponentPropsWithoutRef<"div"> {
    ranges: Range[];
    onChange: (ranges: { [key: string]: Range }) => void;
    moveRangeOnFirstSelection?: boolean;
    months?: number;
    direction?: "horizontal" | "vertical";
    editableDateInputs?: boolean;
    maxDate?: Date;
    minDate?: Date;
  }

  export const DateRange: React.FC<DateRangeProps>;
}
