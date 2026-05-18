import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    MemoryRouter,
    Route,
    Routes,
    useLocation,
    useOutletContext,
} from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage } from './products-page';
import { useAppState } from '@/utils/hooks/use-app-state';
import { useDetalisation } from '@/utils/hooks/use-detalisation';
import { useLocalStorage } from '@/utils/hooks/use-local-storage-hook';

const mocks = vi.hoisted(() => ({
    setLSValue: vi.fn(),
    setFatalError: vi.fn(),
}));

vi.mock('@/utils/hooks/use-app-state', () => ({
    useAppState: vi.fn(),
}));

vi.mock('@/utils/hooks/use-detalisation', () => ({
    useDetalisation: vi.fn(),
}));

vi.mock('@/utils/hooks/use-local-storage-hook', () => ({
    useLocalStorage: vi.fn(),
}));

vi.mock('@components', () => ({
    Search: ({
        onSearch,
        query,
    }: {
        onSearch: (value: string) => void;
        query?: string;
    }) => (
        <div>
            <span data-testid="search-query">{query}</span>

            <button type="button" onClick={() => onSearch('lipstick')}>
                Submit search
            </button>
        </div>
    ),

    CardList: ({
        data,
    }: {
        data: Array<{
            id: number;
            title: string;
        }>;
    }) => (
        <ul data-testid="card-list">
            {data.map((product) => (
                <li key={product.id}>{product.title}</li>
            ))}
        </ul>
    ),

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

    Pagination: ({ page, total }: { page: number; total: number }) => (
        <div data-testid="pagination">
            Page {page} Total {total}
        </div>
    ),
}));

const mockUseAppState = vi.mocked(useAppState);
const mockUseDetalisation = vi.mocked(useDetalisation);
const mockUseLocalStorage = vi.mocked(useLocalStorage);

const products = [
    {
        id: 1,
        title: 'Mascara',
        description: 'Black mascara',
        image: 'https://example.com/mascara.jpg',
        category: 'beauty',
        price: '10',
        stock: 15,
    },
];

const createAppState = (overrides: Record<string, unknown> = {}) =>
    ({
        data: products,
        isLoading: false,
        error: null,
        fatalError: null,
        setFatalError: mocks.setFatalError,
        total: 24,
        ...overrides,
    }) as unknown as ReturnType<typeof useAppState>;

const createDetalisation = (detailsId: string | null = null) =>
    ({
        detailsId,
        searchParams: new URLSearchParams(
            detailsId ? { details: detailsId } : undefined,
        ),
        openDetails: vi.fn(),
        closeDetails: vi.fn(),
    }) as ReturnType<typeof useDetalisation>;

const LocationView = () => {
    const location = useLocation();

    return (
        <div data-testid="location">
            {location.pathname}
            {location.search}
        </div>
    );
};

const DetailsOutlet = () => {
    const { detailsId } = useOutletContext<{ detailsId: string }>();

    return <div data-testid="details-outlet">Details id: {detailsId}</div>;
};

const renderProductsPage = (initialEntry = '/products?page=1') => {
    window.history.pushState({}, '', initialEntry);

    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route path="/products" element={<ProductsPage />}>
                    <Route index element={<DetailsOutlet />} />
                </Route>
            </Routes>

            <LocationView />
        </MemoryRouter>,
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseLocalStorage.mockReturnValue(['mascara', mocks.setLSValue]);
        mockUseDetalisation.mockReturnValue(createDetalisation());
        mockUseAppState.mockReturnValue(createAppState());
    });

    it('renders search, products and pagination', () => {
        renderProductsPage('/products?page=2');

        expect(screen.getByTestId('search-query')).toHaveTextContent('mascara');
        expect(screen.getByTestId('card-list')).toHaveTextContent('Mascara');
        expect(screen.getByTestId('pagination')).toHaveTextContent(
            'Page 2 Total 24',
        );

        expect(mockUseAppState).toHaveBeenCalledWith('mascara', 2);
    });

    it('uses first page when page search param is missing', () => {
        renderProductsPage('/products');

        expect(mockUseAppState).toHaveBeenCalledWith('mascara', 1);
        expect(screen.getByTestId('pagination')).toHaveTextContent(
            'Page 1 Total 24',
        );
    });

    it('shows loader and hides pagination while products are loading', () => {
        mockUseAppState.mockReturnValue(
            createAppState({
                data: [],
                isLoading: true,
                total: 0,
            }),
        );

        renderProductsPage('/products?page=1');

        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('shows error and hides pagination when request failed', () => {
        mockUseAppState.mockReturnValue(
            createAppState({
                data: [],
                error: new Error('Products not found'),
                total: 0,
            }),
        );

        renderProductsPage('/products?page=1');

        expect(screen.getByRole('alert')).toHaveTextContent('Products not found');
        expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('does not render outlet when details are closed', () => {
        renderProductsPage('/products?page=1');

        expect(screen.queryByTestId('details-outlet')).not.toBeInTheDocument();
    });

    it('renders outlet with detailsId when details are open', () => {
        mockUseDetalisation.mockReturnValue(createDetalisation('42'));

        renderProductsPage('/products?page=1&details=42');

        expect(screen.getByTestId('details-outlet')).toHaveTextContent(
            'Details id: 42',
        );
    });

    it('handles search: saves query, resets page and refetches products', async () => {
        const user = userEvent.setup();

        renderProductsPage('/products?page=4&details=10');

        await user.click(screen.getByRole('button', { name: /submit search/i }));

        expect(mocks.setLSValue).toHaveBeenCalledWith('lipstick');

        await waitFor(() => {
            expect(mockUseAppState).toHaveBeenLastCalledWith('lipstick', 1);
        });

        expect(screen.getByTestId('location')).toHaveTextContent(
            '/products?page=1',
        );
    });
});