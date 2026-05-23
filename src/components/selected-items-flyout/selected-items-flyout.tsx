import { useAppDispatch, useAppSelector } from "@/store/hook";
import style from "./selected-items-flyout.module.scss";
import { downloadProductsAsCsv } from "@/utils/download-products-as-svc";
import { ButtonOrLink } from "../button/button-or-link";
import { selectSelectedProductList } from "@/store/selected-items/selectors";
import { clearList } from "@/store/selected-items/selected-items-slice";

export const SelectedItemsBlock = () => {
    const selectedProducts = useAppSelector(selectSelectedProductList);
    const dispatch = useAppDispatch();

    if (!selectedProducts.length) {
        return null;
    }

    return (
        <div className={style.block}>
            <div className={style.info}>
                <span className={style.count}>{selectedProducts.length}</span>
                <span className={style.text}>items selected</span>
            </div>

            <div className={style.actions}>
                <ButtonOrLink
                    variant="secondary"
                    border="round-rectangle"
                    type="button"
                    onClick={() => dispatch(clearList())}
                >
                    Unselect all
                </ButtonOrLink>

                <ButtonOrLink
                    variant="primary"
                    border="round-rectangle"
                    type="button"
                    onClick={() => downloadProductsAsCsv(selectedProducts)}
                >
                    Download
                </ButtonOrLink>
            </div>
        </div>
    );
};