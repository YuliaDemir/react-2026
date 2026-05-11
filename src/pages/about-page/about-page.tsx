import { Link } from 'react-router';

import styles from './about-page.module.scss';

export const AboutPage = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>About</h1>

            <p className={styles.text}>
                This is a product application where you can browse products, search by
                name, and navigate through pages.
            </p>

            <Link className={styles.link} to="/products">
                Back to products
            </Link>
        </div>
    );
};