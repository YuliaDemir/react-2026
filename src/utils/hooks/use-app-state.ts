import { useCallback, useEffect, useState } from "react";
import type { ApiResponse } from "../../types/interfaces";
import { getAllProductsPerPage, searchProductsByName } from "../fetch-data";
import { ErrorHandler } from "../error-handler";
import { usePagination } from "./use-pagination";

export const useAppState = (query: string) => {
    const [data, setData] = useState<ApiResponse["products"]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorHandler | null>(null);
    const [fatalError, setFatalError] = useState<Error | null>(null);

    const { page, setPage } = usePagination();

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setFatalError(null);

        try {
            const result: ApiResponse = query
                ? await searchProductsByName(query)
                : await getAllProductsPerPage(page);

            if (query && result.products.length === 0) {
                throw new ErrorHandler("Products not found", 404);
            }

            setTotal(result.total);
            setData(result.products);
        } catch (err) {
            setData([]);

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

    return {
        data,
        isLoading,
        error,
        fatalError,
        setFatalError,
        page,
        setPage,
        total,
    };
};