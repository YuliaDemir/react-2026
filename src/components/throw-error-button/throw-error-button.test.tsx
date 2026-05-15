// throw-error-button.test.tsx
import type { ReactNode } from 'react';
import { Component } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThrowErrorButton } from './throw-error-button';

vi.mock('./throw-error-button.module.scss', () => ({
    default: {
        button: 'button',
    },
}));

type TestErrorBoundaryProps = {
    children: ReactNode;
};

type TestErrorBoundaryState = {
    error: Error | null;
};

class TestErrorBoundary extends Component<
    TestErrorBoundaryProps,
    TestErrorBoundaryState
> {
    state: TestErrorBoundaryState = {
        error: null,
    };

    static getDerivedStateFromError(error: Error): TestErrorBoundaryState {
        return { error };
    }

    render() {
        const { error } = this.state;

        if (error) {
            return <div role="alert">{error.message}</div>;
        }

        return this.props.children;
    }
}

describe('ThrowErrorButton', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('renders throw error button', () => {
        render(<ThrowErrorButton />);

        expect(
            screen.getByRole('button', { name: /throw error/i }),
        ).toBeInTheDocument();
    });

    it('applies button class', () => {
        render(<ThrowErrorButton />);

        expect(screen.getByRole('button', { name: /throw error/i })).toHaveClass(
            'button',
        );
    });

    it('throws simulated fatal error after click', () => {
        render(
            <TestErrorBoundary>
                <ThrowErrorButton />
            </TestErrorBoundary>,
        );

        fireEvent.click(screen.getByRole('button', { name: /throw error/i }));

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Simulated fatal error',
        );

        expect(
            screen.queryByRole('button', { name: /throw error/i }),
        ).not.toBeInTheDocument();
    });
});