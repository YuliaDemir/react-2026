import type { Pokemons } from "../../components/types/interfaces"

export const mockFetchSuccess = (results: Pokemons[]) => vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            results,
        })
    })
)

export const mockFetchSuccessBulbasaur = () => mockFetchSuccess([
    {
        name: 'Bulbasaur',
        url: "https://pokeapi.co/api/v2/pokemon/1/",
    }
]);

