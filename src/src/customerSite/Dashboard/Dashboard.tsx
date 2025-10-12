import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import type { AppDispatch } from "../../redux/store";
import {
  type CategoryWithItems,
  type MenuCategory,
  type BusinessDetails,
  type ReservedTableOrder,
} from "../../types";

import { fetchGetCategoryAndItemsByBusinessId } from "../../redux/reducers/MenusReducer";
import { addToCart } from "../../redux/reducers/Cart";

import Loader from "../../components/Loader";
import BannerSection from "./components/BannerSection";
import CategoryList from "./components/CategoryList";
import MenuItemDetails from "../MenuItemDetails/MenuItemDetails";
import CartButton from "../components/CartButton";
import { fetchAllCategories } from "../../redux/reducers/CategoryReducer";
import Cart from "../Cart/Cart";
import { onFetchBusinessDetails } from "../../redux/reducers/BusinessDetailsReducer";
import { fetchTableDetails } from "../../redux/reducers/TableReducer";
import StorageService from "../../../services/StorageService";
import MessageDialog from "../components/MessageDialog";
import MenuSection from "../components/MenuSection";
import { useActionHandlers } from "../hooks/useActionHandlers";
import { useMenuHandlers } from "../hooks/useMenuHandlers";
import ApiService from "../../services/ApiService";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../Constants";
import TableOrderDetails from "./components/TableOrderDetails";

