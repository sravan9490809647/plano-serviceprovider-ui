import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Filters from "./components/Filters";
import {
  updateMenuItemStockAvailability,
  fetchAllItems,
  getItemById,
} from "../../redux/reducers/MenusReducer";
import { useDispatch, useSelector } from "react-redux";
import type { MenuCategory, MenuItem } from "../../types";
import type { AppDispatch } from "../../redux/store";
import Loader from "../../components/Loader";
import { fetchAllCategories } from "../../redux/reducers/CategoryReducer";
import Storage from "../../utils/Storage";
import NoDataFound from "../../components/NoDataFound";
import { CustomSwitch, StickyBox } from "../../Styles";
import { formatPrice } from "../../utils/common";
import { FONT_FAMILY } from "../../Constants";

const ItemsAvailability: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, loading, menuLoading, itemDetails } = useSelector(
    (state: {
      menus: {
        items: MenuItem[];
        loading: boolean;
        menuLoading: boolean;
        itemDetails: MenuItem;
      };
    }) => state.menus
  );
  const { categoriesList } = useSelector(
    (state: {
      categories: {
        categoriesList: MenuCategory[];
      };
    }) => state.categories
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const businessId = Storage.getItem("businessId") || "";

  useEffect(() => {
    dispatch(fetchAllItems(businessId));
    dispatch(fetchAllCategories(businessId));
  }, [dispatch, businessId]);

  const handleSearchChange = (value: string) => setSearch(value);
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      item.categories?.some((c) => c.id === selectedCategory);

    return matchesSearch && matchesCategory;
  });
  const handleToggleAvailability = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      dispatch(
        updateMenuItemStockAvailability({ id: item.id, inStock: !item.inStock })
      );
    }
  };

  const handleExpand = async (id: string) => {
    if (expandedItemId === id) {
      setExpandedItemId(null);
    } else {
      await dispatch(getItemById(id));
      setExpandedItemId(id);
    }
  };

  const categoryOptions = categoriesList.map((cat) => ({
    label: cat.title,
    value: cat.id,
  }));

  return (
    <Box>
      {(loading || menuLoading) && <Loader />}
      <StickyBox>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h3">Item Availability</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Filters
              search={search}
              selectedCategory={selectedCategory}
              handleSearchChange={handleSearchChange}
              handleCategoryChange={handleCategoryChange}
              categories={categoryOptions}
              layout="search"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Filters
              search={search}
              selectedCategory={selectedCategory}
              handleSearchChange={handleSearchChange}
              handleCategoryChange={handleCategoryChange}
              categories={categoryOptions}
              layout="category"
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <Box display="flex" justifyContent="flex-end">
              <Typography
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#3B82F6",
                  fontSize: 14,
                }}
              >
                Clear Filters
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </StickyBox>

      {filteredItems.length > 0 && (
        <Box p={2} pt={0}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={1}
              mb={1}
            >
              <Typography variant="h4">
                Manage Item Availability ({items.length} items)
              </Typography>
              <Typography variant="h5">
                Available: {items.filter((i) => i.inStock).length} |
                Unavailable: {items.filter((i) => !i.inStock).length}
              </Typography>
            </Stack>

            {filteredItems.map((item) => {
              const categoryTitles =
                item.categories?.map((c) => c.title).join(", ") || "---";
              return (
                <Box
                  key={item.id}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    mb: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                    }}
                  >
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Left side: title + desc */}
                      <Grid item xs={12} sm={8}>
                        <Stack direction="column" gap={0.5}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                          >
                            <Typography variant="h5">{item.title}</Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                backgroundColor: "#F3F4F6",
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.25,
                              }}
                            >
                              {categoryTitles}
                            </Typography>
                          </Stack>
                          {item.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>

                      {/* Right side: status, switch, icon */}
                      <Grid
                        item
                        xs={12}
                        sm="auto"
                        sx={{
                          mt: { xs: 1, sm: 0 },
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color={item.inStock ? "success.main" : "error.main"}
                        >
                          {item.inStock ? "Available" : "Unavailable"}
                        </Typography>
                        <CustomSwitch
                          checked={item.inStock}
                          onChange={() => handleToggleAvailability(item.id)}
                        />
                        <IconButton
                          onClick={() => handleExpand(item.id)}
                          size="small"
                        >
                          {expandedItemId === item.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Collapse stays as-is */}
                  <Collapse
                    in={expandedItemId === item.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box bgcolor="#F9FAFB" px={2} py={1}>
                      {/* Ingredients */}
                      {itemDetails?.ingredients?.length > 0 && (
                        <Box mb={1}>
                          <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
                            Included Ingredients
                          </Typography>
                          <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                            {itemDetails.ingredients.map((ing, idx) => (
                              <li key={idx}>{ing}</li>
                            ))}
                          </ul>
                        </Box>
                      )}

                      {/* Variations */}
                      {itemDetails?.itemVariations?.length > 0 && (
                        <Box mb={1}>
                          <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>Item Variations</Typography>
                          <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                            {itemDetails.itemVariations.map((v, idx) => (
                              <li key={idx}>{`${v.title} - ${formatPrice(v.price)}`}</li>
                            ))}
                          </ul>
                        </Box>
                      )}

                      {/* Option Groups */}
                      {itemDetails?.optionGroups?.map((group, index) => (
                        <Box key={index} mb={1}>
                          <Typography variant="h6" sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>{group.title}</Typography>
                          <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                            {group.options.map((opt, idx) => (
                              <li key={idx}>{opt.title}</li>
                            ))}
                          </ul>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Paper>
        </Box>
      )}

      {!loading && items.length === 0 && (
        <NoDataFound message="No items found." />
      )}
    </Box>
  );
};

export default ItemsAvailability;
