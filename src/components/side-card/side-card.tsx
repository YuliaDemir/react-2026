import type { ReactNode } from 'react';
import styles from './side-card.module.scss';
import { OpenCloseDetailsLink } from '@components';

export const SideCard = ({ children }: { children: ReactNode }) => {

    return (
        <aside className={styles.details}>
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