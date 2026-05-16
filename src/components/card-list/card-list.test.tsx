import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CardList } from './card-list';
import type { Product } from '../../types/interfaces';

vi.mock('./card-list.module.scss', () => ({
    default: {
        list: 'list',
        item: 'item',
        cardButton: 'cardButton',
    },
}));

vi.mock('../card/card', () => ({
    Card: ({
        title,
        description,
        images,
    }: {
        title: string;
        description: string;
        images: string[];
    }) => (
        <div data-testid="card-component">
            <div>{title}</div>
            <div>{description}</div>
            <img src={images[0]} alt={title} />
        </div>
    ),
}));

vi.mock('../open-close-link/open-close-link', () => ({
    OpenCloseDetailsLink: ({
        id,
        className,
        children,
    }: {
        id?: number;
        className?: string;
        children: React.ReactNode;
    }) => (
        <a href={`/products?details=${id}`} className={className} data-testid="details-link">
            {children}
        </a>
    ),
}));

const products: Product[] = [
    {
        id: 1,
        title: 'iPhone 15',
        description: 'Apple smartphone',
        images: ['https://example.com/iphone.jpg'],
        price: "999",
        category: 'smartphones',
        stock: 10,
    },
    {
        id: 2,
        title: 'MacBook Pro',
        description: 'Apple laptop',
        images: ['https://example.com/macbook.jpg'],
        price: "2499",
        category: 'laptops',
        stock: 5,
    },
];

describe('CardList', () => {
    it('renders list', () => {
        const { container } = render(<CardList data={products} />);

        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(container.querySelector('ul')).toHaveClass('list');
    });

    it('renders card item for each product', () => {
        render(<CardList data={products} />);

        expect(screen.getAllByTestId('card')).toHaveLength(products.length);
        expect(screen.getAllByTestId('card-component')).toHaveLength(products.length);
    });

    it('renders product titles and descriptions', () => {
        render(<CardList data={products} />);

        expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        expect(screen.getByText('Apple smartphone')).toBeInTheDocument();

        expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        expect(screen.getByText('Apple laptop')).toBeInTheDocument();
    });

    it('passes product images to Card', () => {
        render(<CardList data={products} />);

        expect(screen.getByRole('img', { name: 'iPhone 15' })).toHaveAttribute(
            'src',
            'https://example.com/iphone.jpg',
        );

        expect(screen.getByRole('img', { name: 'MacBook Pro' })).toHaveAttribute(
            'src',
            'https://example.com/macbook.jpg',
        );
    });

    it('wraps each card with OpenCloseDetailsLink and passes product id', () => {
        render(<CardList data={products} />);

        const links = screen.getAllByTestId('details-link');

        expect(links).toHaveLength(products.length);

        expect(links[0]).toHaveAttribute('href', '/products?details=1');
        expect(links[1]).toHaveAttribute('href', '/products?details=2');
    });

    it('passes className to OpenCloseDetailsLink', () => {
        render(<CardList data={products} />);

        screen.getAllByTestId('details-link').forEach((link) => {
            expect(link).toHaveClass('cardButton');
        });
    });

    it('renders empty list when data is empty', () => {
        const { container } = render(<CardList data={[]} />);

        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(screen.queryAllByTestId('card')).toHaveLength(0);
    });
});