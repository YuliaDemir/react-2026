import { useApiRequest } from "./use-api-request";

export const useAppState = (query: string, page?: number) => {
    const { data, isLoading, error } = useApiRequest(query, page);

    return {
        products: data?.products,
        isLoading,
        error,
        total: data?.total,
    };
};