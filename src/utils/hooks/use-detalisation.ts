import { useSearchParams } from "react-router";

export const useDetalisation = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const closeDetails = () => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.delete('details');

            return newParams;
        });
    };

    const openDetails = (id: number) => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.set('details', String(id));

            return newParams;
        });
    };

    return {
        searchParams,
        detailsId: searchParams.get('details'),
        openDetails,
        closeDetails
    };
}