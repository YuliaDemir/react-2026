// src/test/get-products.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorHandler } from '../utils/error-handler';
import { getProducts } from '../utils/get-products';
import {
    getAllProductsPerPage,
    getProductById,
    searchProductsByName,
} from '../utils/fetch-data';
import type { ApiResponse, Product } from '../types/interfaces';

vi.mock('../utils/fetch-data', () => ({
    getAllProductsPerPage: vi.fn(),
    getProductById: vi.fn(),
    searchProductsByName: vi.fn(),
}));

const product: Product = {
    id: 1,
    title: 'Mascara',
    description: 'Black mascara',
    images: ['https://example.com/mascara.jpg'],
    category: 'beauty',
    price: '10',
    stock: 15,
};

const productsResponse: ApiResponse = {
    products: [product],
    total: 1,
    skip: 0,
    limit: 10,
};

describe('getProducts', () => {
    const mockedGetAllProductsPerPage = vi.mocked(getAllProductsPerPage);
    const mockedGetProductById = vi.mocked(getProductById);
    const mockedSearchProductsByName = vi.mocked(searchProductsByName);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gets all products when query is empty string', async () => {
        mockedGetAllProductsPerPage.mockResolvedValue(productsResponse);

        const result = await getProducts('', 2);

        expect(mockedGetAllProductsPerPage).toHaveBeenCalledWith(2);
        expect(mockedGetProductById).not.toHaveBeenCalled();
        expect(mockedSearchProductsByName).not.toHaveBeenCalled();
        expect(result).toEqual(productsResponse);
    });

    it('gets all products when query contains only spaces', async () => {
        mockedGetAllProductsPerPage.mockResolvedValue(productsResponse);

        const result = await getProducts('   ', 3);

        expect(mockedGetAllProductsPerPage).toHaveBeenCalledWith(3);
        expect(mockedGetProductById).not.toHaveBeenCalled();
        expect(mockedSearchProductsByName).not.toHaveBeenCalled();
        expect(result).toEqual(productsResponse);
    });

    it('uses page 1 by default', async () => {
        mockedGetAllProductsPerPage.mockResolvedValue(productsResponse);

        await getProducts('');

        expect(mockedGetAllProductsPerPage).toHaveBeenCalledWith(1);
    });

    it('gets product by id when query is positive integer', async () => {
        mockedGetProductById.mockResolvedValue(product);

        const result = await getProducts('1', 5);

        expect(mockedGetProductById).toHaveBeenCalledWith(1);
        expect(mockedGetAllProductsPerPage).not.toHaveBeenCalled();
        expect(mockedSearchProductsByName).not.toHaveBeenCalled();

        expect(result).toEqual({
            products: [product],
            total: 1,
            skip: 0,
            limit: 1,
        });
    });

    it('trims product id query before requesting product by id', async () => {
        mockedGetProductById.mockResolvedValue(product);

        await getProducts('  15  ', 1);

        expect(mockedGetProductById).toHaveBeenCalledWith(15);
    });

    it('searches products by name when query is not valid product id', async () => {
        mockedSearchProductsByName.mockResolvedValue(productsResponse);

        const result = await getProducts('mascara', 2);

        expect(mockedSearchProductsByName).toHaveBeenCalledWith('mascara', 2);
        expect(mockedGetAllProductsPerPage).not.toHaveBeenCalled();
        expect(mockedGetProductById).not.toHaveBeenCalled();
        expect(result).toEqual(productsResponse);
    });

    it('trims search query before searching products by name', async () => {
        mockedSearchProductsByName.mockResolvedValue(productsResponse);

        await getProducts('  lipstick  ', 4);

        expect(mockedSearchProductsByName).toHaveBeenCalledWith('lipstick', 4);
    });

    it.each(['0', '-1', '1.5', 'abc123'])(
        'searches by name when query is invalid product id: %s',
        async (query) => {
            mockedSearchProductsByName.mockResolvedValue(productsResponse);

            await getProducts(query, 1);

            expect(mockedSearchProductsByName).toHaveBeenCalledWith(query, 1);
            expect(mockedGetProductById).not.toHaveBeenCalled();
        },
    );

    it('throws ErrorHandler when search returns empty products list', async () => {
        mockedSearchProductsByName.mockResolvedValue({
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        });

        await expect(getProducts('unknown product', 1)).rejects.toBeInstanceOf(
            ErrorHandler,
        );
    });

    it('throws ErrorHandler with 404 status when products are not found', async () => {
        mockedSearchProductsByName.mockResolvedValue({
            products: [],
            total: 0,
            skip: 0,
            limit: 10,
        });

        try {
            await getProducts('unknown product', 1);
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorHandler);
            expect((error as ErrorHandler).status).toBe(404);
        }
    });

    it('does not throw when search returns at least one product', async () => {
        mockedSearchProductsByName.mockResolvedValue(productsResponse);

        await expect(getProducts('mascara', 1)).resolves.toEqual(productsResponse);
    });
});