import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";

import { API_URL, PRODUCTS_PER_PAGE } from "@/constants";
import type { ApiProduct } from "@/types";
import {
    productFetchSlice,
    ProductsApiTagsAndIds,
} from "../api/products/products-fetch-slice";

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

const createProductsResponse = (products: ApiProduct[] = [createProduct()]) => ({
    products,
    total: products.length,
    skip: 0,
    limit: PRODUCTS_PER_PAGE,
});

const createStore = () =>
    configureStore({
        reducer: {
            [productFetchSlice.reducerPath]: productFetchSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(productFetchSlice.middleware),
    });

const mockFetchSuccess = (body: unknown) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        })
    );

    vi.stubGlobal("fetch", fetchMock);

    return fetchMock;
};

const getCalledUrl = (fetchMock: ReturnType<typeof mockFetchSuccess>) => {
    const request = fetchMock.mock.calls[0][0];

    if (request instanceof Request) {
        return new URL(request.url);
    }

    return new URL(String(request));
};

describe("ProductsApiTagsAndIds", () => {
    it("returns correct products tag name", () => {
        expect(ProductsApiTagsAndIds.tags.products).toBe("Products");
    });

    it("returns correct tag ids", () => {
        expect(ProductsApiTagsAndIds.ids.all).toBe("ALL");
        expect(ProductsApiTagsAndIds.ids.listPerPage(2)).toBe("LIST--2");
        expect(ProductsApiTagsAndIds.ids.listPerPageAndQuery(3, "phone")).toBe(
            "LIST-phone-3"
        );
    });
});

describe("productFetchSlice", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("has correct reducerPath", () => {
        expect(productFetchSlice.reducerPath).toBe("productsApi");
    });

    it("getProducts sends request with limit and skip", async () => {
        const store = createStore();
        const fetchMock = mockFetchSuccess(createProductsResponse());

        await store
            .dispatch(
                productFetchSlice.endpoints.getProducts.initiate({
                    page: 3,
                    limit: 10,
                })
            )
            .unwrap();

        const url = getCalledUrl(fetchMock);

        expect(url.origin + url.pathname).toBe(API_URL);
        expect(url.searchParams.get("limit")).toBe("10");
        expect(url.searchParams.get("skip")).toBe("20");
    });

    it("getProducts uses default limit from PRODUCTS_PER_PAGE", async () => {
        const store = createStore();
        const fetchMock = mockFetchSuccess(createProductsResponse());

        await store
            .dispatch(
                productFetchSlice.endpoints.getProducts.initiate({
                    page: 2,
                })
            )
            .unwrap();

        const url = getCalledUrl(fetchMock);

        expect(url.searchParams.get("limit")).toBe(String(PRODUCTS_PER_PAGE));
        expect(url.searchParams.get("skip")).toBe(String(PRODUCTS_PER_PAGE));
    });

    it("getProducts transforms products and adds image from first images item", async () => {
        const store = createStore();

        const apiProduct = createProduct({
            id: 10,
            title: "Phone",
            images: ["phone-main.jpg", "phone-second.jpg"],
        });

        mockFetchSuccess(createProductsResponse([apiProduct]));

        const result = await store
            .dispatch(
                productFetchSlice.endpoints.getProducts.initiate({
                    page: 1,
                })
            )
            .unwrap();

        expect(result.products[0]).toEqual({
            ...apiProduct,
            image: "phone-main.jpg",
        });
    });

    it("getProductDetails sends request by product id", async () => {
        const store = createStore();
        const fetchMock = mockFetchSuccess(
            createProduct({
                id: 7,
            })
        );

        await store
            .dispatch(productFetchSlice.endpoints.getProductDetails.initiate(7))
            .unwrap();

        const url = getCalledUrl(fetchMock);

        expect(url.origin + url.pathname).toBe(`${API_URL}/7`);
    });

    it("getProductDetails transforms product and adds image from first images item", async () => {
        const store = createStore();

        const apiProduct = createProduct({
            id: 7,
            images: ["details-main.jpg", "details-second.jpg"],
        });

        mockFetchSuccess(apiProduct);

        const result = await store
            .dispatch(productFetchSlice.endpoints.getProductDetails.initiate(7))
            .unwrap();

        expect(result).toEqual({
            ...apiProduct,
            image: "details-main.jpg",
        });
    });

    it("searchProductsByName sends request with q, limit and skip", async () => {
        const store = createStore();
        const fetchMock = mockFetchSuccess(createProductsResponse());

        await store
            .dispatch(
                productFetchSlice.endpoints.searchProductsByName.initiate({
                    q: "phone",
                    page: 4,
                })
            )
            .unwrap();

        const url = getCalledUrl(fetchMock);

        expect(url.origin + url.pathname).toBe(`${API_URL}/search`);
        expect(url.searchParams.get("q")).toBe("phone");
        expect(url.searchParams.get("limit")).toBe(String(PRODUCTS_PER_PAGE));
        expect(url.searchParams.get("skip")).toBe(String(PRODUCTS_PER_PAGE * 3));
    });

    it("searchProductsByName transforms products and adds image from first images item", async () => {
        const store = createStore();

        const apiProduct = createProduct({
            id: 15,
            title: "Search result",
            images: ["search-main.jpg"],
        });

        mockFetchSuccess(createProductsResponse([apiProduct]));

        const result = await store
            .dispatch(
                productFetchSlice.endpoints.searchProductsByName.initiate({
                    q: "phone",
                    page: 1,
                })
            )
            .unwrap();

        expect(result.products[0]).toEqual({
            ...apiProduct,
            image: "search-main.jpg",
        });
    });
});