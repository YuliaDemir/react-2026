import type { Product } from "@/types/interfaces";
import { useHandleChange } from "@/utils/hooks/use-handle-change";
import { OpenCloseDetailsLink } from "../open-close-link/open-close-link";
import { Card } from "../card/card";
import { SelectCheckbox } from "../select-checkbox/select-checkbox";
import styles from './product-section-card.module.scss';

export const ProductSectionCard = ({ product }: { product: Product }) => {
    const { isChecked, handleChange } = useHandleChange(product);

    return (
        <OpenCloseDetailsLink
            data-product-card
            className={styles.cardButton}
            id={product.id}
        >
            <Card
                product={product}
                Checkbox={<SelectCheckbox isChecked={!!isChecked} handleChange={handleChange} />}
            />
        </OpenCloseDetailsLink>
    );
}