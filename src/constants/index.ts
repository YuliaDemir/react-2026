import type { TransformedApiResponse } from "@/types/interfaces";

export const API_URL = 'https://dummyjson.com/products';

export const PRODUCTS_PER_PAGE = 12;

export const LOCAL_STORAGE_KEY = 'query';
export const LOCAL_STORAGE_THEME_KEY = 'theme';

export const LINKS = {
    home: "/products?page=1",
    about: "/about",
}

export const HEADERS_FOR_SVC = [
    "id",
    "name",
    "description",
    "category",
    "price",
    "stock",
    "image",
    "detailsUrl",
];

export const API_CACHE_TTL_SECONDS =
    Number(import.meta.env.VITE_API_CACHE_TTL_SECONDS) || 60;

export const EMPTY_PRODUCTS: TransformedApiResponse = {
    products: [],
    total: 0,
    skip: 0,
    limit: 0,
};