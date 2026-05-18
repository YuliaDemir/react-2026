import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addProduct, removeProduct, selectIsProductSelected } from "@/store/selected-items-slice";
import type { Product } from "@/types/interfaces";
import styles from "./select-checkbox.module.scss";

export const SelectCheckbox = ({ product }: { product: Product }) => {
    const isChecked = useAppSelector(selectIsProductSelected(product.id));
    const dispatch = useAppDispatch();

    const handleChange = () => {
        if (isChecked) {
            dispatch(removeProduct(product.id));
        }
        else {
            dispatch(addProduct(product));
        }
    }

    return (
        <input
            type="checkbox"
            className={styles.checkbox}
            onClick={e => e.stopPropagation()}
            onChange={handleChange}
            checked={!!isChecked}
            aria-label="Select product"
        />
    )
}