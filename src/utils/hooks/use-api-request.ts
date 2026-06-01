import { useGetProductsQuery, useSearchProductsByNameQuery } from "@/api/products/products-fetch-slice";

export const useApiRequest = (query: string, page: number = 1) => {
    const trimmedQuery = query.trim();
    const shouldFetchAllProducts = !trimmedQuery;

    const productList = useGetProductsQuery({ page }, { skip: !shouldFetchAllProducts });
    const searchedProductList = useSearchProductsByNameQuery(
        { q: trimmedQuery, page },
        { skip: shouldFetchAllProducts }
    );

    if (!trimmedQuery) {
        return productList;
    }

    return searchedProductList;
};