const Dashboard = () => {
  const { businessId } = useParams();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');
  const dispatch: AppDispatch = useDispatch();

  // Store tableId in localStorage if it exists and fetch table details
  useEffect(() => {
    if (tableId) {
      StorageService.setItem('tableId', tableId);
      dispatch(fetchTableDetails(tableId));
    } else {
      StorageService.removeItem('tableId');
    }
  }, [tableId, dispatch]);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const [opencart, setCartOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reservedTableOrders, setReservedTableOrders] = useState<ReservedTableOrder[]>([]);
  // Custom hooks for handling actions and menu
  const {
    waiterLoading,
    checkoutLoading,
    messageLoading,
    messageDialogOpen,
    setMessageDialogOpen,
    handleActionClick,
    handleSendMessage,
  } = useActionHandlers();

  const {
    cartItems,
    itemDetails,
    selectedVariation,
    removedIngredients,
    selectedOptions,
    onHandleAdd,
    onHandleRemove,
    onDeleteItem,
    onCloseDetails,
  } = useMenuHandlers();

  const { categoriesList, loading: categoriesLoading } = useSelector(
    (state: {
      userCategories: { categoriesList: MenuCategory[]; loading: boolean };
    }) => state.userCategories
  );

  const { categoryWithItems, loading, menuLoading } = useSelector(
    (state: {
      userMenus: {
        categoryWithItems: CategoryWithItems[];
        loading: boolean;
        menuLoading: boolean;
      };
    }) => state.userMenus
  );
  const { businessDetails, loading: businessLoading } = useSelector(
    (state: {
      businessDetails: {
        businessDetails: BusinessDetails | null;
        loading: boolean;
      };
    }) => state.businessDetails
  );
  const { tableDetails, loading: tableLoading } = useSelector(
    (state: {
      table: {
        tableDetails: any;
        loading: boolean;
      };
    }) => state.table
  );

  const isInitialLoading = categoriesLoading || loading || businessLoading || tableLoading;

  useEffect(() => {
    if (businessId) {
      dispatch(onFetchBusinessDetails(businessId));
      // dispatch(fetchAllOffers(businessId));
      dispatch(fetchAllCategories(businessId));
      dispatch(fetchGetCategoryAndItemsByBusinessId(businessId));
    }
  }, [businessId, dispatch]);

  // Prevent body scroll on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 600;
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);



  const onSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const target = categoryRefs.current[categoryId];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // Filter menu items based on search term
  const filteredCategoryWithItems = searchTerm.trim() === ""
    ? categoryWithItems
    : categoryWithItems.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(cat => cat.items.length > 0);

  const onGetOrderDetails = async () => {
    if (tableDetails.rtId) {
      try {
        const response = await ApiService.request('GET', `${ENDPOINTS.TABLES.RESERVED_TABLE_ORDERS}${tableDetails.rtId}`);
        if (response.length > 0) {
          setReservedTableOrders(response);
        } else {
          toast.error("No orders found");
        }
      } catch (error) {
        toast.error("Failed to get orders:" + error);
      }
    };
  }
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          height: "100%", // Fixed height on mobile
          overflow: { xs: "auto", sm: "visible" }, // Scrollable on mobile
          px: { xs: 1, sm: 2, md: 2 }, // Responsive horizontal padding
          py: { xs: 1, sm: 2 }, // Responsive vertical padding
          pb: { xs: 10, sm: 10 }, // Extra bottom padding for cart button
        }}
      >
        {isInitialLoading ? (
          <Loader />
        ) : (
          <>
            {businessDetails && (
              <BannerSection
                bannerImage={
                  JSON.parse(businessDetails.brandAssets)?.banner || ""
                }
                businessName={businessDetails.businessName}
                tableNumber={tableDetails?.tableNumber?.toString() || ""}
                onActionClick={handleActionClick}
                waiterLoading={waiterLoading}
                checkoutLoading={checkoutLoading}
                sessionTableAmount={tableDetails?.sessionTableAmount || 0}
                onGetOrderDetails={onGetOrderDetails}
                businessDetails={businessDetails}
              />
            )}
            {categoriesList.length > 0 && (
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1200,
                  bgcolor: "#fff",
                  my: { xs: 1, sm: 1.5, md: 2 }, // Responsive margin
                  mx: { xs: -1, sm: 0 }, // Negative margin on mobile to extend to edges
                  px: { xs: 1, sm: 0 }, // Add padding back on mobile
                }}
              >
                <CategoryList
                  categoriesList={categoriesList}
                  selectedCategory={selectedCategory}
                  onSelectCategory={onSelectCategory}
                  onSearch={handleSearch}
                />
              </Box>
            )}
            <MenuSection
              filteredCategoryWithItems={filteredCategoryWithItems}
              searchTerm={searchTerm}
              onHandleAdd={onHandleAdd}
              onHandleRemove={onHandleRemove}
              onDeleteItem={onDeleteItem}
              categoryRefs={categoryRefs}
            />
          </>
        )}

        {itemDetails && itemDetails.id && (
          <MenuItemDetails
            itemDetails={itemDetails}
            variations={selectedVariation}
            ingredients={removedIngredients}
            options={selectedOptions}
            onCloseDetails={onCloseDetails}
            onAddToCart={({
              title,
              quantity,
              thumbnailImage,
              variation,
              optionGroups,
              removedIngredients,
              allergies,
              price,
              totalPrice,
            }) => {
              dispatch(
                addToCart({
                  title,
                  itemId: itemDetails.id,
                  quantity,
                  thumbnailImage,
                  variation,
                  allergies,
                  optionGroups,
                  removedIngredients,
                  price,
                  totalPrice,
                })
              );
              onCloseDetails();
            }}
          />
        )}

        {opencart && (
          <Cart
            cartItems={cartItems}
            setCartOpen={setCartOpen}
            opencart={opencart}
            businessId={businessId || ""}
          />
        )}
      </Box>

      {/* Cart Button - Fixed Bottom Position */}
      <CartButton
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        showCart={true}
      />
      {menuLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={9999}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Loader />
        </Box>
      )}

      {/* Message Dialog */}
      <MessageDialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        onSendMessage={handleSendMessage}
        loading={messageLoading}
      />
      {reservedTableOrders.length > 0 && (
        <TableOrderDetails orderDetails={reservedTableOrders} onClose={() => setReservedTableOrders([])} />
      )}
    </>
  );
};

export default Dashboard;
