import type { ErrorHandler } from "@/utils/error-handler";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "vitest";

export interface CardProps {
  name: string;
  description: string;
}

export interface PropsData {
  data: CardProps[];
}

export interface Product {
  id: number,
  image: string,
  title: string,
  description: string;
  category: string;
  price: string;
  stock: number;
}

export type ApiProduct = Omit<Product, 'image'> & {
  images: string[];
};

export type MockFetchResponse = { results: Product[] } | Product;

export type ProductsApiResponse = {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export type TransformedProductsApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type AppError =
    | ErrorHandler
    | FetchBaseQueryError
    | SerializedError
    | undefined
    | null;