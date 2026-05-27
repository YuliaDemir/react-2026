import type { ErrorHandler } from '@/utils/error-handler';

import styles from './error-display.module.scss';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit/react';
import { getErrorMessage } from '@/utils/get-error-message';

export const ErrorDisplay = ({ error }: { error: ErrorHandler | FetchBaseQueryError | SerializedError }) => {
    return (
        <div className={styles.error}>
            <h2 className={styles.title}>Something went wrong.</h2>
            {getErrorMessage(error)}
            <p className={styles.text}>{'( '}Don’t panic! The little hamsters are already working on fixing this problem!{' )'}</p>
        </div>
    );
};