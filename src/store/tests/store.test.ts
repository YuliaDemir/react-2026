// store.test.ts

import { clearList } from "@/store/selected-items/selected-items-slice";
import { store } from "@/store/store";
import { describe, expect, it } from "vitest";


describe("store", () => {
    it("creates store with selectedItems reducer", () => {
        const state = store.getState();

        expect(state).toHaveProperty("selectedItems");
    });

    it("has dispatch function", () => {
        expect(store.dispatch).toBeTypeOf("function");
    });

    it("handles selectedItems actions", () => {
        store.dispatch(clearList());

        const state = store.getState();

        expect(state.selectedItems.selectedProductList).toEqual([]);
    });
});