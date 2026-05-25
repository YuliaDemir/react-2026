import { useState } from 'react';
import { ButtonOrLink } from '../button/button-or-link';

export const ThrowErrorButton = () => {
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        throw error;
    }

    return (
        <ButtonOrLink
            variant="error"
            border="round-rectangle"
            onClick={() => setError(new Error('Simulated fatal error'))}
        >
            Throw error
        </ButtonOrLink>
    );
};
