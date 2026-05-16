import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppState } from '../utils/hooks/use-app-state';
import { getProducts } from '../utils/get-products';
import { ErrorHandler } from '../utils/error-handler';
import type { ApiResponse, Product } from '../types/interfaces';

vi.mock('../utils/get-products', () => ({
    getProducts: vi.fn(),
}));

const products: Product[] = [
    {
        id: 1,
        title: 'Mascara',
        description: 'Black mascara',
        images: ['https://example.com/mascara.jpg'],
        category: 'beauty',
        price: '10',
        stock: 15,
    },
];

const apiResponse: ApiResponse = {
    products,
    total: 1,
    skip: 0,
    limit: 10,
};

describe('useAppState', () => {
    const mockedGetProducts = vi.mocked(getProducts);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads products successfully', async () => {
        mockedGetProducts.mockResolvedValue(apiResponse);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual(products);
        });

        expect(mockedGetProducts).toHaveBeenCalledTimes(1);
        expect(mockedGetProducts).toHaveBeenCalledWith('mascara', 1);

        expect(result.current.total).toBe(1);
        expect(result.current.error).toBeNull();
        expect(result.current.fatalError).toBeNull();
    });

    it('sets loading while request is pending', async () => {
        let resolveRequest: (value: ApiResponse) => void;

        mockedGetProducts.mockReturnValue(
            new Promise<ApiResponse>((resolve) => {
                resolveRequest = resolve;
            }),
        );

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        await act(async () => {
            resolveRequest(apiResponse);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual(products);
        });
    });

    it('sets ErrorHandler when query is null', async () => {
        const { result } = renderHook(() => useAppState(null, 1));

        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(ErrorHandler);
        });

        expect(mockedGetProducts).not.toHaveBeenCalled();

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.fatalError).toBeNull();

        expect(result.current.error?.status).toBe(404);
    });

    it('sets error when getProducts throws ErrorHandler with 4xx or 5xx status', async () => {
        const error = new ErrorHandler('Products not found', 404);

        mockedGetProducts.mockRejectedValue(error);

        const { result } = renderHook(() => useAppState('unknown', 1));

        await waitFor(() => {
            expect(result.current.error).toBe(error);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.fatalError).toBeNull();
    });

    it('sets fatalError when getProducts throws regular Error', async () => {
        const fatalError = new Error('Network failed');

        mockedGetProducts.mockRejectedValue(fatalError);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.fatalError).toBe(fatalError);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('sets unknown fatalError when thrown value is not Error', async () => {
        mockedGetProducts.mockRejectedValue('Unknown thrown value');

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.fatalError).toBeInstanceOf(Error);
        });

        expect(result.current.fatalError?.message).toBe('Unknown error');
        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.error).toBeNull();
    });

    it('refetches products when query changes', async () => {
        mockedGetProducts.mockResolvedValue(apiResponse);

        const { rerender } = renderHook(
            ({ query, page }: { query: string; page: number }) =>
                useAppState(query, page),
            {
                initialProps: {
                    query: 'mascara',
                    page: 1,
                },
            },
        );

        await waitFor(() => {
            expect(mockedGetProducts).toHaveBeenCalledWith('mascara', 1);
        });

        rerender({
            query: 'lipstick',
            page: 1,
        });

        await waitFor(() => {
            expect(mockedGetProducts).toHaveBeenCalledWith('lipstick', 1);
        });

        expect(mockedGetProducts).toHaveBeenCalledTimes(2);
    });

    it('refetches products when page changes', async () => {
        mockedGetProducts.mockResolvedValue(apiResponse);

        const { rerender } = renderHook(
            ({ query, page }: { query: string; page: number }) =>
                useAppState(query, page),
            {
                initialProps: {
                    query: 'mascara',
                    page: 1,
                },
            },
        );

        await waitFor(() => {
            expect(mockedGetProducts).toHaveBeenCalledWith('mascara', 1);
        });

        rerender({
            query: 'mascara',
            page: 2,
        });

        await waitFor(() => {
            expect(mockedGetProducts).toHaveBeenCalledWith('mascara', 2);
        });

        expect(mockedGetProducts).toHaveBeenCalledTimes(2);
    });

    it('allows setting fatalError manually', async () => {
        mockedGetProducts.mockResolvedValue(apiResponse);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.setFatalError(new Error('Manual fatal error'));
        });

        expect(result.current.fatalError?.message).toBe('Manual fatal error');
    });
});