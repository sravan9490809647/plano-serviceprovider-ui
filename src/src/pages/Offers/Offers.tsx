import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StickyBox } from "../../Styles";
import CustomPaperWrapper from "../../components/CustomPaperWrapper";
import { useNavigate } from "react-router-dom";
import type { OfferDefinition } from "../../types";
import { Offers } from "../../Constants";

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const onCreateOffer = (offer: OfferDefinition) => {
    navigate("/offers/create", {
      state: { id: offer.id },
    });
  };
  return (
    <Box>
      <StickyBox>
        <Typography variant="h3">Offers</Typography>
      </StickyBox>

      <Box p={3}>
        <Grid container spacing={2}>
          {Offers.map((offer, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              key={index}
              sx={{ display: "flex" }}
            >
              <CustomPaperWrapper
                onClick={() => onCreateOffer(offer)}
                sx={{
                  cursor: "pointer",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between", // optional
                }}
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

export default OffersPage;
