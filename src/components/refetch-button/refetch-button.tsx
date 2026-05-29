import { useAppDispatch } from "@/store/hook";
import { ButtonOrLink } from "../button/button-or-link";
import { productFetchSlice } from "@/api/products/products-fetch-slice";

export const RefectButton = () => {
    const dispatch = useAppDispatch();

    const handleRefresh = () => {
        dispatch(
            productFetchSlice.util.invalidateTags([
                { type: "Products", id: `ALL` },
            ])
        );
    };

    return (
        <ButtonOrLink
            variant="error"
            border="round-rectangle"
            onClick={handleRefresh}
        >
            Refetch
        </ButtonOrLink>
    );
};
