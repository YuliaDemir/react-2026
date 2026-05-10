import App from '../App';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockFetchSuccessBulbasaurArray } from './test-utils/mock-fetch-success';
import { mockFetchFailure } from './test-utils/mock-fetch-failure';
import { mockFetchSuccessWithDelay } from './test-utils/mock-fetch-with-delay';
import { bulbasaurName, bulbasaurObject, localStorageKey, pikachuName } from './constants';

describe('App', () => {
    beforeEach(() => {
        localStorage.removeItem('query');
        mockFetchSuccessBulbasaurArray();
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

        await waitFor(() => expect(localStorage.getItem(localStorageKey)).toBe('bulbasaur'));
    })

    it('Trims whitespace from search input before saving', async () => {
        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, '   Bulbasaur  ');
        await user.click(button);

        expect(localStorage.getItem(localStorageKey)).toBe('bulbasaur');
    })

    it('Retrieves saved search term on component mount', () => {
        localStorage.setItem(localStorageKey, bulbasaurName);

        render(<App />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('Bulbasaur');
    })

    it('Overwrites existing localStorage value when new search is performed', async () => {
        localStorage.setItem(localStorageKey, bulbasaurName);
        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.clear(input);
        await user.type(input, pikachuName);
        await user.click(button);


        expect(localStorage.getItem(localStorageKey)).toBe(pikachuName.toLowerCase());
    })

    it('Displays failure message when data array is empty', async () => {
        mockFetchFailure(404);
        const { unmount } = render(<App />);

        const cards = screen.queryAllByTestId('card');
        const unableToLoad = await screen.findByText(/Unable to load/i);

        expect(cards).toHaveLength(0);
        expect(unableToLoad).toBeInTheDocument();

        unmount();

        localStorage.setItem(localStorageKey, bulbasaurName);
        mockFetchFailure(404);
        render(<App />);

        const cards2 = screen.queryAllByTestId('card');
        const notFound = await screen.findByText(/not found/i);

        expect(cards2).toHaveLength(0);
        expect(notFound).toBeInTheDocument();

    });

    it('Shows loading state while fetching data', async () => {
        mockFetchSuccessWithDelay([bulbasaurObject], 2000);

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await userEvent.type(input, bulbasaurName);
        await userEvent.click(button);

        const loader = await screen.findByTestId('loader');
        expect(loader).toBeInTheDocument();


        await waitFor(
            () => {
                expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    });
});