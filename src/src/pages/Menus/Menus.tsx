import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  deleteMenuItem,
  deleteCategory,
  fetchGetCategoryAndItemsByBusinessId,
  reorderCategories,
  reorderItemsInCategory,
  swapCategoryOrder,
  swapItemOrder,
} from "../../redux/reducers/MenusReducer";
import MenuHeader from "./components/MenuHeader";
import ScrollableCardList from "./components/ScrollableCardList";
import type { CategoryWithItems, MenuCategory } from "../../types";
import Loader from "../../components/Loader";
import { fetchCategoriesByBusinessId } from "../../redux/reducers/CategoryReducer";
import AddCategory from "../Categories/AddCategory";
import Storage from "../../utils/Storage";
import DialogWrapper from "../../components/DialogWrapper";
import { useNavigate } from "react-router-dom";
import SetupMenuOptions from "./SetupMenuOptions";
import DraggableCategory from "./components/DraggableCategory";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { formatPrice } from "../../utils/common";

const Menus: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [openCategory, setOpenCategory] = useState(false);
  const [deleteItemDialogOpenId, setDeleteItemDialogOpenId] = useState<
    string | null
  >(null);
  const [deleteCategoryDialogOpenId, setDeleteCategoryDialogOpenId] = useState<
    string | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const { categoryWithItems, loading, error } = useSelector(
    (state: {
      menus: {
        categoryWithItems: CategoryWithItems[];
        loading: boolean;
        error: string;
      };
    }) => state.menus
  );

  const businessId = Storage.getItem("businessId") || "";

  useEffect(() => {
    dispatch(fetchGetCategoryAndItemsByBusinessId(businessId));
    dispatch(fetchCategoriesByBusinessId(businessId));
  }, [dispatch, businessId]);

  const handleClose = () => {
    dispatch(fetchGetCategoryAndItemsByBusinessId(businessId));
    dispatch(fetchCategoriesByBusinessId(businessId));
    setOpenCategory(false);
    setSelectedCategory(null);
  };

  const onAddItem = (categoryId?: string) => {
    navigate("/menus/add", {
      state: { categoryId: categoryId || "" },
    });
  };

  const onEditItem = (itemId: string) => {
    navigate(`/menus/edit/${itemId}`, {
      state: { categoryId: "" },
    });
  };

  const onEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setOpenCategory(true);
  };
  const onDeleteCategory = (category: MenuCategory) => {
    setDeleteCategoryDialogOpenId(category.id);
  };
  const onDeleteItem = (id: string) => {
    setDeleteItemDialogOpenId(id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging a category
    const activeCategoryIndex = categoryWithItems.findIndex(
      cat => cat.category.id === activeId
    );

    if (activeCategoryIndex !== -1) {
      // Dragging a category
      const overCategoryIndex = categoryWithItems.findIndex(
        cat => cat.category.id === overId
      );

      if (overCategoryIndex !== -1 && activeCategoryIndex !== overCategoryIndex) {
        // Update UI immediately for better UX
        dispatch(reorderCategories({
          oldIndex: activeCategoryIndex,
          newIndex: overCategoryIndex,
        }));

        // Call API to update the order on the server
        const categoryId = categoryWithItems[activeCategoryIndex].category.id;
        dispatch(swapCategoryOrder({
          id: categoryId,
          rearrangeOrderNumber: overCategoryIndex,
        }));
      }
    } else {
      // Dragging an item - find which category it belongs to
      let sourceCategoryIndex = -1;
      let activeItemIndex = -1;

      for (let i = 0; i < categoryWithItems.length; i++) {
        const itemIndex = categoryWithItems[i].items.findIndex(item => item.id === activeId);
        if (itemIndex !== -1) {
          sourceCategoryIndex = i;
          activeItemIndex = itemIndex;
          break;
        }
      }

      if (sourceCategoryIndex !== -1) {
        const sourceCategory = categoryWithItems[sourceCategoryIndex];
        const sourceCategoryId = sourceCategory.category.id;

        // Check if dropping on another item in the same category
        const overItemIndex = sourceCategory.items.findIndex(item => item.id === overId);

        if (overItemIndex !== -1 && activeItemIndex !== overItemIndex) {
          // Update UI immediately for better UX
          dispatch(reorderItemsInCategory({
            categoryId: sourceCategoryId,
            oldIndex: activeItemIndex,
            newIndex: overItemIndex,
          }));

          // Call API to update the order on the server
          const itemId = sourceCategory.items[activeItemIndex].id;
          dispatch(swapItemOrder({
            id: itemId,
            rearrangeOrderNumber: overItemIndex,
          }));
        }
      }
    }
  };

  const hasItems = categoryWithItems.length > 0;
  const filteredCategoryWithItems = categoryWithItems.filter((menu) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    const categoryMatches = menu.category.title.toLowerCase().includes(search);
    const anyItemMatches = menu.items.some((item) =>
      item.title.toLowerCase().includes(search)
    );

    return categoryMatches || anyItemMatches;
  });
  return (
    <Box>
      {loading && <Loader />}

      {!loading && !error && !hasItems && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
          <SetupMenuOptions />
        </Box>
      )}

      {!loading && hasItems && (
        <Box>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <MenuHeader
              onClickCategory={() => setOpenCategory(true)}
              onSearchChange={(val) => setSearchTerm(val)}
            />

            {filteredCategoryWithItems.map((menu) => (
              <Box key={menu.category.id} sx={{ mb: 3 }}>
                <DraggableCategory id={menu.category.id}>
                  <SortableContext
                    items={menu.items.map(item => item.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <ScrollableCardList
                      category={menu.category}
                      items={menu.items}
                      onAddItem={() => onAddItem(menu.category.id)}
                      onDelete={onDeleteItem}
                      onEdit={(menu) => onEditItem(menu.id)}
                      onEditCategory={() => onEditCategory(menu.category)}
                      onDeleteCategory={() => onDeleteCategory(menu.category)}
                    />
                  </SortableContext>
                </DraggableCategory>
              </Box>
            ))}

            <DragOverlay>
              {activeId ? (
                (() => {
                  // Check if dragging a category
                  const draggedCategory = filteredCategoryWithItems.find(
                    cat => cat.category.id === activeId
                  );

                  if (draggedCategory) {
                    return (
                      <Box
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 2,
                          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                          opacity: 0.8,
                          transform: "rotate(5deg)",
                          p: 2,
                          minWidth: 300,
                        }}
                      >
                        <Typography variant="h6">{draggedCategory.category.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {draggedCategory.items.length} items
                        </Typography>
                      </Box>
                    );
                  }

                  // Check if dragging an item
                  const draggedItem = filteredCategoryWithItems
                    .flatMap(cat => cat.items)
                    .find(item => item.id === activeId);

                  if (draggedItem) {
                    return (
                      <Box
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 2,
                          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                          opacity: 0.8,
                          transform: "rotate(5deg)",
                          p: 2,
                          minWidth: 200,
                        }}
                      >
                        <Typography variant="h6">{draggedItem.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(draggedItem.price)}
                        </Typography>
                      </Box>
                    );
                  }

                  return null;
                })()
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      )}

      {openCategory && (
        <AddCategory
          open={openCategory}
          businessId={businessId}
          categoy={selectedCategory}
          onClose={handleClose}
        />
      )}

      <DialogWrapper
        open={
          Boolean(deleteItemDialogOpenId) || Boolean(deleteCategoryDialogOpenId)
        }
        title="Confirm Delete"
        children={`Are you sure you want to delete ${deleteItemDialogOpenId ? "item" : "category"
          }?`}
        submitButtonText="Yes"
        cancelButtonText="No"
        onSubmit={() => {
          if (deleteItemDialogOpenId) {
            dispatch(deleteMenuItem(deleteItemDialogOpenId));
            setDeleteItemDialogOpenId(null);
          } else if (deleteCategoryDialogOpenId) {
            // Use the new deleteCategory API call
            dispatch(deleteCategory(deleteCategoryDialogOpenId));
            setDeleteCategoryDialogOpenId(null);
          }
        }}
        onClose={() => {
          setDeleteItemDialogOpenId(null);
          setDeleteCategoryDialogOpenId(null);
        }}
      />
    </Box>
  );
};

export default Menus;
