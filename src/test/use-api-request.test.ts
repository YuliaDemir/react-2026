import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    useGetProductsQuery,
    useSearchProductsByNameQuery,
} from "@/api/products/products-fetch-slice";
import { useApiRequest } from "@/utils/hooks/use-api-request";

vi.mock("@/api/products/products-fetch-slice", () => ({
    useGetProductsQuery: vi.fn(),
    useSearchProductsByNameQuery: vi.fn(),
}));

const productListResult = {
    data: {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
    },
    isFetching: false,
    error: undefined,
};

const searchedProductListResult = {
    data: {
        products: [],
        total: 1,
        skip: 0,
        limit: 10,
    },
    isFetching: false,
    error: undefined,
};

describe("useApiRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useGetProductsQuery).mockReturnValue(
            productListResult as unknown as ReturnType<typeof useGetProductsQuery>
        );

        vi.mocked(useSearchProductsByNameQuery).mockReturnValue(
            searchedProductListResult as unknown as ReturnType<
                typeof useSearchProductsByNameQuery
            >
        );
    });

    it("fetches all products when query is empty", () => {
        const { result } = renderHook(() => useApiRequest("", 2));

        expect(useGetProductsQuery).toHaveBeenCalledWith(
            { page: 2 },
            { skip: false }
        );

        expect(useSearchProductsByNameQuery).toHaveBeenCalledWith(
            { q: "", page: 2 },
            { skip: true }
        );

        expect(result.current).toBe(productListResult);
    });

    it("fetches all products when query contains only spaces", () => {
        const { result } = renderHook(() => useApiRequest("   ", 3));

        expect(useGetProductsQuery).toHaveBeenCalledWith(
            { page: 3 },
            { skip: false }
        );

        expect(useSearchProductsByNameQuery).toHaveBeenCalledWith(
            { q: "", page: 3 },
            { skip: true }
        );

        expect(result.current).toBe(productListResult);
    });

    it("searches products by name when query is not empty", () => {
        const { result } = renderHook(() => useApiRequest("phone", 4));

        expect(useGetProductsQuery).toHaveBeenCalledWith(
            { page: 4 },
            { skip: true }
        );

        expect(useSearchProductsByNameQuery).toHaveBeenCalledWith(
            { q: "phone", page: 4 },
            { skip: false }
        );

        expect(result.current).toBe(searchedProductListResult);
    });

    it("trims query before searching", () => {
        renderHook(() => useApiRequest("  phone  ", 1));

        expect(useSearchProductsByNameQuery).toHaveBeenCalledWith(
            { q: "phone", page: 1 },
            { skip: false }
        );
    });

    it("uses page 1 by default", () => {
        renderHook(() => useApiRequest(""));

        expect(useGetProductsQuery).toHaveBeenCalledWith(
            { page: 1 },
            { skip: false }
        );

        expect(useSearchProductsByNameQuery).toHaveBeenCalledWith(
            { q: "", page: 1 },
            { skip: true }
        );
    });
});