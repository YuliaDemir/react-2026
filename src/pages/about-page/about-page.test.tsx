import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { AboutPage } from './about-page';

vi.mock('../../public/rss-logo.c19ce1b4.svg', () => ({
    default: 'rss-logo.svg',
}));

vi.mock('./about-page.module.scss', () => ({
    default: {
        page: 'page',
        title: 'title',
        text: 'text',
        schoolLink: 'schoolLink',
        schoolLogo: 'schoolLogo',
        link: 'link',
    },
}));

vi.mock('../../constants', () => ({
    LINKS: {
        home: '/products',
    },
}));

const renderAboutPage = () => {
    return render(
        <MemoryRouter>
            <AboutPage />
        </MemoryRouter>,
    );
};

describe('AboutPage', () => {
    it('renders about title', () => {
        renderAboutPage();

        expect(
            screen.getByRole('heading', { name: /about/i }),
        ).toBeInTheDocument();
    });

    it('renders about text', () => {
        renderAboutPage();

        expect(
            screen.getByText(
                'Я бурундук. У меня 4 лапки и две полоски. Люблю скакалку и батут.',
            ),
        ).toBeInTheDocument();
    });

    it('renders RS School external link', () => {
        renderAboutPage();

        const schoolLink = screen.getByRole('link', {
            name: /rs school logo/i,
        });

        expect(schoolLink).toBeInTheDocument();
        expect(schoolLink).toHaveAttribute('href', 'https://rs.school/');
        expect(schoolLink).toHaveAttribute('target', '_blank');
        expect(schoolLink).toHaveAttribute('rel', 'noreferrer');
    });

    it('renders RS School logo', () => {
        renderAboutPage();

        const logo = screen.getByRole('img', { name: /rs school logo/i });

        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'rss-logo.svg');
    });

    it('renders link back to products', () => {
        renderAboutPage();

        const link = screen.getByRole('link', { name: /back to products/i });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/products');
    });

    it('applies css module classes', () => {
        const { container } = renderAboutPage();

        expect(container.firstElementChild).toHaveClass('page');

        expect(screen.getByRole('heading', { name: /about/i })).toHaveClass(
            'title',
        );

        expect(
            screen.getByText(
                'Я бурундук. У меня 4 лапки и две полоски. Люблю скакалку и батут.',
            ),
        ).toHaveClass('text');

        expect(screen.getByRole('link', { name: /rs school logo/i })).toHaveClass(
            'schoolLink',
        );

        expect(screen.getByRole('img', { name: /rs school logo/i })).toHaveClass(
            'schoolLogo',
        );

        expect(screen.getByRole('link', { name: /back to products/i })).toHaveClass(
            'link',
        );
    });
});