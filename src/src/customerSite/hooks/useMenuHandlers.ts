import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { type MenuItem, type OptionGroup, type UserMenuItem } from "../../types";
import {
    addToCart,
    deleteFromCart,
    removeFromCart,
    type CartItem,
} from "../../redux/reducers/Cart";
import {
    clearItemDetails,
    getItemById,
} from "../../redux/reducers/UserMenusReducer";

export const useMenuHandlers = () => {
    const dispatch: AppDispatch = useDispatch();
    const [selectedVariation, setSelectedVariation] = useState<string>("");
    const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<OptionGroup[]>([]);

    const cartItems = useSelector<RootState, CartItem[]>(
        (state) => state.cart.items
    );

    const { itemDetails } = useSelector(
        (state: {
            userMenus: {
                itemDetails: UserMenuItem;
            };
        }) => state.userMenus
    );

    useEffect(() => {
        if (itemDetails && itemDetails.id) {
            const hasNoDetails =
                (!itemDetails.itemVariations ||
                    itemDetails.itemVariations.length === 0) &&
                (!itemDetails.allergies ||
                    itemDetails.allergies === "[]" ||
                    itemDetails.allergies === '[]' ||
                    (itemDetails.allergies.startsWith('[') && JSON.parse(itemDetails.allergies).length === 0)) &&
                (!itemDetails.ingredients || itemDetails.ingredients.length === 0) &&
                (!itemDetails.optionGroups || itemDetails.optionGroups.length === 0);

            if (hasNoDetails) {
                // No need to open modal, add directly
                dispatch(
                    addToCart({
                        title: itemDetails.title,
                        itemId: itemDetails.id,
                        quantity: 1,
                        price: itemDetails.price,
                        totalPrice: itemDetails.price,
                        thumbnailImage: itemDetails.thumbnailImage || null,
                    })
                );
                dispatch(clearItemDetails());
            } else {
                // has details → prepare modal state
                if (itemDetails.itemVariations?.length) {
                    setSelectedVariation(itemDetails.itemVariations[0].id);
                }
                if (itemDetails.ingredients?.length) {
                    setRemovedIngredients([]);
                }
                if (itemDetails.optionGroups?.length) {
                    setSelectedOptions(itemDetails.optionGroups);
                }
            }
        }
    }, [itemDetails]);

    const onHandleAdd = (item: MenuItem) => {
        const alreadyInCart = cartItems.some(
            (cartItem) => cartItem.itemId === item.id
        );

        if (alreadyInCart) {
            // Increment quantity directly
            dispatch(
                addToCart({
                    title: item.title,
                    itemId: item.id,
                    price: item.price,
                    quantity: 1,
                    totalPrice: item.price, // For simple items, totalPrice = price
                })
            );
        } else {
            // Open modal to select variations/options
            dispatch(getItemById(item.id));
        }
    };

    const onHandleRemove = (itemId: string) => {
        dispatch(
            removeFromCart({
                itemId,
                quantity: 1,
            })
        );
    };

    const onDeleteItem = (itemId: string) => {
        dispatch(deleteFromCart({ itemId }));
    };

    const onCloseDetails = () => {
        dispatch(clearItemDetails());
        setSelectedVariation("");
        setRemovedIngredients([]);
        setSelectedOptions([]);
    };

    return {
        cartItems,
        itemDetails,
        selectedVariation,
        removedIngredients,
        selectedOptions,
        onHandleAdd,
        onHandleRemove,
        onDeleteItem,
        onCloseDetails,
    };
}; 