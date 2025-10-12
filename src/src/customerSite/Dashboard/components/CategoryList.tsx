import { Box, Stack } from "@mui/material";
import type { MenuCategory } from "../../../types";
import CustomChip from "../../components/Chip";
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useState } from "react";
import Input from "../../../components/Input";

interface ICategoryList {
  categoriesList: MenuCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onSearch?: (searchTerm: string) => void;
}

const CategoryList: React.FC<ICategoryList> = ({
  categoriesList,
  selectedCategory,
  onSelectCategory,
  onSearch
}) => {
  const chipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (id: string) => {
    onSelectCategory(id);
    const chipEl = chipRefs.current[id];
    if (chipEl) {
      chipEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box>
      {/* Search Input */}
      <Box>
        <Input
          fullWidth
          placeholder="Search for item / food"
          value={searchTerm}
          onChange={handleSearchChange}
          startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
        />
      </Box>

      {/* Categories */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        position="relative"
      >
        {/* Categories scrollable */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          p={1}
          sx={{
            overflowX: "auto",
            flex: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {categoriesList.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                chipRefs.current[category.id] = el;
                return;
              }}
            >
              <CustomChip
                label={category.title}
                selected={category.id === selectedCategory}
                onClick={() => handleClick(category.id)}
              />
            </div>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CategoryList;
