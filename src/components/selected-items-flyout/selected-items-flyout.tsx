import { useAppDispatch, useAppSelector } from "@/store/hook";
import style from "./selected-items-flyout.module.scss";
import { clearList } from "@/store/selected-items-slice";

const onDownload = () => {

}

export const SelectedItemsBlock = () => {
    const selectedProducts = useAppSelector(state => state.selectedItems).selectedProductList;
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
                <button
                    className={style.secondaryButton}
                    type="button"
                    onClick={() => dispatch(clearList())}
                >
                    Unselect all
                </button>

                <button
                    className={style.primaryButton}
                    type="button"
                    onClick={onDownload}
                >
                    Download
                </button>
            </div>
        </div>
    );
};