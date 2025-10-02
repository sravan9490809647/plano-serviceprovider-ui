import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Stack, InputLabel } from "@mui/material";
import CustomButton from "../../../components/Button";
import Input from "../../../components/Input";
import { CustomSwitch } from "../../../Styles";
import { formatPrice } from "../../../utils/common";
import { FONT_FAMILY } from "../../../Constants";

interface Option {
  name: string;
  price: string;
}

export interface OptionGroup {
  title: string;
  required: boolean;
  allowMultiple: boolean;
  maxSelections: number;
  options: Option[];
}

interface OptionGroupsProps {
  optionGroups: OptionGroup[];
  setOptionGroups: (groups: OptionGroup[]) => void;
}

const OptionGroups: React.FC<OptionGroupsProps> = ({
  optionGroups = [],
  setOptionGroups,
}) => {
  const [newGroup, setNewGroup] = useState({
    title: "",
    required: false,
    allowMultiple: false,
    maxSelections: 1,
  });
  const [newOption, setNewOption] = useState<Option>({ name: "", price: "" });
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [editingOptionIndex, setEditingOptionIndex] = useState<{ groupIndex: number; optionIndex: number } | null>(null);

  const handleAddGroup = () => {
    if (!newGroup.title.trim()) return;

    if (editingGroupIndex !== null) {
      // Update existing group
      const updated = [...optionGroups];
      updated[editingGroupIndex] = { ...newGroup, options: updated[editingGroupIndex].options };
      setOptionGroups(updated);
      setEditingGroupIndex(null);
    } else {
      // Add new group
      setOptionGroups([...optionGroups, { ...newGroup, options: [] }]);
    }

    setNewGroup({
      title: "",
      required: false,
      allowMultiple: false,
      maxSelections: 1,
    });
  };

  const handleRemoveGroup = (index: number) => {
    const updated = optionGroups.filter((_, i) => i !== index);
    setOptionGroups(updated);
    if (editingGroupIndex === index) {
      setEditingGroupIndex(null);
    }
  };

  const handleEditGroup = (index: number) => {
    const group = optionGroups[index];
    setNewGroup({
      title: group.title,
      required: group.required,
      allowMultiple: group.allowMultiple,
      maxSelections: group.maxSelections,
    });
    setEditingGroupIndex(index);
  };

  const handleAddOption = () => {
    if (!newOption.name.trim() || !newOption.price.trim()) return;
    if (activeGroupIndex === null) return;

    const updated = [...optionGroups];

    if (editingOptionIndex && editingOptionIndex.groupIndex === activeGroupIndex) {
      // Update existing option
      updated[activeGroupIndex].options[editingOptionIndex.optionIndex] = { ...newOption };
      setEditingOptionIndex(null);
    } else {
      // Add new option
      updated[activeGroupIndex].options.push({ ...newOption });
    }

    setOptionGroups(updated);
    setNewOption({ name: "", price: "" });
    setActiveGroupIndex(null);
  };

  const handleEditOption = (groupIndex: number, optionIndex: number) => {
    const option = optionGroups[groupIndex].options[optionIndex];
    setNewOption({ ...option });
    setActiveGroupIndex(groupIndex);
    setEditingOptionIndex({ groupIndex, optionIndex });
  };

  const handleRemoveOption = (groupIndex: number, optionIndex: number) => {
    const updated = [...optionGroups];
    updated[groupIndex].options.splice(optionIndex, 1);
    setOptionGroups(updated);

    if (editingOptionIndex &&
      editingOptionIndex.groupIndex === groupIndex &&
      editingOptionIndex.optionIndex === optionIndex) {
      setEditingOptionIndex(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
        Option Groups
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Create customizable add-ons like drinks, sides, or extras
      </Typography>

      {optionGroups.map((group, index) => (
        <Paper
          key={index}
          sx={{ p: 3, mb: 3, border: "1px solid #E5E7EB", borderRadius: 2 }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {group.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <CustomButton
                size="small"
                onClick={() => handleEditGroup(index)}
              >
                Edit
              </CustomButton>
              <CustomButton
                size="small"
                color="error"
                onClick={() => handleRemoveGroup(index)}
              >
                Remove
              </CustomButton>
            </Stack>
          </Grid>

          <Grid container spacing={1} mt={1}>
            {group.required && (
              <Grid item>
                <Box
                  sx={{
                    backgroundColor: "#EF4444",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  Required
                </Box>
              </Grid>
            )}
            {group.allowMultiple && (
              <Grid item>
                <Box
                  sx={{
                    backgroundColor: "#F3F4F6",
                    color: "#111827",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  Multiple
                </Box>
              </Grid>
            )}
          </Grid>

          {group.options.map((opt, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#F9FAFB"
              px={2}
              py={1}
              borderRadius={2}
              my={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>{opt.name}</Typography>
                <Typography color="text.secondary">+{formatPrice(opt.price)}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <CustomButton
                  size="small"
                  onClick={() => handleEditOption(index, i)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  size="small"
                  variant="text"
                  color="error"
                  onClick={() => handleRemoveOption(index, i)}
                >
                  Remove
                </CustomButton>
              </Stack>
            </Box>
          ))}

          {activeGroupIndex === index && (
            <Grid container spacing={2} alignItems="center" mt={1}>
              <Grid item xs={12} sm={5}>
                <Input
                  fullWidth
                  placeholder="Option name"
                  label="Option Name"
                  value={newOption.name}
                  onChange={(e) =>
                    setNewOption((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Input
                  fullWidth
                  placeholder="Price"
                  label="Price"
                  type="number"
                  value={newOption.price}
                  onChange={(e) =>
                    setNewOption((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <CustomButton fullWidth onClick={handleAddOption}>
                  {editingOptionIndex && editingOptionIndex.groupIndex === index ? "Update" : "Add"}
                </CustomButton>
              </Grid>
              <Grid item xs={6} sm={1}>
                <CustomButton
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setActiveGroupIndex(null);
                    setEditingOptionIndex(null);
                    setNewOption({ name: "", price: "" });
                  }}
                >
                  Cancel
                </CustomButton>
              </Grid>
            </Grid>
          )}

          {activeGroupIndex !== index && (
            <CustomButton
              sx={{ mt: 2 }}
              onClick={() => setActiveGroupIndex(index)}
            >
              + Add Option
            </CustomButton>
          )}
        </Paper>
      ))}

      <Paper sx={{ p: 3, border: "1px solid #E5E7EB", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: `${FONT_FAMILY.BOLD} !important` }}>
          Add New Option Group
        </Typography>
        <Input
          fullWidth
          placeholder="Group name (e.g., Choose a Drink)"
          value={newGroup.title}
          onChange={(e) =>
            setNewGroup((prev) => ({ ...prev, title: e.target.value }))
          }
          sx={{ mb: 2 }}
        />
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CustomSwitch
            checked={newGroup.required}
            onChange={(e) =>
              setNewGroup((prev) => ({ ...prev, required: e.target.checked }))
            }
          />
          <Stack>
            <Typography variant="body1">Required</Typography>
            <Typography variant="body2">
              Customers must choose at least one option from this group before
              adding to cart.
            </Typography>
          </Stack>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <CustomSwitch
            checked={newGroup.allowMultiple}
            onChange={(e) =>
              setNewGroup((prev) => ({
                ...prev,
                allowMultiple: e.target.checked,
              }))
            }
          />
          <Stack>
            <Typography variant="body1">Allow Multiple</Typography>
            <Typography variant="body2">
              Customers can select more than one option from this group.
            </Typography>
          </Stack>
        </Box>
        {newGroup.allowMultiple && (
          <Box mt={2}>
            <InputLabel>Max Selections</InputLabel>
            <Input
              type="number"
              value={newGroup.maxSelections}
              onChange={(e) =>
                setNewGroup((prev) => ({
                  ...prev,
                  maxSelections: Number(e.target.value),
                }))
              }
            />
          </Box>
        )}
        <Box mt={3}>
          <CustomButton fullWidth onClick={handleAddGroup}>
            {editingGroupIndex !== null ? "Update Option Group" : "+ Add Option Group"}
          </CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default OptionGroups;
