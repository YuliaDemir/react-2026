import { configureStore } from "@reduxjs/toolkit";
import selectedItemListReducer from "./selected-items/selected-items-slice";
import { productFetchSlice } from "@/api/products-fetch-slice";

export const store = configureStore({
    reducer: {
        selectedItems: selectedItemListReducer,
        [productFetchSlice.reducerPath]: productFetchSlice.reducer,

    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(productFetchSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;