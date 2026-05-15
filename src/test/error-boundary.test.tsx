// ErrorBoundary.test.tsx
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '../ErrorBoundary';

vi.mock('./ErrorBoundary.module.scss', () => ({
    default: {
        page: 'page',
        card: 'card',
        icon: 'icon',
        title: 'title',
        text: 'text',
        button: 'button',
    },
}));

const BrokenComponent = () => {
    throw new Error('Test error');
};

const ControlledBrokenComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Controlled test error');
    }

    return <div>Recovered content</div>;
};

const renderWithBoundary = (children: ReactNode) => {
    return render(<ErrorBoundary>{children}</ErrorBoundary>);
};

describe('ErrorBoundary', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('renders children when there is no error', () => {
        renderWithBoundary(<div>Application content</div>);

        expect(screen.getByText('Application content')).toBeInTheDocument();
    });

    it('renders fallback UI when child component throws error', () => {
        renderWithBoundary(<BrokenComponent />);

        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(
            screen.getByRole('heading', { name: /something went wrong\. ttt/i }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /the application encountered an unexpected error/i,
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: /try again/i }),
        ).toBeInTheDocument();
    });

    it('does not render children after error', () => {
        renderWithBoundary(
            <>
                <div>Application content</div>
                <BrokenComponent />
            </>,
        );

        expect(screen.queryByText('Application content')).not.toBeInTheDocument();

        expect(
            screen.getByRole('heading', { name: /something went wrong\. ttt/i }),
        ).toBeInTheDocument();
    });

    it('logs caught error', () => {
        renderWithBoundary(<BrokenComponent />);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ErrorBoundary caught an error:',
            expect.any(Error),
            expect.any(Object),
        );
    });

    it('resets error state after clicking Try again', () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ControlledBrokenComponent shouldThrow />
            </ErrorBoundary>,
        );

        expect(
            screen.getByRole('heading', { name: /something went wrong\. ttt/i }),
        ).toBeInTheDocument();

        rerender(
            <ErrorBoundary>
                <ControlledBrokenComponent shouldThrow={false} />
            </ErrorBoundary>,
        );

        fireEvent.click(screen.getByRole('button', { name: /try again/i }));

        expect(screen.getByText('Recovered content')).toBeInTheDocument();

        expect(
            screen.queryByRole('heading', { name: /something went wrong\. ttt/i }),
        ).not.toBeInTheDocument();
    });

});