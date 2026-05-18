import type { Product } from "@/types/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

type InitialStateType = {
    selectedProductList: Product[],
}

const initialState: InitialStateType = {
    selectedProductList: [],
}

const selectedItemListSlice = createSlice({
    name: 'selectedItemList',
    initialState,
    reducers: {
        addProduct(state, action: PayloadAction<Product>) {
            state.selectedProductList.push(action.payload);
        },

        removeProduct(state, action: PayloadAction<number>) {
            state.selectedProductList = state.selectedProductList.filter(prod => prod.id !== action.payload);
        },

        clearList(state) {
            state.selectedProductList = [];
        }
    }
});

export const selectIsProductSelected = (id: Product["id"]) =>
    (state: RootState) =>
        state.selectedItems.selectedProductList.find(prod => prod.id === id);


export const { addProduct, removeProduct, clearList } = selectedItemListSlice.actions;
export default selectedItemListSlice.reducer;