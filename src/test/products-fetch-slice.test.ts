import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PRODUCTS_PER_PAGE } from "@/constants";
import type { ApiProduct } from "@/types";
import {
    productFetchSlice,
    ProductsApiTagsAndIds,
} from "@/api/products/products-fetch-slice";

const createProduct = (overrides: Partial<ApiProduct> = {}): ApiProduct =>
    ({
        id: 1,
        title: "Test product",
        description: "Test description",
        category: "phones",
        price: 100,
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

const createJsonResponse = (body: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
        ...init,
    });

const mockFetchSuccess = (body: unknown, init?: ResponseInit) => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(() =>
        Promise.resolve(createJsonResponse(body, init))
    );

    vi.stubGlobal("fetch", fetchMock);

    return fetchMock;
};

const createDeferredResponse = () => {
    let resolve!: (response: Response) => void;
    let reject!: (error: unknown) => void;

    const promise = new Promise<Response>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        promise,
        resolve,
        reject,
    };
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

describe("productFetchSlice loading, error and caching behavior", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sets loading state while getProducts query is pending", async () => {
        const store = createStore();
        const deferred = createDeferredResponse();

        const fetchMock = vi.fn<typeof fetch>().mockImplementation(() => {
            return deferred.promise;
        });

        vi.stubGlobal("fetch", fetchMock);

        const queryPromise = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        await Promise.resolve();

        const state = productFetchSlice.endpoints.getProducts.select({
            page: 1,
        })(store.getState());

        expect(state.status).toBe("pending");
        expect(state.isLoading).toBe(true);

        deferred.resolve(createJsonResponse(createProductsResponse()));

        await queryPromise.unwrap();

        queryPromise.unsubscribe();
    });

    it("sets fulfilled state after getProducts query succeeds", async () => {
        const store = createStore();

        const product = createProduct({
            id: 10,
            title: "Phone",
            images: ["phone-main.jpg", "phone-second.jpg"],
        });

        mockFetchSuccess(createProductsResponse([product]));

        const queryPromise = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        const result = await queryPromise.unwrap();

        const state = productFetchSlice.endpoints.getProducts.select({
            page: 1,
        })(store.getState());

        expect(state.status).toBe("fulfilled");
        expect(state.isSuccess).toBe(true);
        expect(state.isLoading).toBe(false);

        expect(result.products[0]).toEqual({
            ...product,
            image: "phone-main.jpg",
        });

        queryPromise.unsubscribe();
    });

    it("sets error state when getProducts query fails", async () => {
        const store = createStore();

        mockFetchSuccess(
            {
                message: "Server error",
            },
            {
                status: 500,
            }
        );

        const queryPromise = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        await expect(queryPromise.unwrap()).rejects.toMatchObject({
            status: 500,
        });

        const state = productFetchSlice.endpoints.getProducts.select({
            page: 1,
        })(store.getState());

        expect(state.status).toBe("rejected");
        expect(state.isError).toBe(true);
        expect(state.error).toMatchObject({
            status: 500,
        });

        queryPromise.unsubscribe();
    });

    it("uses cached data for the same getProducts query args", async () => {
        const store = createStore();

        const product = createProduct({
            id: 1,
            title: "Cached product",
            images: ["cached-image.jpg"],
        });

        const fetchMock = mockFetchSuccess(createProductsResponse([product]));

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        const firstResult = await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        const secondResult = await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(secondResult).toEqual(firstResult);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("does not use the same cache entry for different getProducts page args", async () => {
        const store = createStore();

        const fetchMock = mockFetchSuccess(createProductsResponse());

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 1,
            })
        );

        await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.getProducts.initiate({
                page: 2,
            })
        );

        await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(2);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("uses cached data for the same searchProductsByName query args", async () => {
        const store = createStore();

        const fetchMock = mockFetchSuccess(createProductsResponse());

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "phone",
                page: 1,
            })
        );

        const firstResult = await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "phone",
                page: 1,
            })
        );

        const secondResult = await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(secondResult).toEqual(firstResult);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("does not use the same cache entry for different search q args", async () => {
        const store = createStore();

        const fetchMock = mockFetchSuccess(createProductsResponse());

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "phone",
                page: 1,
            })
        );

        await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "laptop",
                page: 1,
            })
        );

        await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(2);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("does not use the same cache entry for different search page args", async () => {
        const store = createStore();

        const fetchMock = mockFetchSuccess(createProductsResponse());

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "phone",
                page: 1,
            })
        );

        await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.searchProductsByName.initiate({
                q: "phone",
                page: 2,
            })
        );

        await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(2);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("uses cached data for the same getProductDetails id", async () => {
        const store = createStore();

        const product = createProduct({
            id: 7,
            title: "Details product",
            images: ["details-image.jpg"],
        });

        const fetchMock = mockFetchSuccess(product);

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.getProductDetails.initiate(7)
        );

        const firstResult = await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.getProductDetails.initiate(7)
        );

        const secondResult = await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(1);

        expect(secondResult).toEqual(firstResult);
        expect(secondResult).toEqual({
            ...product,
            image: "details-image.jpg",
        });

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });

    it("does not use the same cache entry for different getProductDetails ids", async () => {
        const store = createStore();

        const fetchMock = vi.fn<typeof fetch>().mockImplementation((input) => {
            const url = input instanceof Request ? input.url : String(input);
            const id = Number(url.split("/").at(-1));

            return Promise.resolve(
                createJsonResponse(
                    createProduct({
                        id,
                        title: `Product ${id}`,
                        images: [`product-${id}.jpg`],
                    })
                )
            );
        });

        vi.stubGlobal("fetch", fetchMock);

        const firstQuery = store.dispatch(
            productFetchSlice.endpoints.getProductDetails.initiate(1)
        );

        await firstQuery.unwrap();

        const secondQuery = store.dispatch(
            productFetchSlice.endpoints.getProductDetails.initiate(2)
        );

        await secondQuery.unwrap();

        expect(fetchMock).toHaveBeenCalledTimes(2);

        firstQuery.unsubscribe();
        secondQuery.unsubscribe();
    });
});