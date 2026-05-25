import { describe, expect, it } from "vitest";

import reducer, {
    addProduct,
    removeProduct,
    clearList,
} from "../selected-items/selected-items-slice";

import type { Product } from "@/types/interfaces";

const product1: Product = {
    id: 1,
    title: "Mascara",
    description: "Black mascara",
    image: "mascara.jpg",
    category: "",
    price: "",
    stock: 0
};

const product2: Product = {
    id: 2,
    title: "Lipstick",
    description: "Red lipstick",
    image: "lipstick.jpg",
    category: "",
    price: "",
    stock: 0
};

describe("selectedItemsSlice", () => {
    it("returns initial state", () => {
        const state = reducer(undefined, { type: "unknown" });

        expect(state).toEqual({
            selectedProductList: [],
        });
    });

    it("adds product", () => {
        const state = reducer(undefined, addProduct(product1));

        expect(state.selectedProductList).toEqual([product1]);
    });

    it("adds multiple products", () => {
        const stateAfterFirstProduct = reducer(undefined, addProduct(product1));
        const stateAfterSecondProduct = reducer(
            stateAfterFirstProduct,
            addProduct(product2)
        );

        expect(stateAfterSecondProduct.selectedProductList).toEqual([
            product1,
            product2,
        ]);
    });

    it("removes product by id", () => {
        const initialState = {
            selectedProductList: [product1, product2],
        };

        const state = reducer(initialState, removeProduct(product1.id));

        expect(state.selectedProductList).toEqual([product2]);
    });

    it("does not change list when removing product with unknown id", () => {
        const initialState = {
            selectedProductList: [product1, product2],
        };

        const state = reducer(initialState, removeProduct(999));

        expect(state.selectedProductList).toEqual([product1, product2]);
    });

    it("clears selected products list", () => {
        const initialState = {
            selectedProductList: [product1, product2],
        };

        const state = reducer(initialState, clearList());

        expect(state.selectedProductList).toEqual([]);
    });
});