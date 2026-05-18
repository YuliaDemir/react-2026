import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    fetchData,
    getAllProductsPerPage,
    getProductById,
    searchProductsByName,
} from '../utils/fetch-data';
import { ErrorHandler } from '../utils/error-handler';

vi.mock('../constants', () => ({
    API_URL: 'https://api.example.com/products',
    PRODUCTS_PER_PAGE: 10,
}));

describe('get-products utils', () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    describe('fetchData', () => {
        it('calls fetch with provided url', async () => {
            const responseData = {
                products: [],
                total: 0,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await fetchData('https://api.example.com/products');

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products',
            );
        });

        it('returns parsed json when response is ok', async () => {
            const responseData = {
                products: [
                    {
                        id: 1,
                        title: 'Mascara',
                    },
                ],
                total: 1,
            };

            const json = vi.fn().mockResolvedValue(responseData);

            fetchMock.mockResolvedValue({
                ok: true,
                json,
            } as unknown as Response);

            await expect(fetchData('https://api.example.com/products')).resolves.toEqual(
                responseData,
            );

            expect(json).toHaveBeenCalledTimes(1);
        });

        it('throws ErrorHandler when response is not ok', async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 404,
                json: vi.fn(),
            } as unknown as Response);

            await expect(
                fetchData('https://api.example.com/products/999'),
            ).rejects.toBeInstanceOf(ErrorHandler);
        });

        it('throws ErrorHandler with response status', async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                json: vi.fn(),
            } as unknown as Response);

            try {
                await fetchData('https://api.example.com/products');
            } catch (error) {
                expect(error).toBeInstanceOf(ErrorHandler);
                expect((error as ErrorHandler).status).toBe(500);
            }
        });

        it('does not call json when response is not ok', async () => {
            const json = vi.fn();

            fetchMock.mockResolvedValue({
                ok: false,
                status: 400,
                json,
            } as unknown as Response);

            await expect(
                fetchData('https://api.example.com/products'),
            ).rejects.toBeInstanceOf(ErrorHandler);

            expect(json).not.toHaveBeenCalled();
        });
    });

    describe('getAllProductsPerPage', () => {
        it('fetches first page with correct limit and skip', async () => {
            const responseData = {
                products: [],
                total: 0,
                skip: 0,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await getAllProductsPerPage(1);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products?limit=10&skip=0',
            );
        });

        it('fetches selected page with calculated skip', async () => {
            const responseData = {
                products: [],
                total: 0,
                skip: 20,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await getAllProductsPerPage(3);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products?limit=10&skip=20',
            );
        });

        it('returns response data', async () => {
            const responseData = {
                products: [{ id: 1, title: 'Mascara' }],
                total: 1,
                skip: 0,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await expect(getAllProductsPerPage(1)).resolves.toEqual(responseData);
        });
    });

    describe('getProductById', () => {
        it('fetches product by id', async () => {
            const responseData = {
                id: 15,
                title: 'Lipstick',
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await getProductById(15);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products/15',
            );
        });

        it('returns product data', async () => {
            const responseData = {
                id: 15,
                title: 'Lipstick',
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await expect(getProductById(15)).resolves.toEqual(responseData);
        });
    });

    describe('searchProductsByName', () => {
        it('fetches search results with query, limit and skip', async () => {
            const responseData = {
                products: [],
                total: 0,
                skip: 0,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await searchProductsByName('mascara', 1);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products/search?q=mascara&limit=10&skip=0',
            );
        });

        it('encodes search query', async () => {
            const responseData = {
                products: [],
                total: 0,
                skip: 0,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await searchProductsByName('red lipstick', 1);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products/search?q=red%20lipstick&limit=10&skip=0',
            );
        });

        it('calculates skip for selected search page', async () => {
            const responseData = {
                products: [],
                total: 0,
                skip: 30,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await searchProductsByName('mascara', 4);

            expect(fetchMock).toHaveBeenCalledWith(
                'https://api.example.com/products/search?q=mascara&limit=10&skip=30',
            );
        });

        it('returns search response data', async () => {
            const responseData = {
                products: [{ id: 1, title: 'Mascara' }],
                total: 1,
                skip: 0,
                limit: 10,
            };

            fetchMock.mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(responseData),
            } as unknown as Response);

            await expect(searchProductsByName('mascara', 1)).resolves.toEqual(
                responseData,
            );
        });
    });
});