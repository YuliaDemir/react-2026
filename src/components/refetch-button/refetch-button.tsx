import { useState, type FocusEvent } from "react";

import {
    productFetchSlice,
    ProductsApiTagsAndIds,
} from "@/api/products/products-fetch-slice";
import { useAppDispatch } from "@/store/hook";
import { ButtonOrLink } from "../button/button-or-link";

import styles from "./refetch-button.module.scss";
import { useDetalisation } from "@/utils/hooks/use-detalisation";

export const RefetchButton = () => {
    const dispatch = useAppDispatch();
    const { searchParams, detailsId } = useDetalisation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
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

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            closeMenu();
        }
    };

    return (
        <div className={styles.root} onBlur={handleBlur}>
            <ButtonOrLink
                variant="error"
                border="round-rectangle"
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                Refetch
            </ButtonOrLink>

            {isMenuOpen && (
                <div className={styles.menu}>
                    <ButtonOrLink
                        type="button"
                        variant="secondary"
                        border="round-rectangle"
                        onClick={() => handleRefetch("current")}
                    >
                        Refetch current
                    </ButtonOrLink>

                    <ButtonOrLink
                        type="button"
                        variant="secondary"
                        border="round-rectangle"
                        onClick={() => handleRefetch("all")}
                    >
                        Clear entire cache
                    </ButtonOrLink>
                </div>
            )}
        </div>
    );
};