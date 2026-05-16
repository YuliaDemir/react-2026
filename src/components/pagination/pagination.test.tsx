import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './pagination';

vi.mock('../../constants', () => ({
    PRODUCTS_PER_PAGE: 10,
}));

vi.mock('./pagination.module.scss', () => ({
    default: {
        paginationButton: 'paginationButton',
        disabled: 'disabled',
        pageInfo: 'pageInfo',
    },
}));

vi.mock('../open-close-link/open-close-link', () => ({
    OpenCloseDetailsLink: ({
        children,
        className,
        page,
    }: {
        children: React.ReactNode;
        className?: string;
        page: number;
    }) => (
        <button type="button" className={className} data-page={page}>
            {children}
        </button>
    ),
}));

describe('Pagination', () => {
    it('renders previous and next buttons', () => {
        render(<Pagination page={2} total={30} />);

        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('renders current page and max page info', () => {
        render(<Pagination page={2} total={30} />);

        expect(screen.getByText('Page: 2 from 3')).toBeInTheDocument();
    });

    it('passes previous page to Previous button', () => {
        render(<Pagination page={3} total={50} />);

        expect(screen.getByRole('button', { name: /previous/i })).toHaveAttribute(
            'data-page',
            '2',
        );
    });

    it('passes next page to Next button', () => {
        render(<Pagination page={3} total={50} />);

        expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute(
            'data-page',
            '4',
        );
    });

    it('does not allow previous page to be less than 1', () => {
        render(<Pagination page={1} total={50} />);

        expect(screen.getByRole('button', { name: /previous/i })).toHaveAttribute(
            'data-page',
            '1',
        );
    });

    it('does not allow next page to be greater than max page', () => {
        render(<Pagination page={5} total={50} />);

        expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute(
            'data-page',
            '5',
        );
    });

    it('adds disabled class to Previous button on first page', () => {
        render(<Pagination page={1} total={50} />);

        expect(screen.getByRole('button', { name: /previous/i })).toHaveClass(
            'paginationButton',
            'disabled',
        );
    });

    it('adds disabled class to Next button on last page', () => {
        render(<Pagination page={5} total={50} />);

        expect(screen.getByRole('button', { name: /next/i })).toHaveClass(
            'paginationButton',
            'disabled',
        );
    });

    it('does not add disabled class to buttons on middle page', () => {
        render(<Pagination page={3} total={50} />);

        expect(screen.getByRole('button', { name: /previous/i })).toHaveClass(
            'paginationButton',
        );
        expect(screen.getByRole('button', { name: /previous/i })).not.toHaveClass(
            'disabled',
        );

        expect(screen.getByRole('button', { name: /next/i })).toHaveClass(
            'paginationButton',
        );
        expect(screen.getByRole('button', { name: /next/i })).not.toHaveClass(
            'disabled',
        );
    });

    it('rounds max page up when total is not divisible by PRODUCTS_PER_PAGE', () => {
        render(<Pagination page={1} total={25} />);

        expect(screen.getByText('Page: 1 from 3')).toBeInTheDocument();
    });

    it('renders all products text when total is 0', () => {
        render(<Pagination page={1} total={0} />);

        expect(screen.getByText('Page: 1 from all products')).toBeInTheDocument();
    });
});