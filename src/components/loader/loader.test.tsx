import { render, screen } from '@testing-library/react';
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

    it('applies loader class', () => {
        render(<Loader />);

        expect(screen.getByRole('status', { name: /loading/i })).toHaveClass(
            'loader',
        );
    });

    it('renders three dots', () => {
        const { container } = render(<Loader />);

        expect(container.querySelectorAll('span')).toHaveLength(3);
    });
});