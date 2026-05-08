import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { bulbasaur, mockFetchSuccessBulbasaur, mockFetchSuccessBulbasaurArray } from './test-utils/mock-fetch-success';
import { mockFetchSuccessWithDelay } from './test-utils/mock-fetch-with-delay';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

describe('App integration tests', () => {
    beforeEach(() => {
        localStorage.clear();
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
        expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
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
        mockFetchSuccessWithDelay([bulbasaur], 2000);

        render(<App />);

        const loadingText = await screen.findByText(/loading/i);

        expect(loadingText).toBeInTheDocument();

        await act(async () => {
            mockFetchSuccessBulbasaurArray();
        });

        await waitFor(() => { expect(loadingText).not.toBeInTheDocument(); }, { timeout: 3000 });

        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });
});