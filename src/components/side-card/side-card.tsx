import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import styles from './side-card.module.scss';
import { OpenCloseDetailsLink } from '../open-close-link/open-close-link';
import { getToForLink } from '../../utils/get-to-for-link';

export const SideCard = ({ children }: { children: ReactNode }) => {
    const detailsRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target;
            const to = getToForLink();

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
                navigate(to);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <aside ref={detailsRef} className={styles.details}>
            <OpenCloseDetailsLink
                className={styles.closeButton}
                aria-label="Close details"
            >
                ×
            </OpenCloseDetailsLink>
            {children}
        </aside>
    );
};