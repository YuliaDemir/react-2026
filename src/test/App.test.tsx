import App from '../App';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockFetchSuccess } from './test-utils/mock-fetch-success';

describe('App', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders without crashing', () => {
        render(<App />);

        expect(document.body).toBeInTheDocument();
    });

    it('Saves search term to localStorage when search button is clicked', async () => {
        localStorage.removeItem('query');
        mockFetchSuccess();

        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, 'Bulbasaur');
        await user.click(button);

        await waitFor(() => expect(localStorage.getItem('query')).toBe('bulbasaur'));

        localStorage.removeItem('query');
    })

    it('Trims whitespace from search input before saving', async () => {
        localStorage.removeItem('query');
        mockFetchSuccess();

        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, '   Bulbasaur  ');
        await user.click(button);

        await waitFor(() => expect(localStorage.getItem('query')).toBe('bulbasaur'));


        localStorage.removeItem('query');
    })

});