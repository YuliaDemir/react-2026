import { describe, expect, it } from "vitest";

import type { ApiProduct, ProductsApiResponse } from "@/types";
import { getTransformedProductsResponse } from "@/api/products/get-transformed-products-response";


const createProduct = (overrides: Partial<ApiProduct> = {}): ApiProduct =>
    ({
        id: 1,
        title: "Test product",
        description: "Test description",
        category: "phones",
        price: "100",
        stock: 10,
        images: ["main-image.jpg", "second-image.jpg"],
        ...overrides,
    }) as ApiProduct;

describe("getTransformedProductsResponse", () => {
    it("adds image field from the first product image", () => {
        const product = createProduct({
            id: 10,
            images: ["first-image.jpg", "second-image.jpg"],
        });

        const response: ProductsApiResponse = {
            products: [product],
            total: 1,
            skip: 0,
            limit: 10,
        };

        const result = getTransformedProductsResponse(response);

        expect(result.products[0]).toEqual({
            ...product,
            image: "first-image.jpg",
        });
    });

    it("keeps total, skip and limit from original response", () => {
        const response: ProductsApiResponse = {
            products: [createProduct()],
            total: 100,
            skip: 20,
            limit: 10,
        };

        const result = getTransformedProductsResponse(response);

        expect(result.total).toBe(100);
        expect(result.skip).toBe(20);
        expect(result.limit).toBe(10);
    });

    it("transforms every product in products array", () => {
        const firstProduct = createProduct({
            id: 1,
            images: ["first-product-image.jpg"],
        });

        const secondProduct = createProduct({
            id: 2,
            images: ["second-product-image.jpg"],
        });

        const response: ProductsApiResponse = {
            products: [firstProduct, secondProduct],
            total: 2,
            skip: 0,
            limit: 10,
        };

        const result = getTransformedProductsResponse(response);

        expect(result.products).toEqual([
            {
                ...firstProduct,
                image: "first-product-image.jpg",
            },
            {
                ...secondProduct,
                image: "second-product-image.jpg",
            },
        ]);
    });

    it("returns empty products array when products array is empty", () => {
        const response: ProductsApiResponse = {
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        };

        const result = getTransformedProductsResponse(response);

        expect(result).toEqual({
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        });
    });

    it("does not mutate original product object", () => {
        const product = createProduct({
            images: ["main-image.jpg"],
        });

        const response: ProductsApiResponse = {
            products: [product],
            total: 1,
            skip: 0,
            limit: 10,
        };

        const result = getTransformedProductsResponse(response);

        expect(product).not.toHaveProperty("image");
        expect(result.products[0]).not.toBe(product);
    });
});