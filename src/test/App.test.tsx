import App from '../App';
import { render, screen } from "@testing-library/react";
import Search from "../components/search";
import userEvent from '@testing-library/user-event';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);

        expect(document.body).toBeInTheDocument();
    });

    it('Saves search term to localStorage when search button is clicked', async () => {
        localStorage.removeItem('query');

        const mockOnSearch = vi.fn();
        const user = userEvent.setup();

        render(<Search onSearch={mockOnSearch} value="" />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, 'Bulbasaur');
        await user.click(button);

        const savedQuery = localStorage.getItem('query');

        expect(savedQuery).toBe('Bulbasaur');

        localStorage.removeItem('query');
    })
});