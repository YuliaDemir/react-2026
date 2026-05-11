import type { MockFetchResponse } from "../../types/interfaces"

export const createFetchMock = (results: MockFetchResponse) => {
    return vi.fn().mockResolvedValue({
        ok: true,
        json: async () => (results),
    });
}

export const mockFetchSuccess = (results: MockFetchResponse) => {
    const fetchMock = createFetchMock(results);

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
};

export const mockFetchSuccessBulbasaurArray = () => mockFetchSuccess({ results: [bulbasaur] });

export const mockFetchSuccessBulbasaur = () => mockFetchSuccess(bulbasaur);


export const bulbasaur = {
    name: 'Bulbasaur',
    url: "https://pokeapi.co/api/v2/pokemon/1/",
};