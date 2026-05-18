import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContentState } from './content-state';
import type { ErrorHandler } from '../../utils/error-handler';

vi.mock('../error-display/error-display', () => ({
    ErrorDisplay: ({ error }: { error: ErrorHandler }) => (
        <div data-testid="error-display">Error: {String(error)}</div>
    ),
}));

vi.mock('../loader/loader', () => ({
    Loader: () => <div data-testid="loader">Loading...</div>,
}));

describe('ContentState', () => {
    it('renders ErrorDisplay when error exists', () => {
        const error = 'Something went wrong' as unknown as ErrorHandler;

        render(
            <ContentState error={error} isLoading={false}>
                <div>Content</div>
            </ContentState>,
        );

        expect(screen.getByTestId('error-display')).toBeInTheDocument();
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders Loader when isLoading is true', () => {
        render(
            <ContentState error={null} isLoading>
                <div>Content</div>
            </ContentState>,
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();

        expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders children when there is no error and loading is false', () => {
        render(
            <ContentState error={null} isLoading={false}>
                <div>Content</div>
            </ContentState>,
        );

        expect(screen.getByText('Content')).toBeInTheDocument();

        expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('prioritizes error over loading state', () => {
        const error = 'Critical error' as unknown as ErrorHandler;

        render(
            <ContentState error={error} isLoading>
                <div>Content</div>
            </ContentState>,
        );

        expect(screen.getByTestId('error-display')).toBeInTheDocument();

        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
});