// products-page.test.tsx
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductsPage } from './products-page';
import { useAppState } from '../../utils/hooks/use-app-state';
import { useDetalisation } from '../../utils/hooks/use-detalisation';
import { useLocalStorage } from '../../utils/hooks/use-local-storage-hook';
import { getToForLink } from '../../utils/get-to-for-link';
import type { Product } from '../../types/interfaces';
import type { ErrorHandler } from '../../utils/error-handler';

vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
    Outlet: vi.fn(({ context }: { context?: { detailsId: string | null } }) => (
        <div data-testid="outlet">Outlet detailsId: {context?.detailsId}</div>
    )),
}));

vi.mock('../../components', () => ({
    Search: ({
        onSearch,
        query,
    }: {
        onSearch: (query: string) => void;
        query: string;
    }) => (
        <div data-testid="search">
            <span data-testid="search-query">{query}</span>

            <button type="button" onClick={() => onSearch('lipstick')}>
                Search mock
            </button>
        </div>
    ),

    CardList: ({ data }: { data: Product[] }) => (
        <div data-testid="card-list">
            {data.map((product) => (
                <div key={product.id}>{product.title}</div>
            ))}
        </div>
    ),
}));

vi.mock('../../components/content-state/content-state', () => ({
    ContentState: ({
        children,
        error,
        isLoading,
    }: {
        children: ReactNode;
        error: ErrorHandler | null;
        isLoading: boolean;
    }) => {
        if (error) {
            return <div role="alert">{error.getErrorMessageByStatus()}</div>;
        }

        if (isLoading) {
            return <div role="status">Loading...</div>;
        }

        return <>{children}</>;
    },
}));

vi.mock('../../components/pagination/pagination', () => ({
    Pagination: ({ page, total }: { page: number; total: number }) => (
        <div data-testid="pagination">
            Page: {page}, total: {total}
        </div>
    ),
}));

vi.mock('../../utils/hooks/use-app-state', () => ({
    useAppState: vi.fn(),
}));

vi.mock('../../utils/hooks/use-detalisation', () => ({
    useDetalisation: vi.fn(),
}));

vi.mock('../../utils/hooks/use-local-storage-hook', () => ({
    useLocalStorage: vi.fn(),
}));

vi.mock('../../utils/get-to-for-link', () => ({
    getToForLink: vi.fn(),
}));

vi.mock('../../constants', () => ({
    LOCAL_STORAGE_KEY: 'products-search-query',
}));

vi.mock('./products-page.module.scss', () => ({
    default: {
        page: 'page',
        resultsBlock: 'resultsBlock',
        resultsBlockWithOutlet: 'resultsBlockWithOutlet',
        actions: 'actions',
    },
}));

const products: Product[] = [
    {
        id: 1,
        title: 'Mascara',
        description: 'Black mascara',
        images: ['https://example.com/mascara.jpg'],
        category: 'beauty',
        price: "10",
        stock: 15,
    },
    {
        id: 2,
        title: 'Lipstick',
        description: 'Red lipstick',
        images: ['https://example.com/lipstick.jpg'],
        category: 'beauty',
        price: "20",
        stock: 8,
    },
];

const createUseAppStateMock = (
    overrides: Partial<ReturnType<typeof useAppState>> = {},
): ReturnType<typeof useAppState> => ({
    data: products,
    isLoading: false,
    error: null,
    fatalError: null,
    setFatalError: vi.fn(),
    total: products.length,
    ...overrides,
});

const createUseDetalisationMock = (
    overrides: Partial<ReturnType<typeof useDetalisation>> = {},
): ReturnType<typeof useDetalisation> => ({
    searchParams: new URLSearchParams(),
    detailsId: null,
    openDetails: vi.fn(),
    closeDetails: vi.fn(),
    ...overrides,
});

