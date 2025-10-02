import React from "react";
import { type SelectChangeEvent } from "@mui/material";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { Search } from "@mui/icons-material";

interface FiltersProps {
  search: string;
  selectedCategory: string;
  categories: { value: string; label: string }[];
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  layout?: "search" | "category";
}

const Filters: React.FC<FiltersProps> = ({
  search,
  selectedCategory,
  categories,
  handleSearchChange,
  handleCategoryChange,
  layout = "search",
}) => {
  return layout === "search" ? (
    <Input
      fullWidth
      placeholder="Search items..."
      startIcon={<Search color="action" />}
      value={search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleSearchChange(e.target.value)
      }
      inputStyles={{ padding: "12px" }}
    />
  ) : (
    <Select
      fullWidth
      label="Category"
      value={selectedCategory}
      onChange={(
        event: SelectChangeEvent<string | number | (string | number)[]>
      ) => handleCategoryChange(event.target.value as string)}
      options={categories}
      selectSx={{ padding: "12px" }}
    />
  );
};

export default Filters;
