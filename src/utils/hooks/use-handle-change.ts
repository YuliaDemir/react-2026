import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addProduct, removeProduct } from "@/store/selected-items/selected-items-slice";
import { selectSelectedProductById } from "@/store/selected-items/selectors";
import type { Product } from "@/types";

export const useHandleChange = (product: Product) => {
    const isChecked = useAppSelector(selectSelectedProductById(product.id));
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