describe('ProductsPage', () => {
    const mockedUseNavigate = vi.mocked(useNavigate);
    const mockedUseSearchParams = vi.mocked(useSearchParams);
    const mockedUseAppState = vi.mocked(useAppState);
    const mockedUseDetalisation = vi.mocked(useDetalisation);
    const mockedUseLocalStorage = vi.mocked(useLocalStorage);
    const mockedGetToForLink = vi.mocked(getToForLink);
    const mockedOutlet = vi.mocked(Outlet);

    const navigate = vi.fn();
    const setLSValue = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockedUseNavigate.mockReturnValue(navigate);

        mockedUseSearchParams.mockReturnValue([
            new URLSearchParams(),
            vi.fn(),
        ] as unknown as ReturnType<typeof useSearchParams>);

        mockedUseLocalStorage.mockReturnValue([
            'mascara',
            setLSValue,
        ] as unknown as ReturnType<typeof useLocalStorage>);

        mockedUseDetalisation.mockReturnValue(createUseDetalisationMock());

        mockedGetToForLink.mockReturnValue({
            pathname: '/products',
            search: '?page=1',
        });

        mockedUseAppState.mockReturnValue(createUseAppStateMock());
    });

    it('renders Search with query from local storage', () => {
        render(<ProductsPage />);

        expect(screen.getByTestId('search')).toBeInTheDocument();
        expect(screen.getByTestId('search-query')).toHaveTextContent('mascara');
    });

    it('calls useAppState with query from local storage and default page', () => {
        render(<ProductsPage />);

        expect(mockedUseAppState).toHaveBeenCalledWith('mascara', 1);
    });

    it('uses page from search params', () => {
        mockedUseSearchParams.mockReturnValue([
            new URLSearchParams('page=3'),
            vi.fn(),
        ] as unknown as ReturnType<typeof useSearchParams>);

        render(<ProductsPage />);

        expect(mockedUseAppState).toHaveBeenCalledWith('mascara', 3);

        expect(screen.getByTestId('pagination')).toHaveTextContent(
            'Page: 3, total: 2',
        );
    });

    it('renders CardList with products', () => {
        render(<ProductsPage />);

        expect(screen.getByTestId('card-list')).toBeInTheDocument();
        expect(screen.getByText('Mascara')).toBeInTheDocument();
        expect(screen.getByText('Lipstick')).toBeInTheDocument();
    });

    it('renders Pagination when there is no error and loading is false', () => {
        render(<ProductsPage />);

        expect(screen.getByTestId('pagination')).toHaveTextContent(
            'Page: 1, total: 2',
        );
    });

    it('does not render Pagination while loading', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                isLoading: true,
            }),
        );

        render(<ProductsPage />);

        expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
        expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    });

    it('does not render Pagination when error exists', () => {
        const error = {
            getErrorMessageByStatus: vi.fn(() => 'Failed to load products'),
        } as unknown as ErrorHandler;

        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                error,
            }),
        );

        render(<ProductsPage />);

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Failed to load products',
        );

        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
        expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    });

    it('renders Outlet when detailsId exists', () => {
        mockedUseDetalisation.mockReturnValue(
            createUseDetalisationMock({
                detailsId: '12',
            }),
        );

        render(<ProductsPage />);

        expect(screen.getByTestId('outlet')).toHaveTextContent(
            'Outlet detailsId: 12',
        );

        expect(mockedOutlet).toHaveBeenCalledWith(
            expect.objectContaining({
                context: {
                    detailsId: '12',
                },
            }),
            undefined,
        );
    });

    it('does not render Outlet when detailsId is null', () => {
        render(<ProductsPage />);

        expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    });

    it('adds outlet modifier class when details are open', () => {
        mockedUseDetalisation.mockReturnValue(
            createUseDetalisationMock({
                detailsId: '12',
            }),
        );

        const { container } = render(<ProductsPage />);

        expect(container.querySelector('.resultsBlock')).toHaveClass(
            'resultsBlockWithOutlet',
        );
    });

    it('does not add outlet modifier class when details are closed', () => {
        const { container } = render(<ProductsPage />);

        expect(container.querySelector('.resultsBlock')).not.toHaveClass(
            'resultsBlockWithOutlet',
        );
    });

    it('navigates to first page and saves query on search', () => {
        render(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /search mock/i }));

        expect(mockedGetToForLink).toHaveBeenCalledWith(undefined, 1);
        expect(navigate).toHaveBeenCalledWith({
            pathname: '/products',
            search: '?page=1',
        });
        expect(setLSValue).toHaveBeenCalledWith('lipstick');
    });

    it('updates query state after search and calls useAppState with new query', () => {
        render(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /search mock/i }));

        expect(mockedUseAppState).toHaveBeenLastCalledWith('lipstick', 1);
    });
});