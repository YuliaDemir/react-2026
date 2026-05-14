import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router';

import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';

import styles from './side-card.module.scss';
import { ContentState } from '../content-state/content-state';
import { ProductInfo } from '../product-info/product-info';

type ProductDetailsContext = {
    closeDetails: () => void;
};

export const SideCard = () => {
    const { closeDetails } = useOutletContext<ProductDetailsContext>();
    const detailsRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            if (target.closest('[data-product-card]')) {
                return;
            }

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
            <ProductInfo />
        </aside>
    );
};