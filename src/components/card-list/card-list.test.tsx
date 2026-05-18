import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CardList } from './card-list';
import type { Product } from '@/types/interfaces';

vi.mock('@components', () => ({
    Card: ({
        title,
        description,
        image,
    }: {
        title: string;
        description: string;
        image: string;
    }) => (
        <article data-testid="product-card">
            <h2>{title}</h2>
            <p>{description}</p>
            <img src={image} alt={title} />
        </article>
    ),

    OpenCloseDetailsLink: ({
        id,
        children,
        className,
        ...props
    }: {
        id: number;
        children: ReactNode;
        className?: string;
    }) => (
        <a
            href={`/products?details=${id}`}
            className={className}
            data-testid="details-link"
            {...props}
        >
            {children}
        </a>
    ),
}));

const products: Product[] = [
    {
        id: 1,
        title: 'Mascara',
        description: 'Black mascara',
        image: 'https://example.com/mascara.jpg',
        category: 'beauty',
        price: '10',
        stock: 15,
    },
    {
        id: 2,
        title: 'Lipstick',
        description: 'Red lipstick',
        image: 'https://example.com/lipstick.jpg',
        category: 'beauty',
        price: '20',
        stock: 8,
    },
];

describe('CardList', () => {
    it('renders list of product cards', () => {
        render(<CardList data={products} />);

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByTestId('card')).toHaveLength(2);

        expect(screen.getByText('Mascara')).toBeInTheDocument();
        expect(screen.getByText('Black mascara')).toBeInTheDocument();

        expect(screen.getByText('Lipstick')).toBeInTheDocument();
        expect(screen.getByText('Red lipstick')).toBeInTheDocument();
    });

    it('renders product images with correct src and alt', () => {
        render(<CardList data={products} />);

        expect(screen.getByRole('img', { name: /mascara/i })).toHaveAttribute(
            'src',
            'https://example.com/mascara.jpg',
        );

        expect(screen.getByRole('img', { name: /lipstick/i })).toHaveAttribute(
            'src',
            'https://example.com/lipstick.jpg',
        );
    });

    it('wraps every card with OpenCloseDetailsLink using product id', () => {
        render(<CardList data={products} />);

        const links = screen.getAllByTestId('details-link');

        expect(links).toHaveLength(2);

        expect(links[0]).toHaveAttribute('href', '/products?details=1');
        expect(links[0]).toHaveAttribute('data-product-card', 'true');

        expect(links[1]).toHaveAttribute('href', '/products?details=2');
        expect(links[1]).toHaveAttribute('data-product-card', 'true');
    });

    it('renders card content inside details link', () => {
        render(<CardList data={products} />);

        const firstCard = screen.getAllByTestId('card')[0];

        const link = within(firstCard).getByTestId('details-link');

        expect(within(link).getByText('Mascara')).toBeInTheDocument();
        expect(within(link).getByText('Black mascara')).toBeInTheDocument();
        expect(within(link).getByRole('img', { name: /mascara/i })).toBeInTheDocument();
    });

    it('renders empty list when data is empty', () => {
        render(<CardList data={[]} />);

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.queryAllByTestId('card')).toHaveLength(0);
        expect(screen.queryAllByTestId('details-link')).toHaveLength(0);
    });
});