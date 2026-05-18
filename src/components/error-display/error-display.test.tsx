import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorDisplay } from './error-display';
import type { ErrorHandler } from '../../utils/error-handler';

vi.mock('./error-display.module.scss', () => ({
    default: {
        error: 'error',
        title: 'title',
        text: 'text',
    },
}));

const createError = (message: string): ErrorHandler =>
    ({
        getErrorMessageByStatus: vi.fn(() => message),
    }) as unknown as ErrorHandler;

describe('ErrorDisplay', () => {
    it('renders error title', () => {
        const error = createError('Something went wrong');

        render(<ErrorDisplay error={error} />);

        expect(
            screen.getByRole('heading', { name: /something went/i }),
        ).toBeInTheDocument();
    });

    it('renders error message from ErrorHandler', () => {
        const error = createError('Server error');

        render(<ErrorDisplay error={error} />);

        expect(screen.getByText('Server error')).toBeInTheDocument();
    });

    it('calls getErrorMessageByStatus', () => {
        const error = createError('Not found');

        render(<ErrorDisplay error={error} />);

        expect(error.getErrorMessageByStatus).toHaveBeenCalledTimes(1);
    });

    it('applies css module classes', () => {
        const error = createError('Validation error');

        const { container } = render(<ErrorDisplay error={error} />);

        expect(container.firstElementChild).toHaveClass('error');
        expect(
            screen.getByRole('heading', { name: /something went/i }),
        ).toHaveClass('title');
        expect(screen.getByText('Validation error')).toHaveClass('text');
    });
});