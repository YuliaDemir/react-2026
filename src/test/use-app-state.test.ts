import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppState } from '../utils/hooks/use-app-state';
import { getProducts } from '../utils/get-products';
import { ErrorHandler } from '../utils/error-handler';
import type { ApiResponse } from '../types/interfaces';

vi.mock('../utils/get-products', () => ({
    getProducts: vi.fn(),
}));

const mockGetProducts = vi.mocked(getProducts);

const createApiResponse = (
    overrides: Partial<ApiResponse> = {},
): ApiResponse =>
    ({
        products: [
            {
                id: 1,
                title: 'Mascara',
                description: 'Black mascara',
                category: 'beauty',
                price: 10,
                stock: 15,
                images: [
                    'https://example.com/mascara-1.jpg',
                    'https://example.com/mascara-2.jpg',
                ],
            },
        ],
        total: 1,
        skip: 0,
        limit: 10,
        ...overrides,
    }) as unknown as ApiResponse;

const createDeferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        promise,
        resolve,
        reject,
    };
};

describe('useAppState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads products by query and page', async () => {
        mockGetProducts.mockResolvedValueOnce(createApiResponse());

        const { result } = renderHook(() => useAppState('mascara', 2));

        await waitFor(() => {
            expect(result.current.data).toHaveLength(1);
        });

        expect(mockGetProducts).toHaveBeenCalledWith('mascara', 2);
        expect(result.current.total).toBe(1);
        expect(result.current.error).toBeNull();
        expect(result.current.fatalError).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('adds image field from first product image', async () => {
        mockGetProducts.mockResolvedValueOnce(createApiResponse());

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.data[0]).toEqual(
                expect.objectContaining({
                    title: 'Mascara',
                    image: 'https://example.com/mascara-1.jpg',
                }),
            );
        });
    });

    it('sets loading while request is pending', async () => {
        const deferred = createDeferred<ApiResponse>();

        mockGetProducts.mockReturnValueOnce(deferred.promise);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        deferred.resolve(createApiResponse());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('returns validation error when query is null', async () => {
        const { result } = renderHook(() => useAppState(null, 1));

        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(ErrorHandler);
        });

        expect(mockGetProducts).not.toHaveBeenCalled();

        expect(result.current.error?.message).toBe('Id is not provided');
        expect(result.current.error?.status).toBe(404);
        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.fatalError).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('sets error when getProducts throws ErrorHandler with 4xx or 5xx status', async () => {
        const error = new ErrorHandler('Products not found', 404);

        mockGetProducts.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAppState('unknown', 1));

        await waitFor(() => {
            expect(result.current.error).toBe(error);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.fatalError).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('sets fatalError when getProducts throws regular Error', async () => {
        const error = new Error('Network error');

        mockGetProducts.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.fatalError).toBe(error);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('sets unknown fatalError when getProducts throws non-error value', async () => {
        mockGetProducts.mockRejectedValueOnce('Something went wrong');

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.fatalError?.message).toBe('Unknown error');
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.total).toBe(0);
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('refetches products when query or page changes', async () => {
        mockGetProducts
            .mockResolvedValueOnce(
                createApiResponse({
                    products: [
                        {
                            id: 1,
                            title: 'Mascara',
                            description: 'Black mascara',
                            images: ['https://example.com/mascara.jpg'],
                        },
                    ],
                    total: 1,
                } as unknown as Partial<ApiResponse>),
            )
            .mockResolvedValueOnce(
                createApiResponse({
                    products: [
                        {
                            id: 2,
                            title: 'Lipstick',
                            description: 'Red lipstick',
                            images: ['https://example.com/lipstick.jpg'],
                        },
                    ],
                    total: 1,
                } as unknown as Partial<ApiResponse>),
            );

        const { result, rerender } = renderHook(
            ({ query, page }) => useAppState(query, page),
            {
                initialProps: {
                    query: 'mascara',
                    page: 1,
                },
            },
        );

        await waitFor(() => {
            expect(result.current.data[0].title).toBe('Mascara');
        });

        rerender({
            query: 'lipstick',
            page: 2,
        });

        await waitFor(() => {
            expect(result.current.data[0].title).toBe('Lipstick');
        });

        expect(mockGetProducts).toHaveBeenNthCalledWith(1, 'mascara', 1);
        expect(mockGetProducts).toHaveBeenNthCalledWith(2, 'lipstick', 2);
    });

    it('allows clearing fatalError with setFatalError', async () => {
        const error = new Error('Network error');

        mockGetProducts.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useAppState('mascara', 1));

        await waitFor(() => {
            expect(result.current.fatalError).toBe(error);
        });

        result.current.setFatalError(null);

        await waitFor(() => {
            expect(result.current.fatalError).toBeNull();
        });
    });
});