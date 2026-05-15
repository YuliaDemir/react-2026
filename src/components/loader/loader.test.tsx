// loader.test.tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Loader } from './loader';

vi.mock('./loader.module.scss', () => ({
    default: {
        loader: 'loader',
        dot: 'dot',
    },
}));

describe('Loader', () => {
    it('renders loader with status role', () => {
        render(<Loader />);

        expect(
            screen.getByRole('status', { name: /loading/i }),
        ).toBeInTheDocument();
    });

    it('applies loader class to status element', () => {
        render(<Loader />);

        expect(screen.getByRole('status', { name: /loading/i })).toHaveClass(
            'loader',
        );
    });

    it('renders three dots inside loader', () => {
        render(<Loader />);

        const loader = screen.getByRole('status', { name: /loading/i });
        const dots = within(loader).getAllByText('', { selector: 'span' });

        expect(dots).toHaveLength(3);

        dots.forEach((dot) => {
            expect(dot).toHaveClass('dot');
        });
    });
});