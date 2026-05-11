import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';
import App from '../App';
import { mockFetchSuccessBulbasaurArray } from '../utils/test-utils/mock-fetch-success';
import { ThrowError } from '../utils/test-utils/thrown-error';



describe('ErrorBoundary', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('catches and handles JavaScript errors in child components', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const text = screen.getByText(/something went wrong/i);

        expect(text).toBeInTheDocument();
    });

    it('displays fallback UI when error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const text = screen.getByText(/the application encountered an unexpected error/i);
        const button = screen.getByRole('button', { name: /try again/i });

        expect(text).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('logs error to console', () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(consoleErrorSpy).toHaveBeenCalled();

        expect(
            consoleErrorSpy.mock.calls.some((call) =>
                String(call[0]).includes('ErrorBoundary caught an error:')
            )
        ).toBe(true);
    });
});

describe('Error button', () => {
    beforeEach(() => {
        localStorage.removeItem('query');
        mockFetchSuccessBulbasaurArray();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        localStorage.clear();
    });

    it('throws error when test button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );

        const errorButton = await screen.findByRole('button', {
            name: /throw error/i,
        });

        await user.click(errorButton);

        const errorText = screen.getByText(/something went wrong/i);

        expect(errorText).toBeInTheDocument();
    });

    it('triggers error boundary fallback UI when test button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );

        const errorButton = await screen.findByRole('button', {
            name: /throw error/i,
        });

        await user.click(errorButton);

        const text = screen.getByText(/the application encountered an unexpected error/i);
        const button = screen.getByRole('button', { name: /try again/i });

        expect(text).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });
});