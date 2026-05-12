import type { Product } from "./interfaces";

export type CardProps = Pick<Product, 'title' | 'description' | 'images'>;;

export interface ListProps {
    data: Product[];
    onCardClick: (id: number) => void;
    isTwoColumns?: boolean;
}