import { API_URL, PRODUCTS_PER_PAGE } from "../constants"
import { ErrorHandler } from "./error-handler";

export const fetchData = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new ErrorHandler("API call failed with status", response.status);
    }

    return await response.json();
};

export const getAllProductsPerPage = async (page: number) => {
    return fetchData(`${API_URL}?limit=${PRODUCTS_PER_PAGE}&skip=${(page - 1) * PRODUCTS_PER_PAGE}`);
}

export const getProductById = async (id: number) => {
    return fetchData(`${API_URL}/${id}`);
}

export const searchProductsByName = async (query: string) => {
    return fetchData(`${API_URL}/search?q=${encodeURIComponent(query)}`);
}