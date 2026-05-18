import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductInfo } from './product-info';
import { useAppState } from '@/utils/hooks/use-app-state';

vi.mock('@/utils/hooks/use-app-state', () => ({
    useAppState: vi.fn(),
}));

vi.mock('@components', () => ({
    ContentState: ({
        children,
        error,
        isLoading,
    }: {
        children: ReactNode;
        error: Error | null;
        isLoading: boolean;
    }) => {
        if (error) {
            return <div role="alert">{error.message}</div>;
        }

        if (isLoading) {
            return <div data-testid="loader">Loading...</div>;
        }

        return <>{children}</>;
    },
}));

const mockUseAppState = vi.mocked(useAppState);

const product = {
    id: 42,
    title: 'Mascara',
    description: 'Black mascara for long lashes',
    image: 'https://example.com/mascara.jpg',
    category: 'beauty',
    price: 10,
    stock: 15,
};

const createAppState = (overrides: Record<string, unknown> = {}) =>
    ({
        data: [product],
        isLoading: false,
        error: null,
        fatalError: null,
        setFatalError: vi.fn(),
        total: 1,
        ...overrides,
    }) as unknown as ReturnType<typeof useAppState>;

const OutletWithContext = ({ detailsId }: { detailsId: string }) => {
    return <Outlet context={{ detailsId }} />;
};

const renderProductInfo = (detailsId = '42') => {
    return render(
        <MemoryRouter initialEntries={['/products']}>
            <Routes>
                <Route
                    path="/products"
                    element={<OutletWithContext detailsId={detailsId} />}
                >
                    <Route index element={<ProductInfo />} />
                </Route>
            </Routes>
        </MemoryRouter>,
    );
};

describe('ProductInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseAppState.mockReturnValue(createAppState());
    });

    it('loads product by detailsId from outlet context', () => {
        renderProductInfo('42');

        expect(mockUseAppState).toHaveBeenCalledWith('42');
    });

    it('renders product details', () => {
        renderProductInfo();

        expect(
            screen.getByRole('heading', { name: /mascara/i }),
        ).toBeInTheDocument();

        expect(screen.getByRole('img', { name: /mascara/i })).toHaveAttribute(
            'src',
            'https://example.com/mascara.jpg',
        );

        expect(screen.getByText('Category:')).toBeInTheDocument();
        expect(screen.getByText('beauty')).toBeInTheDocument();

        expect(screen.getByText('Price:')).toBeInTheDocument();
        expect(screen.getByText('$10')).toBeInTheDocument();

        expect(screen.getByText('Stock:')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();

        expect(
            screen.getByText('Black mascara for long lashes'),
        ).toBeInTheDocument();
    });

    it('shows loader while product is loading', () => {
        mockUseAppState.mockReturnValue(
            createAppState({
                data: [],
                isLoading: true,
            }),
        );

        renderProductInfo();

        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(
            screen.queryByRole('heading', { name: /mascara/i }),
        ).not.toBeInTheDocument();
    });

    it('shows error when request failed', () => {
        mockUseAppState.mockReturnValue(
            createAppState({
                data: [],
                error: new Error('Product not found'),
            }),
        );

        renderProductInfo();

        expect(screen.getByRole('alert')).toHaveTextContent('Product not found');
        expect(
            screen.queryByRole('heading', { name: /mascara/i }),
        ).not.toBeInTheDocument();
    });

    it('shows fallback message when product is empty', () => {
        mockUseAppState.mockReturnValue(
            createAppState({
                data: [],
            }),
        );

        renderProductInfo();

        expect(screen.getByText('Upss. Something went wrong.')).toBeInTheDocument();
    });
});