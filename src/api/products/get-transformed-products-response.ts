import type { ProductsApiResponse, TransformedProductsApiResponse } from "@/types";

export const getTransformedProductsResponse = ({ products, total, skip, limit }: ProductsApiResponse): TransformedProductsApiResponse => {
    const transformedProducts = products.map(product => ({ ...product, image: product.images[0] }));
    return {
        products: transformedProducts,
        total,
        skip,
        limit,
    };
}