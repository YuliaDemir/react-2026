import { useSearchParams } from "react-router";
import { getPageFromSearchParams } from "../get-page-from-url";

export const usePagination = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = getPageFromSearchParams(searchParams);


    const updatePage = (nextPage: number) => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.set('page', String(nextPage));

            return newParams;
        });
    };

    return { page, setPage: updatePage };
}