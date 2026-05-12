import type { ReactNode } from "react";
import type { Product } from "./interfaces";
import type { ErrorHandler } from "../utils/error-handler";

export type CardProps = Pick<Product, 'title' | 'description' | 'images'>;;

export interface ListProps {
    data: Product[];
    onCardClick: (id: number) => void;
    isTwoColumns?: boolean;
}

export type ContentStateProps = {
    error: ErrorHandler | null;
    isLoading: boolean;
    children: ReactNode;
};
