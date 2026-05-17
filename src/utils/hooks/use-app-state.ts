import { useCallback, useEffect, useState } from "react";
import type { ApiResponse } from "../../types/interfaces";
import { ErrorHandler } from "../error-handler";
import { getProducts } from "../get-products";

const EMPTY_PRODUCTS = {
    products: [],
    total: 0,
    skip: 0,
    limit: 0,
}

export const useAppState = (query: string | null, page?: number) => {
    const [data, setData] = useState<ApiResponse>(EMPTY_PRODUCTS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorHandler | null>(null);
    const [fatalError, setFatalError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setFatalError(null);

        try {
            if (query === null) {
                setError(new ErrorHandler('Id is not provided', 404));
                return;
            }

            const result: ApiResponse = await getProducts(query!, page);

            setData(result);
        } catch (err) {
            setData(EMPTY_PRODUCTS);

            if (
                err instanceof ErrorHandler &&
                err.status >= 400 &&
                err.status < 600
            ) {
                setError(err);
                return;
            }

            if (err instanceof Error) {
                setFatalError(err);
                return;
            }

            setFatalError(new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, [query, page]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const products = data.products.map(product => { return { ...product, image: product.images[0] } });

    return {
        data: products,
        isLoading,
        error,
        fatalError,
        setFatalError,
        total: data.total,
    };
};