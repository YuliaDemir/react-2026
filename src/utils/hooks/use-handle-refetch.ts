import { useAppDispatch } from "@/store/hook";
import { useDetalisation } from "./use-detalisation";
import { productFetchSlice, ProductsApiTagsAndIds } from "@/api/products/products-fetch-slice";
import { useState, type FocusEvent } from "react";

export const useStateRefetchButton = () => {
    const dispatch = useAppDispatch();
    const { searchParams, detailsId } = useDetalisation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            closeMenu();
        }
    };

    const handleRefetch = (type: "all" | "current") => {
        const page = Number(searchParams.get("page") ?? 1) || 1;
        const query = searchParams.get("q")?.trim() ?? "";

        const currentTagIdForPage = query
            ? ProductsApiTagsAndIds.ids.listPerPageAndQuery(page, query)
            : ProductsApiTagsAndIds.ids.listPerPage(page);

        const tagIdList = type === "all" ?
            [ProductsApiTagsAndIds.ids.all] :
            [currentTagIdForPage, ...(detailsId ? [Number(detailsId)] : [])];

        dispatch(
            productFetchSlice.util.invalidateTags(tagIdList.map(tag =>
            ({
                type: ProductsApiTagsAndIds.tags.products,
                id: tag,
            })
            ))
        );

        closeMenu();
    };

    return { isMenuOpen, setIsMenuOpen, handleBlur, handleRefetch };
}