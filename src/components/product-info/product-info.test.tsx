// product-info.test.tsx
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { useOutletContext } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductInfo } from './product-info';
import { useAppState } from '../../utils/hooks/use-app-state';
import type { Product } from '../../types/interfaces';
import type { ErrorHandler } from '../../utils/error-handler';

vi.mock('react-router', () => ({
    useOutletContext: vi.fn(),
}));

vi.mock('../../utils/hooks/use-app-state', () => ({
    useAppState: vi.fn(),
}));

vi.mock('./product-info.module.scss', () => ({
    default: {
        card: 'card',
        image: 'image',
        title: 'title',
        info: 'info',
        infoItem: 'infoItem',
        label: 'label',
        value: 'value',
        description: 'description',
    },
}));

vi.mock('../content-state/content-state', () => ({
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

const product: Product = {
    id: 1,
    title: 'iPhone 15',
    description: 'Apple smartphone description',
    images: ['https://example.com/iphone.jpg'],
    category: 'smartphones',
    price: "999",
    stock: 12,
};

const createUseAppStateMock = (
    overrides: Partial<ReturnType<typeof useAppState>> = {},
): ReturnType<typeof useAppState> => ({
    data: [],
    isLoading: false,
    error: null,
    fatalError: null,
    setFatalError: vi.fn(),
    total: 0,
    ...overrides,
});

describe('ProductInfo', () => {
    const mockedUseOutletContext = vi.mocked(useOutletContext);
    const mockedUseAppState = vi.mocked(useAppState);

    beforeEach(() => {
        vi.clearAllMocks();

        mockedUseOutletContext.mockReturnValue({
            detailsId: '1',
        });
    });

    it('calls useAppState with detailsId from outlet context', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(mockedUseAppState).toHaveBeenCalledWith('1');
    });

    it('renders product image with correct src and alt', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByRole('img', { name: 'iPhone 15' })).toHaveAttribute(
            'src',
            'https://example.com/iphone.jpg',
        );
    });

    it('renders product title', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(
            screen.getByRole('heading', { name: /iphone 15/i }),
        ).toBeInTheDocument();
    });

    it('renders product category', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByText('Category:')).toBeInTheDocument();
        expect(screen.getByText('smartphones')).toBeInTheDocument();
    });

    it('renders product price', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByText('Price:')).toBeInTheDocument();
        expect(screen.getByText('$999')).toBeInTheDocument();
    });

    it('renders product stock', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByText('Stock:')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders product description', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                data: [product],
                total: 1,
            }),
        );

        render(<ProductInfo />);

        expect(
            screen.getByText('Apple smartphone description'),
        ).toBeInTheDocument();
    });

    it('renders fallback text when product is not found', () => {
        mockedUseAppState.mockReturnValue(createUseAppStateMock());

        render(<ProductInfo />);

        expect(screen.getByText('Upss. Something went wrong.')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                isLoading: true,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
        expect(
            screen.queryByText('Upss. Something went wrong.'),
        ).not.toBeInTheDocument();
    });

    it('renders error state', () => {
        const error = {
            getErrorMessageByStatus: vi.fn(() => 'Product loading failed'),
        } as unknown as ErrorHandler;

        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                error,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Product loading failed',
        );
        expect(error.getErrorMessageByStatus).toHaveBeenCalledTimes(1);
    });

    it('prioritizes error state over loading state', () => {
        const error = {
            getErrorMessageByStatus: vi.fn(() => 'Server error'),
        } as unknown as ErrorHandler;

        mockedUseAppState.mockReturnValue(
            createUseAppStateMock({
                isLoading: true,
                error,
            }),
        );

        render(<ProductInfo />);

        expect(screen.getByRole('alert')).toHaveTextContent('Server error');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});