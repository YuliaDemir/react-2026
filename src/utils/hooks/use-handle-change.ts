import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addProduct, removeProduct, selectIsProductSelected } from "@/store/selected-items-slice";
import type { Product } from "@/types/interfaces";

export const useHandleChange = (product: Product) => {
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

    return { isChecked, handleChange };
}