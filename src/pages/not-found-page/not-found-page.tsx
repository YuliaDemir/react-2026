import styles from './not-found-page.module.scss';
import { LINKS } from '@const';
import { ButtonOrLink } from '@/components/button/button';

export const NotFoundPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.code}>404</div>

            <h1 className={styles.title}>Page not found</h1>

            <ButtonOrLink variant="error" border="round-rectangle" to={LINKS.home}>
                Go to products
            </ButtonOrLink>
        </div>
    );
};