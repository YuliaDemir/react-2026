import styles from './error-display.module.scss';
import { getErrorMessage } from '@/utils/get-error-message';
import type { AppError } from '@/types';

export const ErrorDisplay = ({ error }: { error: AppError }) => {
    return (
        <div className={styles.error}>
            <h2 className={styles.title}>Something went wrong.</h2>
            {getErrorMessage(error)}
            <p className={styles.text}>{'( '}Don’t panic! The little hamsters are already working on fixing this problem!{' )'}</p>
        </div>
    );
};