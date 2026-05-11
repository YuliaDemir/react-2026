export interface CardProps {
  name: string;
  description: string;
}

export interface PropsData {
  data: CardProps[];
}

export interface Product {
  id: number,
  images: string[],
  title: string,
  description: string
}

export type AppState = {
  data: Product[];
  error: Error | string | null;
  isLoading: boolean;
  query: string | null;
};

export type MockFetchResponse = { results: Product[] } | Product;

export type ApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}