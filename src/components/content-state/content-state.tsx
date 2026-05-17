import { ErrorDisplay, Loader } from "@components";
import type { ErrorHandler } from "@/utils/error-handler";
import type { ReactNode } from "react";

type Props = {
    error: ErrorHandler | null;
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