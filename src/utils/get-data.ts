import { ErrorHandler } from './error-handler';
import {
  getAllProductsPerPage,
  getProductById,
  searchProductsByName,
} from './fetch-data';

const isValidProductId = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return false;
  }

  const id = Number(trimmedValue);

  return Number.isInteger(id) && id > 0;
};

export const getProducts = async (query: string, page: number = 1) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return getAllProductsPerPage(page);
  }

  if (isValidProductId(trimmedQuery)) {
    const product = await getProductById(Number(trimmedQuery));

    return {
      products: [product],
      total: 1,
      skip: 0,
      limit: 1,
    };
  }

  const data = await searchProductsByName(trimmedQuery);

  if (data.products.length === 0) {
    throw new ErrorHandler('Products not found', 404);
  }

  return data;
};