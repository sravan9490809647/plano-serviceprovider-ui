import React, { useState, useMemo } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CustomButton from "../../components/Button";
import VariationSelector from "./components/VariationSelector";
import OptionGroupSelector from "./components/OptionGroupSelector";
import IngredientsCustomizer from "./components/IngredientsCustomizer";
import type { ItemVariation, OptionGroup, UserMenuItem, UserOptionGroup } from "../../types";
import DialogWrapper from "../../components/DialogWrapper";
import { CURRENCY } from "../../Constants";
import type { CartItem } from "../../redux/reducers/Cart";

interface Option {
  id: string;
  title: string;
  price: number;
}

interface Props {
  itemDetails: UserMenuItem;
  variations: string;
  ingredients: string[];
  options: OptionGroup[];
  onAddToCart: (data: CartItem) => void;
  onCloseDetails: () => void;
}

const MenuItemDetails: React.FC<Props> = ({
  itemDetails,
  variations,
  ingredients,
  options,
  onAddToCart,
  onCloseDetails,
}) => {
  const [quantity] = useState(1);
  const [selectedVariation, setSelectedVariation] =
    useState<ItemVariation | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState(
    ingredients || []
  );
  const [selectedOptions, setSelectedOptions] = useState<OptionGroup[]>(
    options || []
  );

  // Initialize selected variation when component mounts or props change
  React.useEffect(() => {
    if (variations && itemDetails.itemVariations) {
      const variation = itemDetails.itemVariations.find((v) => v.id === variations);
      setSelectedVariation(variation || null);
    } else if (itemDetails.itemVariations && itemDetails.itemVariations.length > 0) {
      // If no variation is selected but variations exist, select the first one
      setSelectedVariation(itemDetails.itemVariations[0]);
    } else {
      setSelectedVariation(null);
    }
  }, [variations, itemDetails.itemVariations]);

  const handleOptionChange = (group: UserOptionGroup, option: Option) => {
    setSelectedOptions((prev) => {
      const existingGroup = prev.find((g) => g.id === group.id);

      if (existingGroup) {
        let updatedOptions: Option[];

        if (group.allowMultiple) {
          const isSelected = existingGroup.options.some(
            (o) => o.id === option.id
          );
          if (isSelected) {
            updatedOptions = existingGroup.options.filter(
              (o) => o.id !== option.id
            );
          } else {
            updatedOptions = [...existingGroup.options, option];
          }
        } else {
          updatedOptions = [option];
        }

        return prev.map((g) =>
          g.id === group.id
            ? {
              ...g,
              options: updatedOptions,
            }
            : g
        );
      } else {
        // No existing group yet
        return [
          ...prev,
          {
            id: group.id,
            title: group.title,
            required: group.required,
            allowMultiple: group.allowMultiple,
            maxSelections: group.maxSelections,
            options: [option],
          },
        ];
      }
    });
  };

  const basePrice = useMemo(() => {
    // If item has variations and a variation is selected, use variation price
    if (itemDetails.itemVariations && itemDetails.itemVariations.length > 0) {
      return selectedVariation ? selectedVariation.price : 0;
    }
    // Otherwise use the base item price
    return itemDetails.price;
  }, [
    itemDetails.itemVariations,
    selectedVariation,
    itemDetails.price,
  ]);

  const optionsPrice = useMemo(
    () =>
      selectedOptions
        .flatMap((g) => g.options)
        .reduce((sum, opt) => sum + opt.price, 0),
    [selectedOptions]
  );

  const totalPrice = useMemo(() => {
    const calculatedTotal = Math.round((basePrice + optionsPrice) * quantity * 100) / 100;
    return calculatedTotal;
  }, [basePrice, optionsPrice, quantity, selectedVariation, selectedOptions]);

  const handleClose = () => {
    onCloseDetails();
  };

  const missingRequiredOptions = useMemo(() => {
    return itemDetails.optionGroups?.some((g) => {
      if (!g.required) return false;

      const selectedGroup = selectedOptions.find((sg) => sg.id === g.id);
      return !selectedGroup || selectedGroup.options.length === 0;
    });
  }, [itemDetails.optionGroups, selectedOptions]);
  const missingVariation = useMemo(() => {
    return (
      itemDetails.itemVariations &&
      itemDetails.itemVariations.length > 0 &&
      !selectedVariation
    );
  }, [itemDetails.itemVariations, selectedVariation]);

  const isAddDisabled = missingRequiredOptions || missingVariation;

  return (
    <DialogWrapper
      title={itemDetails.title}
      onClose={handleClose}
      open={!!itemDetails.id}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        sx={{ minHeight: 400 }}
      >
        <Box flex={1} overflow="auto" pr={1}>
          {itemDetails.itemVariations &&
            itemDetails.itemVariations?.length > 0 && (
              <VariationSelector
                variations={itemDetails.itemVariations}
                selectedVariation={selectedVariation}
                setSelectedVariation={setSelectedVariation}
              />
            )}

          <Divider sx={{ my: 2 }} />

          {itemDetails.optionGroups?.map((group) => (
            <Box key={group.id} mb={2}>
              <OptionGroupSelector
                group={group}
                selectedOptions={selectedOptions}
                onChange={(option) => handleOptionChange(group, option)}
              />
            </Box>
          ))}

          {itemDetails.ingredients && itemDetails.ingredients?.length > 0 && (
            <IngredientsCustomizer
              ingredients={itemDetails.ingredients}
              removedIngredients={removedIngredients}
              setRemovedIngredients={setRemovedIngredients}
            />
          )}
        </Box>

        <Box
          mt={2}
          p={2}
          borderTop="1px solid #E5E7EB"
          sx={{ background: "#fff" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Total: {CURRENCY.symbol}
              {totalPrice}
            </Typography>

            {missingRequiredOptions && (
              <Typography variant="body2" color="error" fontWeight={500}>
                Select all required options
              </Typography>
            )}

            {missingVariation && (
              <Typography variant="body2" color="error" fontWeight={500}>
                Please select a variation
              </Typography>
            )}
          </Box>

          <CustomButton
            fullWidth
            onClick={() => {
              if (!isAddDisabled) {
                onAddToCart({
                  itemId: itemDetails.id,
                  quantity,
                  title: itemDetails.title,
                  thumbnailImage: itemDetails.thumbnailImage || null,
                  variation: selectedVariation,
                  optionGroups: selectedOptions,
                  removedIngredients: removedIngredients,
                  price: basePrice,
                  totalPrice: totalPrice,
                });
                handleClose();
              }
            }}
            disabled={isAddDisabled}
          >
            Add to Cart - {CURRENCY.symbol}
            {totalPrice}
          </CustomButton>
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default MenuItemDetails;
