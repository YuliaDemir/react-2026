import type { Item } from "./interfaces";

export type CardProps = { imgUrl?: string, imgAlt?: string, name: string, description: string };

export interface ListProps {
    data: Item[];
}