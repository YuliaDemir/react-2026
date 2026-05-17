import type { ErrorHandler } from '@/utils/error-handler';

import styles from './error-display.module.scss';

export const ErrorDisplay = ({ error }: { error: ErrorHandler }) => {
    return (
        <div className={styles.error}>
            <h2 className={styles.title}>Something went wrong.</h2>
            <p className={styles.text}>{error.getErrorMessageByStatus()}</p>
            <p className={styles.text}>{'( '}Don’t panic! The little hamsters are already working on fixing this problem!{' )'}</p>
        </div>
    );
};