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

export type AppState = {
  data: Product[];
  error: Error | string | null;
  isLoading: boolean;
  query: string | null;
};

export type MockFetchResponse = { results: Product[] } | Product;

export type ApiResponse = {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export type TransformedApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}