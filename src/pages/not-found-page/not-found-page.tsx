import { Link } from 'react-router';

import styles from './not-found-page.module.scss';
import { LINKS } from '../../constants';

export const NotFoundPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.code}>404</div>

            <h1 className={styles.title}>Page not found</h1>

            <Link className={styles.link} to={LINKS.home}>
                Go to products
            </Link>
        </div>
    );
};