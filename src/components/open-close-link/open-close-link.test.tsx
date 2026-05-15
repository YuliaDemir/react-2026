// open-close-link.test.tsx
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OpenCloseDetailsLink } from './open-close-link';
import { getToForLink } from '../../utils/get-to-for-link';

vi.mock('../../utils/get-to-for-link', () => ({
    getToForLink: vi.fn(),
}));

describe('OpenCloseDetailsLink', () => {
    const mockedGetToForLink = vi.mocked(getToForLink);

    beforeEach(() => {
        vi.clearAllMocks();

        mockedGetToForLink.mockReturnValue({
            pathname: '/products',
            search: 'page=2&details=15',
        });
    });

    const renderOpenCloseDetailsLink = ({
        children = 'Open details',
        id,
        page,
        className,
    }: {
        children?: ReactNode;
        id?: number;
        page?: number;
        className?: string;
    } = {}) => {
        return render(
            <MemoryRouter>
                <OpenCloseDetailsLink id={id} page={page} className={className}>
                    {children}
                </OpenCloseDetailsLink>
            </MemoryRouter>,
        );
    };

    it('renders link with children', () => {
        renderOpenCloseDetailsLink({
            children: 'Product details',
        });

        expect(
            screen.getByRole('link', { name: /product details/i }),
        ).toBeInTheDocument();
    });

    it('passes id and page to getToForLink', () => {
        renderOpenCloseDetailsLink({
            id: 15,
            page: 2,
        });

        expect(mockedGetToForLink).toHaveBeenCalledTimes(1);
        expect(mockedGetToForLink).toHaveBeenCalledWith(15, 2);
    });

    it('passes undefined values to getToForLink when id and page are not provided', () => {
        renderOpenCloseDetailsLink();

        expect(mockedGetToForLink).toHaveBeenCalledTimes(1);
        expect(mockedGetToForLink).toHaveBeenCalledWith(undefined, undefined);
    });

    it('sets href from getToForLink result', () => {
        renderOpenCloseDetailsLink({
            id: 15,
            page: 2,
        });

        expect(screen.getByRole('link', { name: /open details/i })).toHaveAttribute(
            'href',
            '/products?page=2&details=15',
        );
    });

    it('applies className to link', () => {
        renderOpenCloseDetailsLink({
            className: 'linkClass',
        });

        expect(screen.getByRole('link', { name: /open details/i })).toHaveClass(
            'linkClass',
        );
    });

    it('renders ReactNode children', () => {
        renderOpenCloseDetailsLink({
            children: <span>Close details</span>,
        });

        expect(
            screen.getByRole('link', { name: /close details/i }),
        ).toBeInTheDocument();
    });
});