import type { ErrorHandler } from '../../utils/error-handler';

import styles from './error-display.module.scss';

export const ErrorDisplay = ({ error }: { error: ErrorHandler }) => {
    return (
        <div className={styles.error}>
            <h2 className={styles.title}>An error occurred</h2>
            <p className={styles.text}>{error.getErrorMessageByStatus()}</p>
        </div>
    );
};