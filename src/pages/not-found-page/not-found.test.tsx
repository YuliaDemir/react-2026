// not-found-page.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { NotFoundPage } from './not-found-page';

vi.mock('./not-found-page.module.scss', () => ({
    default: {
        page: 'page',
        code: 'code',
        title: 'title',
        link: 'link',
    },
}));

vi.mock('../../constants', () => ({
    LINKS: {
        home: '/products',
    },
}));

const renderNotFoundPage = () => {
    return render(
        <MemoryRouter>
            <NotFoundPage />
        </MemoryRouter>,
    );
};

describe('NotFoundPage', () => {
    it('renders 404 code', () => {
        renderNotFoundPage();

        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders page not found title', () => {
        renderNotFoundPage();

        expect(
            screen.getByRole('heading', { name: /page not found/i }),
        ).toBeInTheDocument();
    });

    it('renders link to products page', () => {
        renderNotFoundPage();

        expect(
            screen.getByRole('link', { name: /go to products/i }),
        ).toBeInTheDocument();
    });

    it('sets correct href for products link', () => {
        renderNotFoundPage();

        expect(screen.getByRole('link', { name: /go to products/i })).toHaveAttribute(
            'href',
            '/products',
        );
    });

    it('applies css module classes', () => {
        const { container } = renderNotFoundPage();

        expect(container.firstElementChild).toHaveClass('page');
        expect(screen.getByText('404')).toHaveClass('code');
        expect(
            screen.getByRole('heading', { name: /page not found/i }),
        ).toHaveClass('title');
        expect(screen.getByRole('link', { name: /go to products/i })).toHaveClass(
            'link',
        );
    });
});