import { API_URL, PRODUCTS_PER_PAGE } from "../constants"

/// display4xx5xxErrors(); развести по ошибкам

export const fetchData = async (url: string) => {
    try {
        const data = await fetch(url);
        if (!data.ok) {
            throw new Error(`API call failed with status ${data.status}`);
        }
        return await data.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const getAllProductsPerPage = async (page: number) => {
    return fetchData(`${API_URL}?limit=${PRODUCTS_PER_PAGE}&skip=${(page - 1) * PRODUCTS_PER_PAGE}`);
}

export const getProductById = async (id: number) => {
    return fetchData(`${API_URL}/${id}`);
}

export const searchProductsByName = async (query: string) => {
    return fetchData(`${API_URL}/search?q=${encodeURIComponent(query)}`);
}