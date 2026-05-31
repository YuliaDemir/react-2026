import { API_CACHE_TTL_SECONDS, API_URL, PRODUCTS_PER_PAGE } from "@/constants";
import type { ApiProduct, Product, TransformedProductsApiResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTransformedProductsResponse } from "./get-transformed-products-response";

export const ProductsApiTags = {
    Products: "Products",
} as const;

export const productFetchSlice = createApi({
    reducerPath: 'productsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes: [ProductsApiTags.Products],

    keepUnusedDataFor: API_CACHE_TTL_SECONDS,

    refetchOnReconnect: true,

    endpoints: (builder) => ({
        getProducts: builder.query<TransformedProductsApiResponse, { page: number, limit?: number }>({
            query: ({ page, limit = PRODUCTS_PER_PAGE }: { page: number, limit?: number }) => ({
                url: '',
                params: {
                    limit,
                    skip: (page - 1) * limit,
                }
            }),

            transformResponse: getTransformedProductsResponse,

            providesTags: (_result, _error, page) => [
                { type: ProductsApiTags.Products, id: "ALL" },
                { type: ProductsApiTags.Products, id: `LIST--${page}` },
            ],
        }),

        getProductDetails: builder.query<Product, number>({
            query: (id: number) => ({
                url: `/${id}`,
            }),

            transformResponse: (res: ApiProduct) => {
                const product = { ...res, image: res.images[0] }
                return product;
            },

            providesTags: (_result, _error, id) => [
                { type: ProductsApiTags.Products, id: "ALL" },
                { type: ProductsApiTags.Products, id },
            ],
        }),

        searchProductsByName: builder.query<TransformedProductsApiResponse, { q: string, page: number }>({
            query: ({ q, page, limit = PRODUCTS_PER_PAGE }: { q: string, page: number, limit?: number }) => ({
                url: "/search",
                params: {
                    q,
                    limit,
                    skip: (page - 1) * limit,
                },
            }),

            transformResponse: getTransformedProductsResponse,

            providesTags: (_result, _error, { q, page }) => [
                { type: ProductsApiTags.Products, id: "ALL" },
                { type: ProductsApiTags.Products, id: `LIST-${q}-${page}` },
            ],
        })
    })
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useSearchProductsByNameQuery,
} = productFetchSlice;
