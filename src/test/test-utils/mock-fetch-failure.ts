export const mockFetchFailure = (status: number) => vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
        ok: false,
        status,
        json: async () => ({})
    })
);