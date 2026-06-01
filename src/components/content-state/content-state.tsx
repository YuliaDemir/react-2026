import { ErrorDisplay, Loader } from "@components";
import type { ReactNode } from "react";
import type { AppError } from "@/types";

type Props = {
    error: AppError;
    isLoading: boolean;
    children: ReactNode;
};


export const ContentState = ({ children, error, isLoading }: Props) => {
    if (error) {
        return <ErrorDisplay error={error} />
    }

    if (isLoading) {
        return <Loader />
    }

    return children;
}