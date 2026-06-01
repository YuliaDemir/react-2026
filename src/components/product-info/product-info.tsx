import { useOutletContext } from "react-router";
import { ContentState } from "@components";

import styles from './product-info.module.scss';
import { useGetProductDetailsQuery } from "@/api/products/products-fetch-slice";

type ProductDetailsContext = {
    detailsId: string;
};

export const ProductInfo = () => {
    const { detailsId } = useOutletContext<ProductDetailsContext>();
    const { data: product, isFetching: isLoading, error } = useGetProductDetailsQuery(+detailsId);

    return (<ContentState error={error} isLoading={isLoading} >
        {product ? (
            <article className={styles.card}>
                <img
                    className={styles.image}
                    src={product.image}
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