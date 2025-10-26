import React from "react";
import { Box, Divider, Grid, Typography, useTheme } from "@mui/material";
import { type CategoryWithItems, type MenuItem } from "../../types";
import MenuListItems from "../Dashboard/MenuListItems";
import { TEXT_COLORS } from "../../Constants";

interface MenuSectionProps {
    filteredCategoryWithItems: CategoryWithItems[];
    searchTerm: string;
    onHandleAdd: (item: MenuItem) => void;
    onHandleRemove: (itemId: string) => void;
    onDeleteItem: (itemId: string) => void;
    categoryRefs?: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

const MenuSection: React.FC<MenuSectionProps> = ({
    filteredCategoryWithItems,
    searchTerm,
    onHandleAdd,
    onHandleRemove,
    onDeleteItem,
    categoryRefs,
}) => {
    const theme = useTheme();

    if (filteredCategoryWithItems.length > 0) {
        return (
            <Grid container spacing={0}>
                {filteredCategoryWithItems.map((cat) => (
                    <Grid
                        item
                        xs={12}
                        key={cat.category.id}
                        sx={{
                            mb: { xs: 2, sm: 2.5, md: 3 }
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            mb={{ xs: 1, sm: 1.5 }}
                            ref={categoryRefs ? (el) => {
                                categoryRefs.current[cat.category.id] = el as HTMLHeadingElement | null;
                            } : undefined}
                            sx={{
                                scrollMarginTop: { xs: "120px", sm: "130px", md: "140px" },
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: TEXT_COLORS.PRIMARY,
                                    mr: 2,
                                    flexShrink: 0,
                                }}
                            >
                                {cat.category.title}
                            </Typography>
                            <Divider
                                sx={{
                                    flex: 1,
                                    height: "1px",
                                }}
                            />
                        </Box>
                        {cat.items.length > 0 ? (
                            <MenuListItems
                                items={cat.items}
                                handleAdd={onHandleAdd}
                                handleRemove={onHandleRemove}
                                onDelete={onDeleteItem}
                            />
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                                }}
                            >
                                No items available in this category.
                            </Typography>
                        )}
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (searchTerm.trim() !== "") {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={300}
                flexDirection="column"
                gap={2}
            >
                <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                        fontSize: "1.1rem", // mobile font size
                        [theme.breakpoints.up('md')]: {
                            fontSize: "1.4rem", // larger desktop font size
                        },
                    }}
                >
                    No items found for "{searchTerm}"
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: "0.8rem", // mobile font size
                        [theme.breakpoints.up('md')]: {
                            fontSize: "0.9rem", // larger desktop font size
                        },
                    }}
                >
                    Try searching with different keywords
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={300}
        >
            <Typography
                variant="h5"
                sx={{
                    fontSize: "1.1rem", // mobile font size
                    [theme.breakpoints.up('md')]: {
                        fontSize: "1.4rem", // larger desktop font size
                    },
                }}
            >
                No categories or items available
            </Typography>
        </Box>
    );
};

export default MenuSection; 