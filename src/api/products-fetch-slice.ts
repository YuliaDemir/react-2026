import { API_URL, PRODUCTS_PER_PAGE } from "@/constants";
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
    endpoints: (builder) => ({
        getProducts: builder.query<TransformedApiResponse, number>({
            query: (page: number) => ({
                url: '',
                params: {
                    limit: PRODUCTS_PER_PAGE,
                    skip: (page - 1) * PRODUCTS_PER_PAGE,
                }
            }),

            transformResponse: (res: ApiResponse) => getTransformedResponse(res),
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
            }
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
            transformResponse: (res: ApiResponse) => getTransformedResponse(res),
        })
    })
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useSearchProductsByNameQuery,
} = productFetchSlice;
