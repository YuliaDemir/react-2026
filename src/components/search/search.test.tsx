import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Search } from './search';

vi.mock('./search.module.scss', () => ({
    default: {
        form: 'form',
        input: 'input',
        button: 'button',
    },
}));

describe('Search', () => {
    it('renders input with placeholder', () => {
        render(<Search query="" onSearch={vi.fn()} />);

        expect(
            screen.getByPlaceholderText(
                'Search items by name (e.g., Mascara, Lipstick, etc.)...',
            ),
        ).toBeInTheDocument();
    });

    it('renders input with initial query value', () => {
        render(<Search query="mascara" onSearch={vi.fn()} />);

        expect(screen.getByRole('textbox')).toHaveValue('mascara');
    });

    it('renders search button', () => {
        render(<Search query="" onSearch={vi.fn()} />);

        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('updates input value when user types', () => {
        render(<Search query="" onSearch={vi.fn()} />);

        const input = screen.getByRole('textbox');

        fireEvent.change(input, {
            target: {
                value: 'lipstick',
            },
        });

        expect(input).toHaveValue('lipstick');
    });

    it('calls onSearch with trimmed and lowercased query on submit', () => {
        const onSearch = vi.fn();

        render(<Search query="" onSearch={onSearch} />);

        fireEvent.change(screen.getByRole('textbox'), {
            target: {
                value: '  Lipstick  ',
            },
        });

        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('lipstick');
    });

    it('does not call onSearch when submitted query is equal to current query', () => {
        const onSearch = vi.fn();

        render(<Search query="mascara" onSearch={onSearch} />);

        fireEvent.change(screen.getByRole('textbox'), {
            target: {
                value: '  Mascara  ',
            },
        });

        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(onSearch).not.toHaveBeenCalled();
    });

    it('submits form when Enter is pressed', () => {
        const onSearch = vi.fn();

        render(<Search query="" onSearch={onSearch} />);

        fireEvent.change(screen.getByRole('textbox'), {
            target: {
                value: 'foundation',
            },
        });

        fireEvent.submit(screen.getByRole('textbox').closest('form')!);

        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('foundation');
    });

    it('applies css module classes', () => {
        render(<Search query="" onSearch={vi.fn()} />);

        expect(screen.getByRole('textbox')).toHaveClass('input');
        expect(screen.getByRole('button', { name: /search/i })).toHaveClass(
            'button',
        );
    });
});