import { ErrorDisplay } from "../error-display/error-display";
import { Loader } from "../loader/loader";
import type { ContentStateProps } from "../../types/props";

export const ContentState = ({ children, error, isLoading }: ContentStateProps) => {

    return (<>
        {error ? (
            <ErrorDisplay error={error} />
        ) : isLoading ? (
            <Loader />
        ) : (
            children
        )}
    </>)
}