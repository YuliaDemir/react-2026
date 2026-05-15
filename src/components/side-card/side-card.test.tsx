// side-card.test.tsx
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SideCard } from './side-card';

vi.mock('./side-card.module.scss', () => ({
    default: {
        details: 'details',
        closeButton: 'closeButton',
    },
}));

vi.mock('../open-close-link/open-close-link', () => ({
    OpenCloseDetailsLink: ({
        children,
        className,
        'aria-label': ariaLabel,
    }: {
        children: ReactNode;
        className?: string;
        'aria-label'?: string;
    }) => (
        <button type="button" className={className} aria-label={ariaLabel}>
            {children}
        </button>
    ),
}));

describe('SideCard', () => {
    it('renders aside', () => {
        const { container } = render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(container.querySelector('aside')).toBeInTheDocument();
    });

    it('applies details class to aside', () => {
        const { container } = render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(container.querySelector('aside')).toHaveClass('details');
    });

    it('renders close details button', () => {
        render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(
            screen.getByRole('button', { name: /close details/i }),
        ).toBeInTheDocument();
    });

    it('renders close symbol inside button', () => {
        render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(screen.getByRole('button', { name: /close details/i })).toHaveTextContent(
            '×',
        );
    });

    it('passes closeButton class to OpenCloseDetailsLink', () => {
        render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(screen.getByRole('button', { name: /close details/i })).toHaveClass(
            'closeButton',
        );
    });

    it('renders children content', () => {
        render(
            <SideCard>
                <div>Product details</div>
            </SideCard>,
        );

        expect(screen.getByText('Product details')).toBeInTheDocument();
    });
});