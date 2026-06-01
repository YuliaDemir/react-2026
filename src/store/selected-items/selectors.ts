import type { Product } from "@/types";
import type { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";

const selectSelectedItems = (state: RootState) => state.selectedItems;

export const selectSelectedProductList = createSelector(
    selectSelectedItems,
    (selectSelectedItems) => selectSelectedItems.selectedProductList
)

export const selectSelectedProductById = (id: Product["id"]) => createSelector(
    selectSelectedProductList,
    (list) => list.find(prod => prod.id === id)
)
