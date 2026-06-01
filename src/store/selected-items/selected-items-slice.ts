import type { Product } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export const { addProduct, removeProduct, clearList } = selectedItemListSlice.actions;
export default selectedItemListSlice.reducer;