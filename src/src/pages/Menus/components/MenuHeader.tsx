import React, { useState } from "react";
import { Grid, Typography, Button, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Input from "../../../components/Input";
import { useNavigate } from "react-router-dom";
import { StickyBox } from "../../../Styles";
import { COLORS, FONT_FAMILY } from "../../../Constants";

const MenuHeader: React.FC<{
  onClickCategory: () => void;
  onSearchChange: (val: string) => void;
}> = ({ onClickCategory, onSearchChange }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNewItem = () => {
    navigate("/menus/add");
    handleClose();
  };

  const handleUploadMenu = () => {
    navigate("/menus/uploadmenu");
    handleClose();
  };

  const handleAddCategory = () => {
    onClickCategory();
    handleClose();
  };

  return (
    <StickyBox>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h3">Menu Management</Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={5}>
              <Input
                fullWidth
                placeholder="Search menus or categories..."
                startIcon={<SearchIcon color="action" sx={{ color: COLORS.BLACK }} />}
                inputStyles={{ padding: "12px", color: "#737373" }}
                sx={{ backgroundColor: COLORS.SEARCH_BOX_BG, borderWidth: "0px", borderColor: COLORS.SEARCH_BOX_BG }}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3} md="auto">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleMenuClick}
                fullWidth
              >
                Add New
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleAddNewItem} sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>Add New Item</MenuItem>
                <MenuItem onClick={handleAddCategory} sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>
                  Add New Category
                </MenuItem>
                <MenuItem onClick={handleUploadMenu} sx={{ fontFamily: `${FONT_FAMILY.MEDIUM} !important` }}>Upload New Menu</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StickyBox>
  );
};

export default MenuHeader;
