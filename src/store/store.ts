import { configureStore } from "@reduxjs/toolkit";
import selectedItemListReducer from "./selected-items-slice";

export const store = configureStore({
    reducer: {
        selectedItems: selectedItemListReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;