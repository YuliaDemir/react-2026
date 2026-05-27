import { useGetProductDetailsQuery, useGetProductsQuery, useSearchProductsByNameQuery } from "@/api/products-fetch-slice";

const isValidProductId = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return false;
    }

    const id = Number(trimmedValue);

    return Number.isInteger(id) && id > 0;
};


export const useApiRequest = (query: string, page: number = 1) => {
    const trimmedQuery = query.trim();
    const isId = isValidProductId(trimmedQuery);

    const productList = useGetProductsQuery(page, { skip: !!trimmedQuery });
    const productById = useGetProductDetailsQuery(+trimmedQuery, { skip: !isId });
    const searchedProductList = useSearchProductsByNameQuery(
        { q: trimmedQuery, page },
        { skip: !trimmedQuery || isId }
    );

    if (!trimmedQuery) {
        return productList;
    }

    if (isId) {
        return productById
    };

    return searchedProductList;
};
