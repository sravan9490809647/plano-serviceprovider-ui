import React from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";

import type { MenuItem, Offer } from "../../types";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import { AWS_BUCKET_BASE_URL, CURRENCY, DEFAULT_IMAGE, FONT_FAMILY } from "../../Constants";
import { elipsesText } from "../../Styles";
import QuantityController from "../components/QuantityController";

import { useSelector } from "react-redux";

const getOfferLabel = (offer: Offer) => {
  switch (offer.type) {
    case "Buy1GetFreeItem":
      return "Buy 1 Get 1";
  }
};

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  handleAdd: () => void;
  handleRemove: () => void;
  isCart?: boolean;
  onDelete?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantity,
  handleAdd,
  handleRemove,
  isCart,
}) => {
  const theme = useTheme();
  const { offersList } = useSelector(
    (state: { offers: { offersList: Offer[]; loading: boolean } }) =>
      state.offers
  );

  const disabled = !item.inStock;

  const getActiveOfferForItem = (itemId: string) => {
    const today = new Date();
    const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // Mon=1..Sun=7
    const nowISO = today.toISOString();

    const activeOffer = offersList.find((offer) => {
      if (!offer.validFrom || !offer.validTo) return false;

      const isDateValid = nowISO >= offer.validFrom && nowISO <= offer.validTo;

      let isDayValid = true;
      if (offer.daysOfWeek) {
        const days = offer.daysOfWeek
          .split(",")
          .map((d) => d.trim().toLowerCase());

        isDayValid =
          days.includes(currentDay.toString()) ||
          days.includes(
            ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][currentDay - 1]
          );
      }

      const isItemValid = offer.qualifyingItems?.includes(itemId);

      return isDateValid && isDayValid && isItemValid;
    });

    return activeOffer || null;
  };

  const activeOffer = getActiveOfferForItem(item.id);

  return (
    <CustomPaperWrapper
      sx={{
        px: 1,
        border: "none !important",
        borderWidth: 0,
        borderStyle: "none",
        borderColor: "transparent",
        boxShadow: "none",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        position: "relative",
        mb: 0,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Image */}
        <Grid item xs={8} sm={8} display="flex" alignItems="center">
          <Box
            sx={{
              position: "relative",
              width: 125,
              height: 85,
              marginRight: 1.5,
            }}
          >
            <Box
              component="img"
              src={
                item.thumbnailImage
                  ? `${AWS_BUCKET_BASE_URL}${item.thumbnailImage}`
                  : DEFAULT_IMAGE
              }
              alt={item.title}
              sx={{
                width: 125,
                height: 85,
                marginRight: 1.5,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Title & Description */}
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: FONT_FAMILY.BOLD,
                fontSize: "0.8rem", // mobile font size
                [theme.breakpoints.up('md')]: {
                  fontSize: "1rem", // larger desktop font size
                },
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={400}
              sx={{
                ...elipsesText,
                WebkitLineClamp: 2,
                fontSize: "0.7rem", // mobile font size
                [theme.breakpoints.up('md')]: {
                  fontSize: "0.8rem", // larger desktop font size
                },
              }}
            >
              {item.description}
            </Typography>
            {activeOffer && (
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  p: 0.5,
                  borderRadius: 1,
                  fontSize: "9px", // mobile font size
                  [theme.breakpoints.up('md')]: {
                    fontSize: "10px", // larger desktop font size
                  },
                }}
              >
                {getOfferLabel(activeOffer)}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Price & Quantity */}
        <Grid item xs={4} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography
              variant="h5"
              sx={{
                fontFamily: FONT_FAMILY.BOLD,
                fontSize: "0.8rem", // mobile font size
                [theme.breakpoints.up('md')]: {
                  fontSize: "1rem", // larger desktop font size
                },
              }}
            >
              {CURRENCY.symbol}
              {item.price.toFixed(2)}
            </Typography>
            {!isCart && (
              <Box mt={1}>
                <QuantityController
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  quantity={quantity}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Out of Stock Overlay */}
      {disabled && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(255,255,255,0.6)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ borderRadius: 1 }}
        >
          <Typography
            variant="caption"
            color="error"
            fontWeight={600}
            sx={{
              fontSize: "0.7rem", // mobile font size
              [theme.breakpoints.up('md')]: {
                fontSize: "0.8rem", // larger desktop font size
              },
            }}
          >
            Out of Stock
          </Typography>
        </Box>
      )}
    </CustomPaperWrapper>
  );
};

export default MenuItemCard;
