import App from '../App';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockFetchSuccess } from './test-utils/mock-fetch-success';

describe('App', () => {
    beforeEach(() => {
        localStorage.removeItem('query');
        mockFetchSuccess();
    })

    afterEach(() => {
        vi.unstubAllGlobals();
        localStorage.removeItem('query');
    });

    it('renders without crashing', () => {
        render(<App />);
        expect(document.body).toBeInTheDocument();
    });

    it('Saves search term to localStorage when search button is clicked', async () => {
        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, 'Bulbasaur');
        await user.click(button);

        await waitFor(() => expect(localStorage.getItem('query')).toBe('bulbasaur'));
    })

    it('Trims whitespace from search input before saving', async () => {
        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, '   Bulbasaur  ');
        await user.click(button);

        await waitFor(() => expect(localStorage.getItem('query')).toBe('bulbasaur'));
    })

    it('Retrieves saved search term on component mount', () => {
        localStorage.setItem('query', 'Bulbasaur');

        render(<App />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('Bulbasaur');
    })

    it('Overwrites existing localStorage value when new search is performed', async () => {
        localStorage.setItem('query', 'Bulbasaur');
        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.clear(input);
        await user.type(input, 'Pikachu');
        await user.click(button);


        expect(localStorage.getItem('query')).toBe('pikachu');
    })

});