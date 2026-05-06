export const mockFetchSuccess = () => vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            results: [{
                name: 'Bulbasaur',
                url: "https://pokeapi.co/api/v2/pokemon/1/",
            }]
        })
    })
)