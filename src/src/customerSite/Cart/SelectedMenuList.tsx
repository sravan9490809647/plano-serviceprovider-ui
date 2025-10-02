import React, { useState } from "react";
import {
  addToCart,
  removeFromCart,
  type CartItem,
} from "../../redux/reducers/Cart";
import {
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { Offer, CategoryWithItems, MenuItem } from "../../types";
import { AWS_BUCKET_BASE_URL, CURRENCY, DEFAULT_IMAGE, FONT_FAMILY } from "../../Constants";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QuantityController from "../components/QuantityController";

interface SelectedMenuListProps {
  cartItems: CartItem[];
  from: "cart" | "checkout";
}

const SelectedMenuList: React.FC<SelectedMenuListProps> = ({
  cartItems,
  from,
}) => {
  const dispatch = useDispatch();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const { offersList } = useSelector(
    (state: { offers: { offersList: Offer[] } }) => state.offers
  );

  const { categoryWithItems } = useSelector(
    (state: { userMenus: { categoryWithItems: CategoryWithItems[] } }) =>
      state.userMenus
  );

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const findMenuItemById = (id: string): MenuItem | undefined => {
    for (const category of categoryWithItems) {
      const item = category.items.find((itm) => itm.id === id);
      if (item) return item;
    }
    return undefined;
  };

  const getOfferForItem = (itemId: string) => {
    const offer = offersList.find((o) => o.qualifyingItems?.includes(itemId));
    if (!offer) return null;
    return { title: offer.title, offer };
  };

  return (
    <Box flex={1} overflow="auto" pr={1}>
      {cartItems.map((item, idx) => {
        const offer = getOfferForItem(item.itemId);

        return (
          <Box
            key={item.itemId + idx}
            sx={{
              borderBottom: "1px solid #eee",
              pb: 1,
              mb: 1,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography variant="h6" fontFamily={FONT_FAMILY.BOLD}>{idx + 1}</Typography>

                <img
                  src={
                    findMenuItemById(item.itemId)?.thumbnailImage
                      ? `${AWS_BUCKET_BASE_URL}${findMenuItemById(item.itemId)!.thumbnailImage
                      }`
                      : DEFAULT_IMAGE
                  }
                  alt={item.title}
                  width={48}
                  height={48}
                  style={{ borderRadius: 4 }}
                />

                <Box>
                  <Typography variant="h6" fontFamily={FONT_FAMILY.BOLD}>
                    {item.quantity} × {item.title}
                  </Typography>
                  <Typography variant="h6" fontFamily={FONT_FAMILY.MEDIUM}>
                    {CURRENCY.symbol} {(item.totalPrice || item.price).toFixed(2)}
                  </Typography>
                  {offer && (
                    <Chip
                      label={`${offer.title}`}
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Box>
              <Box>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    onClick={() => toggleExpand(item.itemId)}
                    size="small"
                  >
                    {expandedItems[item.itemId] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                {from === "cart" && (
                  <Box mt={1} display="flex" alignItems="center" gap={1}>
                    <QuantityController
                      isCart
                      quantity={item.quantity}
                      onAdd={() =>
                        dispatch(
                          addToCart({
                            title: item.title,
                            itemId: item.itemId,
                            thumbnailImage: item.thumbnailImage,
                            price: item.price,
                            totalPrice: item.totalPrice || item.price,
                            quantity: 1,
                            variation: item.variation,
                            optionGroups: item.optionGroups,
                            removedIngredients: item.removedIngredients,
                          })
                        )
                      }
                      onRemove={() =>
                        dispatch(
                          removeFromCart({
                            itemId: item.itemId,
                            quantity: 1,
                          })
                        )
                      }
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            itemId: item.itemId,
                            quantity: item.quantity,
                          })
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            <Collapse in={expandedItems[item.itemId]}>
              <Box pl={2} mt={1}>
                <Grid container spacing={1}>
                  {/* Variation */}
                  {item.variation && (
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={600}>Variation:</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.variation.title} ({CURRENCY.symbol}{item.variation.price.toFixed(2)})
                      </Typography>
                    </Grid>
                  )}

                  {/* Removed Ingredients */}
                  {item.removedIngredients &&
                    item.removedIngredients?.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography fontWeight={600}>
                          Removed Ingredients:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.removedIngredients.join(", ")}
                        </Typography>
                      </Grid>
                    )}
                </Grid>

                {/* Options */}
                {item.optionGroups?.map((group) => (
                  <Box key={group.id} mt={1}>
                    <Typography fontWeight={600}>{group.title}:</Typography>
                    <Grid container spacing={1}>
                      {group.options.map((opt) => (
                        <Grid item xs={12} sm={6} key={opt.id}>
                          <Typography variant="body2">
                            • {opt.title} ({CURRENCY.symbol}
                            {opt.price.toFixed(2)})
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Collapse>

            {/* Free Items */}
            {offer?.offer?.freeItems && offer?.offer?.freeItems?.length > 0 && (
              <Box mt={1} ml={1} p={1} bgcolor="#f9f9f9" borderRadius={1}>
                <Typography fontWeight={600} mb={0.5}>
                  Free Item(s) included:
                </Typography>
                {offer.offer.freeItems.map((fid) => {
                  const freeItem = findMenuItemById(fid);
                  if (!freeItem) return null;
                  return (
                    <Box
                      key={fid}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={0.5}
                    >
                      <img
                        src={
                          freeItem.thumbnailImage
                            ? `${AWS_BUCKET_BASE_URL}${freeItem.thumbnailImage}`
                            : DEFAULT_IMAGE
                        }
                        alt={freeItem.title}
                        width={40}
                        height={40}
                        style={{ borderRadius: 4 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {freeItem.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {CURRENCY.symbol} {freeItem.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default SelectedMenuList;
