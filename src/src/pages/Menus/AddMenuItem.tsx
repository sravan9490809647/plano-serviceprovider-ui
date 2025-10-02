import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import Loader from "../../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import type { MenuCategory, MenuItem } from "../../types";
import type { OptionGroup } from "./components/OptionGroups";
import {
  addMenuItem,
  editMenuItem,
  getItemById,
  uploadImage,
} from "../../redux/reducers/MenusReducer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../components/Button";
import OptionGroups from "./components/OptionGroups";
import { fetchAllCategories } from "../../redux/reducers/CategoryReducer";
import Storage from "../../utils/Storage";
import AddCategory from "../Categories/AddCategory";
import { AWS_BUCKET_BASE_URL } from "../../Constants";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import ItemSummary from "./components/ItemSummary";
import IngredientsSection from "./components/IngredientsSection";
import ImageUpload from "./components/ImageUpload";
import ItemVariations from "./components/ItemVariations";

const AddMenuItem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams<{ itemId?: string }>();
  const categoryId = location.state?.categoryId || "";
  const { categoriesList } = useSelector(
    (state: { categories: { categoriesList: MenuCategory[] } }) =>
      state.categories
  );
  const { itemDetails } = useSelector(
    (state: { menus: { itemDetails: MenuItem } }) => state.menus
  );

  const [loading, setLoading] = useState(false);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const businessId = Storage.getItem("businessId") || "";
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    categories: categoryId ? [categoryId] : [],
    image: null as File | null,
    imagePreview: "",
    ingredients: [] as string[],
    newIngredient: "",
    editingIndex: -1,
    variations: [] as { name: string; price: string }[],
    newVariation: { name: "", price: "" },
    editingVariationIndex: -1,
  });

  const [errors, setErrors] = useState({
    itemName: "",
    price: "",
    category: "",
  });

  const handleFormDataChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'itemName' || field === 'price' || field === 'categories') {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryChange = (
    event: SelectChangeEvent<string | number | (string | number)[]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: Array.isArray(event.target.value)
        ? event.target.value
        : [event.target.value],
    }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategories(businessId));
  }, [dispatch, businessId]);

  useEffect(() => {
    if (itemId) {
      dispatch(getItemById(itemId));
    }
  }, [itemId, dispatch]);

  useEffect(() => {
    if (itemId && itemDetails && itemDetails.id === itemId) {
      setFormData({
        itemName: itemDetails.title || "",
        description: itemDetails.description || "",
        price: itemDetails.price?.toString() || "",
        categories: itemDetails.categoryIds || [],
        image: null,
        imagePreview: itemDetails.thumbnailImage
          ? `${AWS_BUCKET_BASE_URL}${itemDetails.thumbnailImage}`
          : "",
        ingredients: itemDetails.ingredients || [],
        newIngredient: "",
        editingIndex: -1,
        variations:
          itemDetails.itemVariations?.map((v) => ({
            name: v.title,
            price: v.price.toString(),
          })) || [],
        newVariation: { name: "", price: "" },
        editingVariationIndex: -1,
      });
      setOptionGroups(
        itemDetails.optionGroups?.map((g) => ({
          title: g.title,
          required: g.required,
          allowMultiple: g.allowMultiple,
          maxSelections: g.maxSelections,
          options: g.options.map((opt) => ({
            name: opt.title,
            price: opt.price.toString(),
          })),
        })) || []
      );
    }
  }, [itemDetails, itemId]);

  const handleAddIngredient = () => {
    if (formData.editingIndex >= 0) {
      const updated = [...formData.ingredients];
      updated[formData.editingIndex] = formData.newIngredient.trim();
      setFormData((prev) => ({
        ...prev,
        ingredients: updated,
        newIngredient: "",
        editingIndex: -1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, prev.newIngredient.trim()],
        newIngredient: "",
      }));
    }
  };

  const handleEditIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      newIngredient: prev.ingredients[index],
      editingIndex: index,
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleAddVariation = () => {
    if (
      formData.newVariation.name.trim() &&
      formData.newVariation.price.trim()
    ) {
      if (formData.editingVariationIndex >= 0) {
        // Update existing variation
        const updated = [...formData.variations];
        updated[formData.editingVariationIndex] = formData.newVariation;
        setFormData((prev) => ({
          ...prev,
          variations: updated,
          newVariation: { name: "", price: "" },
          editingVariationIndex: -1,
        }));
      } else {
        // Add new variation
        setFormData((prev) => ({
          ...prev,
          variations: [...prev.variations, prev.newVariation],
          newVariation: { name: "", price: "" },
        }));
      }
    }
  };

  const handleEditVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      newVariation: prev.variations[index],
      editingVariationIndex: index,
    }));
  };

  const handleRemoveVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
      editingVariationIndex: prev.editingVariationIndex === index ? -1 : prev.editingVariationIndex,
    }));
  };

  const validateForm = () => {
    const newErrors = { itemName: "", price: "", category: "" };
    let valid = true;
    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required.";
      valid = false;
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
      valid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid price.";
      valid = false;
    }
    if (!formData.categories.length) {
      newErrors.category = "At least one category must be selected.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);

      let thumbnailImageUrl: string | null =
        itemDetails?.thumbnailImage ?? null; // fallback to existing url

      // 🟢 If user selected a new file, upload it
      if (formData.image instanceof File) {
        const uploadResp = await uploadImage(formData.image);
        if (!uploadResp?.fileName) {
          throw new Error("Image upload failed.");
        }
        thumbnailImageUrl = uploadResp.fileName;
      }

      const payload = {
        bId: Storage.getItem("businessId") || "",
        categoryIds: formData.categories,
        title: formData.itemName,
        description: formData.description,
        price: parseFloat(formData.price),
        thumbnailImage: thumbnailImageUrl,
        inStock: true,
        ingredients: formData.ingredients,
        itemVariations: formData.variations.map((v) => ({
          title: v.name,
          price: parseFloat(v.price),
        })),
        optionGroups: optionGroups.map((g) => ({
          title: g.title,
          required: g.required,
          maxSelections: g.allowMultiple
            ? g.maxSelections !== undefined
              ? g.maxSelections
              : 1
            : 1,
          allowMultiple: g.allowMultiple,
          options: g.options.map((opt) => ({
            title: opt.name,
            price: parseFloat(opt.price),
          })),
        })),
      };

      let result;
      if (itemId) {
        result = await dispatch(editMenuItem({ ...payload, id: itemId }));
      } else {
        result = await dispatch(addMenuItem(payload));
      }
      if (result.meta.requestStatus === "fulfilled") navigate("/menus");
    } catch (err) {
      console.error("Failed to save menu item", err);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categoriesList.map((cat: MenuCategory) => ({
    value: cat.id,
    label: cat.title,
  }));

  return (
    <Box p={3} maxWidth={800} mx="auto">
      {loading && <Loader />}
      <Stack direction={"row"} alignItems={"center"} gap={3}>
        <CustomButton
          variant="text"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          ← Back
        </CustomButton>
        <Stack direction={"column"}>
          <Typography variant="h4" mb={1}>
            {`${itemId ? "Update" : "Create New"} Menu Item`}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Set up your menu item with variations and customizable options
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <ItemSummary
          formData={{
            itemName: formData.itemName,
            description: formData.description,
            price: formData.price,
            categories: formData.categories,
          }}
          errors={errors}
          categoryOptions={categoryOptions}
          onFormDataChange={handleFormDataChange}
          onCategoryChange={handleCategoryChange}
          onAddCategory={() => setOpenCategory(true)}
        />
        <ItemVariations
          variations={formData.variations}
          newVariation={formData.newVariation}
          editingVariationIndex={formData.editingVariationIndex}
          onFormDataChange={handleFormDataChange}
          onAddVariation={handleAddVariation}
          onEditVariation={handleEditVariation}
          onRemoveVariation={handleRemoveVariation}
        />
        <IngredientsSection
          ingredients={formData.ingredients}
          newIngredient={formData.newIngredient}
          editingIndex={formData.editingIndex}
          onFormDataChange={handleFormDataChange}
          onAddIngredient={handleAddIngredient}
          onEditIngredient={handleEditIngredient}
          onRemoveIngredient={handleRemoveIngredient}
        />

        <ImageUpload
          imagePreview={formData.imagePreview}
          onImageChange={handleImageChange}
        />


        <CustomPaperWrapper>
          <OptionGroups
            optionGroups={optionGroups.map((group) => ({
              ...group,
              maxSelections: group.maxSelections ?? 1, // Ensure maxSelections is always a number
            }))}
            setOptionGroups={(groups: OptionGroup[]) => setOptionGroups(groups)}
          />
        </CustomPaperWrapper>
      </Stack>
      <Box mt={4} textAlign="right">
        <CustomButton onClick={handleSubmit}>
          {itemId ? "Update Menu Item" : "Add Menu Item"}
        </CustomButton>
      </Box>
      {openCategory && (
        <AddCategory
          open={openCategory}
          businessId={businessId}
          onClose={() => setOpenCategory(false)}
        />
      )}
    </Box>
  );
};

export default AddMenuItem;
