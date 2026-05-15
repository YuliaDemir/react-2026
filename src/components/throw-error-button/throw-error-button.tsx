import { useState } from 'react';
import styles from './throw-error-button.module.scss';

export const ThrowErrorButton = () => {
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        throw error;
    }

    return (
        <button
            className={styles.button}
            onClick={() => setError(new Error('Simulated fatal error'))}
        >
            Throw error
        </button>
    );
};
