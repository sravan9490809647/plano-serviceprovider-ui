import { Box, Stack, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Divider } from "@mui/material";
import type { MenuCategory } from "../../../types";
import CustomChip from "../../components/Chip";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRef, useState } from "react";
import Input from "../../../components/Input";
import { COLORS, TEXT_COLORS } from "../../../Constants";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleCategorySelect = (id: string) => {
    onSelectCategory(id);
    setDrawerOpen(false);

    // Scroll the chip into view after a short delay to ensure drawer is closed
    setTimeout(() => {
      const chipEl = chipRefs.current[id];
      if (chipEl) {
        chipEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }, 300);
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
      <Input
        fullWidth
        placeholder="Search for item / food"
        value={searchTerm}
        onChange={handleSearchChange}
        startIcon={<SearchIcon sx={{ color: 'text.secondary' }} />}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '45px',
            borderRadius: '8px',
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: "#eeeeee",
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: "#eeeeee",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: "#eeeeee",
          },
        }}
      />

      {/* Categories */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={1}
        mt={2}
      >
        {/* Menu Icon Button */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            flexShrink: 0,
            width: 40,
            height: 40,
            '&:focus': {
              outline: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            },
          }}
          disableRipple
        >
          <MenuIcon />
        </IconButton>

        {/* Categories scrollable */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
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

      {/* Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '70vh',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" sx={{ color: TEXT_COLORS.PRIMARY }}>
              Categories
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Categories List */}
          <List sx={{ py: 0 }}>
            {categoriesList.map((category, index) => (
              <Box key={category.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleCategorySelect(category.id)}
                    selected={category.id === selectedCategory}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        color: TEXT_COLORS.PRIMARY,
                        backgroundColor: COLORS.WHITE,
                        '&:hover': {
                          color: TEXT_COLORS.PRIMARY,
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={category.title}
                      primaryTypographyProps={{
                        fontWeight: category.id === selectedCategory ? 600 : 400,
                        fontSize: '1rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < categoriesList.length - 1 && <Divider sx={{ my: 0.5 }} />}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CategoryList;
