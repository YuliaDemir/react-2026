import { render, screen } from "@testing-library/react";
import Search from "../components/search/search";
import userEvent from '@testing-library/user-event';
import { bulbasaurName, localStorageKey } from "./constants";

describe('Search component ', () => {
    it('renders search input and search button', () => {
        const mockOnSearch = vi.fn();
        const text = 'Test search';

        render(<Search onSearch={mockOnSearch} value={text} />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: /search/i });

        expect(searchInput).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
    })

    it('Displays previously saved search term from localStorage on mount', () => {
        localStorage.setItem(localStorageKey, bulbasaurName);

        const mockOnSearch = vi.fn();
        const text = 'Test search';

        render(<Search onSearch={mockOnSearch} value={text} />);

        expect(screen.getByRole('textbox')).toHaveValue(bulbasaurName);
        localStorage.removeItem(localStorageKey);
    })

    it('Shows empty input when no saved term exists', () => {
        localStorage.removeItem(localStorageKey);

        const mockOnSearch = vi.fn();
        const text = 'Test search';

        render(<Search onSearch={mockOnSearch} value={text} />);
        expect(screen.getByRole('textbox')).toHaveValue('');
    })

    it('Updates input value when user types', async () => {
        const user = userEvent.setup();
        const mockOnSearch = vi.fn();

        render(<Search onSearch={mockOnSearch} value="" />);
        const input = screen.getByRole('textbox');

        await user.type(input, bulbasaurName);
        expect(input).toHaveValue(bulbasaurName);
    })

    it('Triggers search callback with correct parameters', async () => {
        const mockOnSearch = vi.fn();
        const user = userEvent.setup();

        render(<Search onSearch={mockOnSearch} value="" />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, bulbasaurName);
        await user.click(button);

        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith(bulbasaurName);
    })
})