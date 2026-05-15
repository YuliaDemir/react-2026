// card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Card } from './card';

vi.mock('./card.module.scss', () => ({
    default: {
        card: 'card',
        image: 'image',
        title: 'title',
        description: 'description',
    },
}));

describe('Card', () => {
    const props = {
        title: 'iPhone 15',
        description: 'Apple smartphone description',
        images: [
            'https://example.com/iphone-15-main.jpg',
            'https://example.com/iphone-15-second.jpg',
        ],
    };

    it('renders product title', () => {
        render(<Card {...props} />);

        expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });

    it('renders product description', () => {
        render(<Card {...props} />);

        expect(
            screen.getByText('Apple smartphone description'),
        ).toBeInTheDocument();
    });

    it('renders product image with correct src and alt', () => {
        render(<Card {...props} />);

        const image = screen.getByRole('img', { name: 'iPhone 15' });

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            'src',
            'https://example.com/iphone-15-main.jpg',
        );
        expect(image).toHaveAttribute('alt', 'iPhone 15');
    });

    it('uses first image from images array', () => {
        render(<Card {...props} />);

        const image = screen.getByRole('img', { name: 'iPhone 15' });

        expect(image).toHaveAttribute('src', props.images[0]);
        expect(image).not.toHaveAttribute('src', props.images[1]);
    });
});