import { useOutletContext } from "react-router";
import { useAppState } from "../../utils/hooks/use-app-state";
import { ContentState } from "../content-state/content-state";

import styles from './product-info.module.scss';

type ProductDetailsContext = {
    detailsId: string;
};

export const ProductInfo = () => {
    const { detailsId } = useOutletContext<ProductDetailsContext>();
    const { data, isLoading, error } = useAppState(String(detailsId));

    const product = data[0];

    return (<ContentState error={error} isLoading={isLoading} >
        {product ? (
            <article className={styles.card}>
                <img
                    className={styles.image}
                    src={product.images[0]}
                    alt={product.title}
                />

                <h2 className={styles.title}>{product.title}</h2>

                <div className={styles.info}>
                    <p className={styles.infoItem}>
                        <span className={styles.label}>Category:</span>
                        <span className={styles.value}>{product.category}</span>
                    </p>

                    <p className={styles.infoItem}>
                        <span className={styles.label}>Price:</span>
                        <span className={styles.value}>${product.price}</span>
                    </p>

                    <p className={styles.infoItem}>
                        <span className={styles.label}>Stock:</span>
                        <span className={styles.value}>{product.stock}</span>
                    </p>
                </div>

                <p className={styles.description}>{product.description}</p>
            </article>
        ) : <p>Upss. Something went wrong.</p>}
    </ContentState>);
}