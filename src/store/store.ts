import { configureStore } from "@reduxjs/toolkit";
import selectedItemListReducer from "./selected-items/selected-items-slice";
import { productFetchSlice } from "@/api/products/products-fetch-slice";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export const store = configureStore({
    reducer: {
        selectedItems: selectedItemListReducer,
        [productFetchSlice.reducerPath]: productFetchSlice.reducer,

    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productFetchSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;