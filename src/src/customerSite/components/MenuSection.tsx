import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { type CategoryWithItems, type MenuItem } from "../../types";
import MenuListItems from "../Dashboard/MenuListItems";

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
            <Box>
                {filteredCategoryWithItems.map((cat) => (
                    <Box
                        key={cat.category.id}
                        mb={1}
                        ref={categoryRefs ? (el) => {
                            categoryRefs.current[cat.category.id] = el as HTMLDivElement | null;
                        } : undefined}
                        sx={{ scrollMarginTop: "90px" }}
                    >
                        <Typography
                            variant="h5"
                            mb={1}
                            sx={{
                                fontSize: "1rem", // mobile font size
                                fontWeight: 600,
                                [theme.breakpoints.up('md')]: {
                                    fontSize: "1.1rem", // larger desktop font size
                                },
                            }}
                        >
                            {cat.category.title}
                        </Typography>
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
                                    fontSize: "0.8rem", // mobile font size
                                    [theme.breakpoints.up('md')]: {
                                        fontSize: "0.9rem", // larger desktop font size
                                    },
                                }}
                            >
                                No items available in this category.
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
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