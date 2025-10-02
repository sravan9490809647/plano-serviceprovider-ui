import React, { useState } from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StickyBox } from "../../Styles";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import BuyOneGetOneOffer from "./BuyOneGetOneOffer";
import { useLocation } from "react-router-dom";
import PercentageDiscountWholeOrder from "./PercentageDiscountWholeOrder";
import PercentageOrAmountDiscountSelectedItems from "./PercentageOrAmountDiscountSelectedItems";
import FixedAmountDiscountWholeOrder from "./FixedAmountDiscountWholeOrder";
import { Offers } from "../../Constants";
import FreeItemWithPurchase from "./FreeItemWithPurchase";
type LocationState = {
  id: string;
};

const OffersCreateContainer: React.FC = () => {
  const location = useLocation();
  const { id } = (location.state as LocationState) || { id: "" };

  const [selectedOffer, setSelectedOffer] = useState<string | null>(id);

  const renderSelectedOffer = () => {
    const offer = Offers.find((offer) => offer.id === selectedOffer);
    switch (selectedOffer) {
      case "buy1free1":
        return <BuyOneGetOneOffer />;
      case "percent_whole":
        return <PercentageDiscountWholeOrder />;
      case "percent_selected":
        return (
          <PercentageOrAmountDiscountSelectedItems
            type="percentage"
            title={offer?.title || ""}
            description={offer?.description || ""}
          />
        );
      case "fixed_whole":
        return <FixedAmountDiscountWholeOrder />;
      case "fixed_selected":
        return (
          <PercentageOrAmountDiscountSelectedItems
            type="amount"
            title={offer?.title || ""}
            description={offer?.description || ""}
          />
        );
      case "free_with_purchase":
        return (
          <FreeItemWithPurchase
            title={offer?.title || ""}
            description={offer?.description || ""}
          />
        );
      default:
        return null;
    }
  };

  if (selectedOffer) {
    return <Box>{renderSelectedOffer()}</Box>;
  }

  return (
    <Box>
      <StickyBox>
        <Typography variant="h3">Offers</Typography>
      </StickyBox>

      <Box p={3}>
        <Grid container spacing={2}>
          {Offers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={offer.id}>
              <CustomPaperWrapper
                onClick={() => setSelectedOffer(offer.id)}
                sx={{ cursor: "pointer" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Box
                      sx={{
                        bgcolor: offer.bgColor,
                        color: "#fff",
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 24,
                      }}
                    >
                      {offer.icon}
                    </Box>
                  </Grid>

                  <Grid item xs>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offer.description}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <IconButton>
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </CustomPaperWrapper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default OffersCreateContainer;
