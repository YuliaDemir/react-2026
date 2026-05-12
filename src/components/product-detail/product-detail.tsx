import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router';

import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';
import { ErrorDisplay } from '../error-display/error-display';
import { Loader } from '../loader/loader';

import styles from './product-details.module.scss';

type ProductDetailsContext = {
    closeDetails: () => void;
};

export const ProductDetails = () => {
    const { closeDetails } = useOutletContext<ProductDetailsContext>();
    const detailsRef = useRef<HTMLElement | null>(null);

    const { detailsId } = useDetalisation();
    const { data, isLoading, error } = useAppState(detailsId);

    const product = data[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                detailsRef.current &&
                event.target instanceof Node &&
                !detailsRef.current.contains(event.target)
            ) {
                closeDetails();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeDetails]);

    return (
        <aside ref={detailsRef} className={styles.details}>
            <button
                type="button"
                className={styles.closeButton}
                onClick={closeDetails}
                aria-label="Close details"
            >
                ×
            </button>

            {error ? (
                <ErrorDisplay error={error} />
            ) : isLoading ? (
                <Loader />
            ) : product ? (
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
            ) : null}
        </aside>
    );
};