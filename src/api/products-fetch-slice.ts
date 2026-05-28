import { API_CACHE_TTL_SECONDS, API_URL, PRODUCTS_PER_PAGE } from "@/constants";
import type { ApiProduct, ApiResponse, TransformedApiResponse } from "@/types/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getTransformedResponse(data: ApiResponse): TransformedApiResponse {
    const products = data.products.map(product => { return { ...product, image: product.images[0] } });
    return {
        products,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
    };;
}

export const productFetchSlice = createApi({
    reducerPath: 'productsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
    }),

    tagTypes: ["Products"],

    keepUnusedDataFor: API_CACHE_TTL_SECONDS,

    refetchOnReconnect: true,

    endpoints: (builder) => ({
        getProducts: builder.query<TransformedApiResponse, number>({
            query: (page: number) => ({
                url: '',
                params: {
                    limit: PRODUCTS_PER_PAGE,
                    skip: (page - 1) * PRODUCTS_PER_PAGE,
                }
            }),

            transformResponse: getTransformedResponse,

            providesTags: (_result, _error, page) => [
                { type: "Products" as const, id: "ALL" },
                { type: "Products" as const, id: `LIST-${page}` },
            ],
        }),

        getProductDetails: builder.query<TransformedApiResponse, number>({
            query: (id: number) => ({
                url: `/${id}`,
            }),

            transformResponse: (res: ApiProduct) => {
                const product = { ...res, image: res.images[0] }
                return {
                    products: [product],
                    total: 1,
                    skip: 0,
                    limit: 1,
                };
            },

            providesTags: (_result, _error, id) => [
                { type: "Products" as const, id: "ALL" },
                { type: "Products" as const, id },
            ],
        }),

        searchProductsByName: builder.query<TransformedApiResponse, { q: string, page: number }>({
            query: ({ q, page }: { q: string, page: number }) => ({
                url: "/search",
                params: {
                    q,
                    limit: PRODUCTS_PER_PAGE,
                    skip: (page - 1) * PRODUCTS_PER_PAGE,
                },
            }),

            transformResponse: getTransformedResponse,

            providesTags: (_result, _error, { q, page }) => [
                { type: "Products" as const, id: "ALL" },
                { type: "Products" as const, id: `SEARCH-${q}-${page}` },
            ],
        })
    })
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useSearchProductsByNameQuery,
} = productFetchSlice;
