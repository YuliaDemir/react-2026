export interface CardProps {
  name: string;
  description: string;
}

export interface PropsData {
  data: CardProps[];
}

export interface Item {
  id: number;
  title: string;
  description: string;
  imgAlt: string;
  imgUrl: string;
}

export type AppState = {
  data: Item[];
  error: Error | string | null;
  isLoading: boolean;
  query: string | null;
};

export type MockFetchResponse = { results: Item[] } | Item;