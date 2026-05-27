import { ErrorDisplay, Loader } from "@components";
import type { ErrorHandler } from "@/utils/error-handler";
import type { ReactNode } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { SerializedError } from "@reduxjs/toolkit/react";

type Props = {
    error: ErrorHandler | null | FetchBaseQueryError | SerializedError | undefined;
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