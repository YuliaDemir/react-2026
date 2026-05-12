import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { mockFetchSuccessBulbasaur, mockFetchSuccessBulbasaurArray } from './test-utils/mock-fetch-success';
import { mockFetchSuccessWithDelay } from './test-utils/mock-fetch-with-delay';
import userEvent from '@testing-library/user-event';
import { API_URL, bulbasaurName, bulbasaurObject, pikachuName } from './constants';


describe('App integration tests', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.unstubAllGlobals();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('makes initial API call on component mount', async () => {
        const fetchMock = mockFetchSuccessBulbasaurArray();

        render(<App />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/?offset=0&limit=20`);
        expect(await screen.findByText(bulbasaurName)).toBeInTheDocument();
    });

    it('handles search term from localStorage on initial load', async () => {
        localStorage.setItem('query', ' Bulbasaur ');
        const fetchMock = mockFetchSuccessBulbasaur();

        render(<App />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/bulbasaur`);
        expect(await screen.findByText(/^Bulbasaur$/i)).toBeInTheDocument();
        expect(localStorage.getItem('query')).toBe('bulbasaur');
    });

    it('manages loading states during API calls', async () => {
        mockFetchSuccessWithDelay([bulbasaurObject], 2000);

        render(<App />);

        const loadingText = await screen.findByText(/loading/i);

        expect(loadingText).toBeInTheDocument();

        mockFetchSuccessBulbasaurArray();
        await waitFor(() => { expect(loadingText).not.toBeInTheDocument(); }, { timeout: 3000 });

        expect(screen.getByText(bulbasaurName)).toBeInTheDocument();
    });

    it('calls API with correct parameters on initial load', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    {
                        name: bulbasaurName,
                        url: `${API_URL}/1/`,
                    },
                ],
            }),
        });

        vi.stubGlobal('fetch', fetchMock);

        render(<App />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(
                `${API_URL}/?offset=0&limit=20`
            );
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    });

    it('handles successful API responses', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: pikachuName,
                            url: `${API_URL}/25/`,
                        },
                    ],
                }),
            })
        );

        render(<App />);

        expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
        expect(screen.queryByText(/unable to load/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    });

    it('handles API error responses on initial load', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({}),
            })
        );

        render(<App />);

        expect(await screen.findByText(/unable to load pokémon list/i)).toBeInTheDocument();
        expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('handles API error responses when search fails', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [],
                }),
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({}),
            });

        vi.stubGlobal('fetch', fetchMock);

        const user = userEvent.setup();

        render(<App />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /search/i });

        await user.type(input, 'wrong-pokemon-name');
        await user.click(button);

        expect(await screen.findByText(/pokemon not found/i)).toBeInTheDocument();

        expect(fetchMock).toHaveBeenLastCalledWith(
            `${API_URL}/wrong-pokemon-name`
        );

        expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('handles network error responses', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockRejectedValue(new Error('Network failed'))
        );

        render(<App />);

        expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });
});