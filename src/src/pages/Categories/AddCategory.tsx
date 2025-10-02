import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import DialogWrapper from "../../components/DialogWrapper";
import { Box, Typography } from "@mui/material";
import type { AppDispatch } from "../../redux/store";
import Loader from "../../components/Loader";
import {
  onAddCategory,
  onEditCategory,
} from "../../redux/reducers/CategoryReducer";
import { useDispatch } from "react-redux";
import type { MenuCategory } from "../../types";
import { uploadImage } from "../../redux/reducers/MenusReducer";
import { AWS_BUCKET_BASE_URL } from "../../Constants";

interface AddCategoryProps {
  open: boolean;
  businessId: string;
  categoy?: MenuCategory | null; // If null = add mode, else = edit mode
  onClose: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  open,
  businessId,
  categoy,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    image: null as File | null,
    imagePreview: "" as string,
  });

  const [errors, setErrors] = useState({
    categoryName: "",
  });

  // Populate form for edit mode
  useEffect(() => {
    if (categoy) {
      setFormData({
        categoryName: categoy.title,
        description: categoy.description || "",
        image: null,
        imagePreview: categoy.thumbnailImage
          ? `${AWS_BUCKET_BASE_URL}${categoy.thumbnailImage}`
          : "",
      });
    } else {
      setFormData({
        categoryName: "",
        description: "",
        image: null,
        imagePreview: "",
      });
    }
    setErrors({ categoryName: "" });
  }, [categoy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { categoryName: "" };

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      let thumbnailImageUrl = categoy?.thumbnailImage; // fallback to existing url
      if (formData.image instanceof File) {
        const uploadResp = await uploadImage(formData.image);
        if (!uploadResp?.fileName) {
          throw new Error("Image upload failed.");
        }
        thumbnailImageUrl = uploadResp.fileName;
      }
      const payload = {
        title: formData.categoryName,
        description: formData.description,
        thumbnailImage: thumbnailImageUrl,
        bId: businessId,
      };

      let resultAction;

      if (categoy) {
        resultAction = await dispatch(
          onEditCategory({ ...payload, id: categoy.id })
        );
      } else {
        resultAction = await dispatch(onAddCategory(payload));
      }

      if (
        (categoy && onEditCategory.fulfilled.match(resultAction)) ||
        (!categoy && onAddCategory.fulfilled.match(resultAction))
      ) {
        onClose();
      } else {
        console.error("Failed to submit category:", resultAction.payload);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      title={categoy ? "Edit Category" : "Add New Category"}
      onSubmit={handleSubmit}
      submitButtonText={categoy ? "Update Category" : "Save Category"}
      cancelButtonText="Cancel"
    >
      {loading && <Loader />}
      <Input
        fullWidth
        label="Category Name"
        name="categoryName"
        placeholder="Enter category name"
        required
        sx={{ my: 2 }}
        value={formData.categoryName}
        onChange={handleChange}
        error={!!errors.categoryName}
        helperText={errors.categoryName}
      />
      <Input
        fullWidth
        label="Description"
        placeholder="Enter item description"
        name="description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
      />
      <Box mt={2} textAlign="center">
        <Box
          component="label"
          sx={{
            display: "inline-block",
            width: "100%",
            height: 150,
            border: "2px dashed #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#f9f9f9",
          }}
        >
          {formData.imagePreview ? (
            <img
              src={formData.imagePreview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#aaa",
              }}
            >
              Click to upload
            </Typography>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default AddCategory;
