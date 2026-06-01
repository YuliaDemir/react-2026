import type { MockFetchResponse } from "../../types"

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

export const mockFetchSuccessBulbasaurArray = () => mockFetchSuccess({ results: [bulbasaurObject] });

export const mockFetchSuccessBulbasaur = () => mockFetchSuccess(bulbasaurObject);