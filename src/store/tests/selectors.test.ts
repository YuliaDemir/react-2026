import { describe, expect, it } from "vitest";

import {
    selectSelectedProductList,
    selectSelectedProductById,
} from "../selected-items/selectors";

import type { Product } from "@/types";
import type { RootState } from "../store";

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

const state = {
    selectedItems: {
        selectedProductList: [product1, product2],
    },
} as RootState;

describe("selected items selectors", () => {
    it("selectSelectedProductList returns selected product list", () => {
        expect(selectSelectedProductList(state)).toEqual([product1, product2]);
    });

    it("selectSelectedProductById returns product by id", () => {
        const selector = selectSelectedProductById(product1.id);

        expect(selector(state)).toEqual(product1);
    });

    it("selectSelectedProductById returns undefined when product is not found", () => {
        const selector = selectSelectedProductById(999);

        expect(selector(state)).toBeUndefined();
    });

    it("memoizes selectSelectedProductList result when state reference is the same", () => {
        const firstResult = selectSelectedProductList(state);
        const secondResult = selectSelectedProductList(state);

        expect(firstResult).toBe(secondResult);
    });

    it("memoizes selectSelectedProductById result when state reference is the same", () => {
        const selector = selectSelectedProductById(product2.id);

        const firstResult = selector(state);
        const secondResult = selector(state);

        expect(firstResult).toBe(secondResult);
    });
});