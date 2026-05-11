import type { Product } from "./interfaces";

export type CardProps = { imgUrl?: string, imgAlt?: string, name: string, description: string };

export interface ListProps {
    data: Product[];
}